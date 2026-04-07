import os
import requests
import json

LOGIN = os.environ["DATAFORSEO_LOGIN"]
PASSWORD = os.environ["DATAFORSEO_PASSWORD"]

API_URL = "https://api.dataforseo.com/v3/dataforseo_labs/google/ranked_keywords/live"

def get_keywords(domain, item_type, limit=100):
    """Get ranked keywords for a domain (organic or paid)."""
    payload = [{
        "target": domain,
        "location_code": 2840,  # United States
        "language_code": "en",
        "limit": limit,
        "item_types": [item_type],
        "order_by": ["ranked_serp_element.serp_item.etv,desc"]
    }]

    response = requests.post(
        API_URL,
        json=payload,
        auth=(LOGIN, PASSWORD),
        headers={"Content-Type": "application/json"}
    )
    return response.json()


def print_keywords(data, domain, keyword_type):
    """Print keyword results in a readable format."""
    print(f"\n{'='*80}")
    print(f"  {domain.upper()} - {keyword_type.upper()} KEYWORDS")
    print(f"{'='*80}")

    if data.get("status_code") != 20000:
        print(f"  API Error: {data.get('status_message', 'Unknown error')}")
        return

    for task in data.get("tasks", []):
        if task.get("status_code") != 20000:
            print(f"  Task Error: {task.get('status_message', 'Unknown error')}")
            continue

        result = task.get("result", [{}])[0]
        total = result.get("total_count", 0)
        metrics = result.get("metrics", {}).get(keyword_type, {})

        print(f"\n  Total {keyword_type} keywords found: {total}")
        print(f"  Estimated Traffic Volume (ETV): {metrics.get('etv', 'N/A')}")
        print(f"  Estimated Cost: ${metrics.get('estimated_paid_traffic_cost', 0):,.2f}")
        print(f"  Keyword count: {metrics.get('count', 'N/A')}")

        # Position distribution
        pos_keys = ['pos_1', 'pos_2_3', 'pos_4_10', 'pos_11_20', 'pos_21_30',
                     'pos_31_40', 'pos_41_50', 'pos_51_60', 'pos_61_70', 'pos_71_80',
                     'pos_81_90', 'pos_91_100']
        print(f"\n  Position Distribution:")
        for pk in pos_keys:
            val = metrics.get(pk, 0)
            if val:
                print(f"    {pk.replace('pos_', 'Position ').replace('_', '-')}: {val}")

        items = result.get("items", [])
        if items:
            print(f"\n  {'Keyword':<45} {'Vol':>8} {'Pos':>5} {'CPC':>8} {'Traffic':>10}")
            print(f"  {'-'*45} {'-'*8} {'-'*5} {'-'*8} {'-'*10}")

            for item in items:
                kw_data = item.get("keyword_data", {})
                kw_info = kw_data.get("keyword_info", {})
                serp_item = item.get("ranked_serp_element", {}).get("serp_item", {})

                keyword = kw_data.get("keyword", "N/A")[:44]
                volume = kw_info.get("search_volume", 0) or 0
                position = serp_item.get("rank_group", "N/A")
                cpc = kw_info.get("cpc", 0) or 0
                etv = serp_item.get("etv", 0) or 0

                print(f"  {keyword:<45} {volume:>8,} {position:>5} ${cpc:>7.2f} {etv:>10,.1f}")
        else:
            print(f"\n  No {keyword_type} keyword items returned.")


# Collect all data for cross-company comparison
domains = ["five9.com", "verint.com", "genesys.com"]
keyword_types = ["organic", "paid"]
all_data = {}

for domain in domains:
    all_data[domain] = {}
    for kw_type in keyword_types:
        print(f"\nFetching {kw_type} keywords for {domain}...")
        data = get_keywords(domain, kw_type, limit=50)
        all_data[domain][kw_type] = data
        print_keywords(data, domain, kw_type)


# Cross-company comparison
def extract_metrics(data, kw_type):
    """Extract summary metrics from API response."""
    for task in data.get("tasks", []):
        if task.get("status_code") == 20000:
            result = task.get("result", [{}])[0]
            metrics = result.get("metrics", {}).get(kw_type, {})
            return {
                "total": result.get("total_count", 0),
                "etv": metrics.get("etv", 0),
                "cost": metrics.get("estimated_paid_traffic_cost", 0),
                "count": metrics.get("count", 0),
                "pos_1": metrics.get("pos_1", 0),
                "pos_2_3": metrics.get("pos_2_3", 0),
                "pos_4_10": metrics.get("pos_4_10", 0),
                "top_10": metrics.get("pos_1", 0) + metrics.get("pos_2_3", 0) + metrics.get("pos_4_10", 0),
            }
    return {}


def extract_keywords(data):
    """Extract keyword list from API response."""
    keywords = []
    for task in data.get("tasks", []):
        if task.get("status_code") == 20000:
            result = task.get("result", [{}])[0]
            for item in result.get("items", []):
                kw_data = item.get("keyword_data", {})
                kw_info = kw_data.get("keyword_info", {})
                serp_item = item.get("ranked_serp_element", {}).get("serp_item", {})
                keywords.append({
                    "keyword": kw_data.get("keyword", ""),
                    "volume": kw_info.get("search_volume", 0) or 0,
                    "cpc": kw_info.get("cpc", 0) or 0,
                    "position": serp_item.get("rank_group", 0),
                    "etv": serp_item.get("etv", 0) or 0,
                })
    return keywords


print(f"\n\n{'#'*80}")
print(f"{'#'*80}")
print(f"  CROSS-COMPANY COMPARISON: SEO & SEM")
print(f"{'#'*80}")
print(f"{'#'*80}")

# --- SEO (Organic) Comparison ---
print(f"\n{'='*80}")
print(f"  SEO (ORGANIC) COMPARISON")
print(f"{'='*80}")
print(f"\n  {'Metric':<35} {'Five9':>14} {'Verint':>14} {'Genesys':>14}")
print(f"  {'-'*35} {'-'*14} {'-'*14} {'-'*14}")

org_metrics = {d: extract_metrics(all_data[d]["organic"], "organic") for d in domains}
for label, key in [
    ("Total Organic Keywords", "total"),
    ("Est. Monthly Traffic (ETV)", "etv"),
    ("Est. Traffic Value ($/mo)", "cost"),
    ("Position 1 Keywords", "pos_1"),
    ("Position 2-3 Keywords", "pos_2_3"),
    ("Position 4-10 Keywords", "pos_4_10"),
    ("Total Top-10 Keywords", "top_10"),
]:
    vals = [org_metrics[d].get(key, 0) for d in domains]
    if key == "cost":
        print(f"  {label:<35} ${vals[0]:>12,.0f} ${vals[1]:>12,.0f} ${vals[2]:>12,.0f}")
    elif key == "etv":
        print(f"  {label:<35} {vals[0]:>13,.0f} {vals[1]:>13,.0f} {vals[2]:>13,.0f}")
    else:
        print(f"  {label:<35} {vals[0]:>14,} {vals[1]:>14,} {vals[2]:>14,}")

# --- SEM (Paid) Comparison ---
print(f"\n{'='*80}")
print(f"  SEM (PAID) COMPARISON")
print(f"{'='*80}")
print(f"\n  {'Metric':<35} {'Five9':>14} {'Verint':>14} {'Genesys':>14}")
print(f"  {'-'*35} {'-'*14} {'-'*14} {'-'*14}")

paid_metrics = {d: extract_metrics(all_data[d]["paid"], "paid") for d in domains}
for label, key in [
    ("Total Paid Keywords", "total"),
    ("Est. Paid Traffic (ETV)", "etv"),
    ("Est. Ad Spend ($/mo)", "cost"),
    ("Position 1 (Top Ad Slot)", "pos_1"),
    ("Position 2-3", "pos_2_3"),
    ("Position 4-10", "pos_4_10"),
]:
    vals = [paid_metrics[d].get(key, 0) for d in domains]
    if key in ("cost",):
        print(f"  {label:<35} ${vals[0]:>12,.0f} ${vals[1]:>12,.0f} ${vals[2]:>12,.0f}")
    elif key == "etv":
        print(f"  {label:<35} {vals[0]:>13,.0f} {vals[1]:>13,.0f} {vals[2]:>13,.0f}")
    else:
        print(f"  {label:<35} {vals[0]:>14,} {vals[1]:>14,} {vals[2]:>14,}")

# --- Overlapping Keywords ---
print(f"\n{'='*80}")
print(f"  KEYWORD OVERLAP ANALYSIS")
print(f"{'='*80}")

for kw_type in keyword_types:
    kw_sets = {}
    for d in domains:
        kws = extract_keywords(all_data[d][kw_type])
        kw_sets[d] = {k["keyword"] for k in kws}

    all_three = kw_sets["five9.com"] & kw_sets["verint.com"] & kw_sets["genesys.com"]
    f9_ver = kw_sets["five9.com"] & kw_sets["verint.com"] - kw_sets["genesys.com"]
    f9_gen = kw_sets["five9.com"] & kw_sets["genesys.com"] - kw_sets["verint.com"]
    ver_gen = kw_sets["verint.com"] & kw_sets["genesys.com"] - kw_sets["five9.com"]

    print(f"\n  {kw_type.upper()} keyword overlaps (from top-50 per domain):")
    print(f"    All three companies:     {', '.join(sorted(all_three)) if all_three else 'None'}")
    print(f"    Five9 & Verint only:     {', '.join(sorted(f9_ver)) if f9_ver else 'None'}")
    print(f"    Five9 & Genesys only:    {', '.join(sorted(f9_gen)) if f9_gen else 'None'}")
    print(f"    Verint & Genesys only:   {', '.join(sorted(ver_gen)) if ver_gen else 'None'}")

# --- Competitor brand bidding analysis ---
print(f"\n{'='*80}")
print(f"  SEM: COMPETITOR BRAND BIDDING ANALYSIS")
print(f"{'='*80}")

brand_terms = {
    "five9.com": ["five9", "five 9", "5nine"],
    "verint.com": ["verint"],
    "genesys.com": ["genesys", "genesys cloud"],
}
competitor_brands = ["five9", "verint", "genesys", "nice", "talkdesk", "avaya",
                     "cisco", "ringcentral", "twilio", "dialpad", "8x8", "vonage",
                     "nextiva", "zoom", "salesforce", "zendesk", "freshdesk", "freshcaller"]

for domain in domains:
    paid_kws = extract_keywords(all_data[domain]["paid"])
    brand_bids = []
    for kw in paid_kws:
        keyword_lower = kw["keyword"].lower()
        for brand in competitor_brands:
            own_brands = [b.lower() for b in brand_terms.get(domain, [])]
            if brand in keyword_lower and brand not in " ".join(own_brands):
                brand_bids.append((kw["keyword"], brand, kw["volume"], kw["cpc"], kw["position"]))
                break

    print(f"\n  {domain.upper()} - Bidding on competitor brands:")
    if brand_bids:
        print(f"    {'Keyword':<40} {'Brand':<12} {'Vol':>8} {'CPC':>8} {'Pos':>5}")
        print(f"    {'-'*40} {'-'*12} {'-'*8} {'-'*8} {'-'*5}")
        for kw, brand, vol, cpc, pos in brand_bids:
            print(f"    {kw:<40} {brand:<12} {vol:>8,} ${cpc:>7.2f} {pos:>5}")
    else:
        print(f"    No competitor brand bidding detected in top keywords.")

print(f"\n{'='*80}")
print(f"  ANALYSIS COMPLETE")
print(f"{'='*80}")
