import os
import requests
import json
from collections import defaultdict
import time

LOGIN = os.environ["DATAFORSEO_LOGIN"]
PASSWORD = os.environ["DATAFORSEO_PASSWORD"]
AUTH = (LOGIN, PASSWORD)
HEADERS = {"Content-Type": "application/json"}
BASE = "https://api.dataforseo.com/v3"

# ─────────────────────────────────────────────
# PHASE 1: Discover competitors programmatically
# ─────────────────────────────────────────────
print("\n" + "#"*80)
print("  PHASE 1: DISCOVERING COMPETITORS VIA DATAFORSEO")
print("#"*80)

def get_competitors(domain):
    url = f"{BASE}/dataforseo_labs/google/competitors_domain/live"
    payload = [{
        "target": domain,
        "location_code": 2840,
        "language_code": "en",
        "filters": ["relevant_serp_items", ">", 5],
        "order_by": ["avg_position,asc"],
        "limit": 30
    }]
    r = requests.post(url, json=payload, auth=AUTH, headers=HEADERS)
    return r.json()

core_domains = ["five9.com", "verint.com", "genesys.com"]
all_competitors = defaultdict(lambda: {"count": 0, "avg_pos": [], "domains_found_from": []})

for domain in core_domains:
    print(f"\n  Finding competitors for {domain}...")
    data = get_competitors(domain)
    for task in data.get("tasks", []):
        if task.get("status_code") == 20000:
            result = task.get("result", [{}])[0]
            items = result.get("items", [])
            print(f"    Found {len(items)} competitors")
            for item in items:
                comp = item.get("domain", "")
                if comp and comp not in core_domains:
                    avg_pos = item.get("avg_position", 100)
                    all_competitors[comp]["count"] += 1
                    all_competitors[comp]["avg_pos"].append(avg_pos)
                    all_competitors[comp]["domains_found_from"].append(domain)

# Rank competitors by how many core domains they compete with
sorted_comps = sorted(all_competitors.items(), key=lambda x: (-x[1]["count"], min(x[1]["avg_pos"])))

print(f"\n  TOP COMPETITORS (found competing with 2+ core domains):")
print(f"  {'Domain':<35} {'Overlap':>8} {'Best Avg Pos':>12} {'Found Via'}")
print(f"  {'-'*35} {'-'*8} {'-'*12} {'-'*30}")

expanded_set = list(core_domains)
for comp, info in sorted_comps[:25]:
    avg = min(info["avg_pos"])
    via = ", ".join(info["domains_found_from"])
    print(f"  {comp:<35} {info['count']:>8} {avg:>12.1f} {via}")
    if info["count"] >= 2 and len(expanded_set) < 12:
        expanded_set.append(comp)

# Also force-add key known competitors if not already found
force_add = ["nice.com", "talkdesk.com", "8x8.com", "ringcentral.com",
             "avaya.com", "dialpad.com", "twilio.com", "vonage.com"]
for fa in force_add:
    if fa not in expanded_set:
        expanded_set.append(fa)

print(f"\n  EXPANDED COMPETITIVE SET ({len(expanded_set)} domains):")
for d in expanded_set:
    tag = " (CORE)" if d in core_domains else ""
    print(f"    - {d}{tag}")


# ─────────────────────────────────────────────
# PHASE 2: Pull top traffic-driving keywords for ALL competitors
# ─────────────────────────────────────────────
print("\n\n" + "#"*80)
print("  PHASE 2: PULLING TOP KEYWORDS FOR FULL COMPETITIVE SET")
print("#"*80)

def get_ranked_keywords(domain, item_type, limit=100):
    url = f"{BASE}/dataforseo_labs/google/ranked_keywords/live"
    payload = [{
        "target": domain,
        "location_code": 2840,
        "language_code": "en",
        "limit": limit,
        "item_types": [item_type],
        "order_by": ["ranked_serp_element.serp_item.etv,desc"]
    }]
    r = requests.post(url, json=payload, auth=AUTH, headers=HEADERS)
    return r.json()

def extract_kw_data(data, kw_type):
    keywords = []
    metrics = {}
    for task in data.get("tasks", []):
        if task.get("status_code") == 20000:
            result = task.get("result", [{}])[0]
            m = result.get("metrics", {}).get(kw_type, {})
            metrics = {
                "total": result.get("total_count", 0),
                "etv": m.get("etv", 0),
                "cost": m.get("estimated_paid_traffic_cost", 0),
                "count": m.get("count", 0),
                "pos_1": m.get("pos_1", 0),
                "pos_2_3": m.get("pos_2_3", 0),
                "pos_4_10": m.get("pos_4_10", 0),
            }
            for item in result.get("items", []):
                kd = item.get("keyword_data", {})
                ki = kd.get("keyword_info", {})
                si = item.get("ranked_serp_element", {}).get("serp_item", {})
                keywords.append({
                    "keyword": kd.get("keyword", ""),
                    "volume": ki.get("search_volume", 0) or 0,
                    "cpc": ki.get("cpc", 0) or 0,
                    "competition": ki.get("competition", 0) or 0,
                    "position": si.get("rank_group", 0),
                    "etv": si.get("etv", 0) or 0,
                    "type": si.get("type", ""),
                })
    return keywords, metrics

# Collect everything
all_keywords = {}  # domain -> {organic: [...], paid: [...]}
all_metrics = {}   # domain -> {organic: {...}, paid: {...}}

for domain in expanded_set:
    all_keywords[domain] = {}
    all_metrics[domain] = {}
    for kw_type in ["organic", "paid"]:
        print(f"  Fetching {kw_type} keywords for {domain}...")
        data = get_ranked_keywords(domain, kw_type, limit=100)
        kws, mets = extract_kw_data(data, kw_type)
        all_keywords[domain][kw_type] = kws
        all_metrics[domain][kw_type] = mets
        time.sleep(0.2)  # rate limiting


# ─────────────────────────────────────────────
# PHASE 3: COMPETITIVE LANDSCAPE OVERVIEW
# ─────────────────────────────────────────────
print("\n\n" + "#"*80)
print("  PHASE 3: COMPETITIVE LANDSCAPE OVERVIEW")
print("#"*80)

# 3A: Organic overview
print(f"\n{'='*110}")
print(f"  SEO (ORGANIC) LANDSCAPE - ALL COMPETITORS")
print(f"{'='*110}")
print(f"\n  {'Domain':<25} {'Total KWs':>10} {'Traffic':>12} {'Value ($/mo)':>14} {'#1':>6} {'Top 3':>6} {'Top 10':>7}")
print(f"  {'-'*25} {'-'*10} {'-'*12} {'-'*14} {'-'*6} {'-'*6} {'-'*7}")

org_sorted = sorted(expanded_set, key=lambda d: all_metrics[d].get("organic", {}).get("etv", 0), reverse=True)
for d in org_sorted:
    m = all_metrics[d].get("organic", {})
    if not m:
        continue
    top3 = m.get("pos_1", 0) + m.get("pos_2_3", 0)
    top10 = top3 + m.get("pos_4_10", 0)
    print(f"  {d:<25} {m.get('total',0):>10,} {m.get('etv',0):>12,.0f} ${m.get('cost',0):>12,.0f} {m.get('pos_1',0):>6,} {top3:>6,} {top10:>7,}")

# 3B: Paid overview
print(f"\n{'='*110}")
print(f"  SEM (PAID) LANDSCAPE - ALL COMPETITORS")
print(f"{'='*110}")
print(f"\n  {'Domain':<25} {'Total KWs':>10} {'Paid Traffic':>12} {'Ad Spend $/mo':>14} {'#1':>6} {'Top 3':>6}")
print(f"  {'-'*25} {'-'*10} {'-'*12} {'-'*14} {'-'*6} {'-'*6}")

paid_sorted = sorted(expanded_set, key=lambda d: all_metrics[d].get("paid", {}).get("cost", 0), reverse=True)
for d in paid_sorted:
    m = all_metrics[d].get("paid", {})
    if not m:
        continue
    top3 = m.get("pos_1", 0) + m.get("pos_2_3", 0)
    print(f"  {d:<25} {m.get('total',0):>10,} {m.get('etv',0):>12,.0f} ${m.get('cost',0):>12,.0f} {m.get('pos_1',0):>6,} {top3:>6,}")


# ─────────────────────────────────────────────
# PHASE 4: HIGH-INTENT KEYWORD UNIVERSE
# ─────────────────────────────────────────────
print("\n\n" + "#"*80)
print("  PHASE 4: HIGH-INTENT KEYWORD UNIVERSE")
print("#"*80)

# Collect ALL unique keywords across all competitors
keyword_universe = {}  # keyword -> {volume, cpc, competition, domains: {domain: {pos, etv, type}}}

for domain in expanded_set:
    for kw_type in ["organic", "paid"]:
        for kw in all_keywords[domain].get(kw_type, []):
            keyword = kw["keyword"]
            if keyword not in keyword_universe:
                keyword_universe[keyword] = {
                    "volume": kw["volume"],
                    "cpc": kw["cpc"],
                    "competition": kw["competition"],
                    "domains_organic": {},
                    "domains_paid": {},
                }
            # Update with highest volume/cpc seen
            if kw["volume"] > keyword_universe[keyword]["volume"]:
                keyword_universe[keyword]["volume"] = kw["volume"]
            if kw["cpc"] > keyword_universe[keyword]["cpc"]:
                keyword_universe[keyword]["cpc"] = kw["cpc"]

            if kw_type == "organic":
                keyword_universe[keyword]["domains_organic"][domain] = {
                    "position": kw["position"], "etv": kw["etv"]
                }
            else:
                keyword_universe[keyword]["domains_paid"][domain] = {
                    "position": kw["position"], "etv": kw["etv"]
                }

# Filter for high-intent keywords (CPC > $5 = commercial intent, or multiple competitors bidding)
high_intent = []
for kw, data in keyword_universe.items():
    num_organic = len(data["domains_organic"])
    num_paid = len(data["domains_paid"])
    intent_score = 0

    # CPC-based intent scoring
    if data["cpc"] >= 50:
        intent_score += 5
    elif data["cpc"] >= 25:
        intent_score += 4
    elif data["cpc"] >= 10:
        intent_score += 3
    elif data["cpc"] >= 5:
        intent_score += 2

    # Multiple competitors = validated keyword
    intent_score += min(num_organic, 4)
    intent_score += num_paid * 2  # paid signals are stronger

    # Volume bonus
    if data["volume"] >= 10000:
        intent_score += 2
    elif data["volume"] >= 1000:
        intent_score += 1

    if intent_score >= 4 and data["cpc"] >= 3:
        high_intent.append({
            "keyword": kw,
            "volume": data["volume"],
            "cpc": data["cpc"],
            "intent_score": intent_score,
            "num_organic": num_organic,
            "num_paid": num_paid,
            "data": data,
        })

high_intent.sort(key=lambda x: (-x["intent_score"], -x["volume"]))

print(f"\n  Found {len(high_intent)} high-intent keywords across {len(expanded_set)} competitors")
print(f"\n  TOP 50 HIGH-INTENT KEYWORDS (scored by CPC, competition density, volume):")
print(f"\n  {'#':>3} {'Keyword':<45} {'Vol':>8} {'CPC':>8} {'Score':>6} {'Org#':>5} {'Paid#':>5} {'Who Ranks Organic'}")
print(f"  {'-'*3} {'-'*45} {'-'*8} {'-'*8} {'-'*6} {'-'*5} {'-'*5} {'-'*40}")

for i, item in enumerate(high_intent[:50], 1):
    who_organic = []
    for d, info in sorted(item["data"]["domains_organic"].items(), key=lambda x: x[1]["position"]):
        short = d.replace(".com", "")[:8]
        who_organic.append(f"{short}(#{info['position']})")
    who_str = ", ".join(who_organic[:4])
    if len(who_organic) > 4:
        who_str += f" +{len(who_organic)-4}"

    print(f"  {i:>3} {item['keyword']:<45} {item['volume']:>8,} ${item['cpc']:>7.2f} {item['intent_score']:>6} {item['num_organic']:>5} {item['num_paid']:>5} {who_str}")


# ─────────────────────────────────────────────
# PHASE 5: CATEGORY KEYWORD MAPPING
# ─────────────────────────────────────────────
print("\n\n" + "#"*80)
print("  PHASE 5: CATEGORY KEYWORD MAPPING")
print("#"*80)

categories = {
    "Contact Center / CCaaS": ["contact center", "call center", "ccaas", "cloud contact", "cloud call center",
                                "contact centre", "call centre", "hosted contact", "virtual call center"],
    "AI & Automation": ["ai call", "ai contact", "chatbot", "conversational ai", "ai agent", "ai answering",
                        "virtual agent", "ai customer", "generative ai", "ai-powered"],
    "Workforce Management": ["workforce management", "workforce engagement", "workforce optimization",
                             "wfm", "wfo", "agent scheduling", "quality management", "quality monitoring"],
    "IVR & Voice": ["ivr", "interactive voice", "speech analytics", "speech to text", "voice bot",
                    "voicebot", "voice ai", "text to speech"],
    "Omnichannel": ["omnichannel", "multichannel", "unified communications", "digital channel"],
    "CX / Customer Experience": ["customer experience", "customer satisfaction", "customer engagement",
                                  "customer journey", "cx platform", "customer feedback", "nps", "csat"],
    "Dialer / Outbound": ["dialer", "predictive dial", "auto dialer", "outbound call", "power dialer",
                          "preview dialer", "progressive dialer"],
    "UCaaS / Communications": ["ucaas", "unified comm", "voip", "sip trunk", "pbx", "business phone",
                                "cloud phone", "phone system"],
    "Analytics & Reporting": ["call analytics", "speech analytics", "interaction analytics",
                              "customer analytics", "reporting software", "call recording"],
    "Competitor Brands": ["five9", "verint", "genesys", "nice", "talkdesk", "avaya", "8x8",
                          "ringcentral", "twilio", "dialpad", "vonage", "cisco webex"],
}

category_keywords = defaultdict(list)

for item in high_intent:
    kw_lower = item["keyword"].lower()
    matched = False
    for cat, terms in categories.items():
        for term in terms:
            if term in kw_lower:
                category_keywords[cat].append(item)
                matched = True
                break
        if matched:
            break
    if not matched:
        category_keywords["Other / Uncategorized"].append(item)

print(f"\n  HIGH-INTENT KEYWORDS BY CATEGORY:")
for cat in categories.keys():
    kws = category_keywords.get(cat, [])
    if kws:
        total_vol = sum(k["volume"] for k in kws)
        avg_cpc = sum(k["cpc"] for k in kws) / len(kws) if kws else 0
        print(f"\n  {cat} ({len(kws)} keywords, {total_vol:,} total volume, ${avg_cpc:.2f} avg CPC)")
        print(f"    {'Keyword':<45} {'Vol':>8} {'CPC':>8} {'Score':>6}")
        print(f"    {'-'*45} {'-'*8} {'-'*8} {'-'*6}")
        for k in sorted(kws, key=lambda x: -x["intent_score"])[:10]:
            print(f"    {k['keyword']:<45} {k['volume']:>8,} ${k['cpc']:>7.2f} {k['intent_score']:>6}")


# ─────────────────────────────────────────────
# PHASE 6: KEYWORD GAP ANALYSIS (vs core 3)
# ─────────────────────────────────────────────
print("\n\n" + "#"*80)
print("  PHASE 6: KEYWORD GAP ANALYSIS")
print("#"*80)
print("  Keywords where competitors rank but Five9/Verint/Genesys do NOT")

for core in core_domains:
    gaps = []
    core_kws = set()
    for kw in all_keywords[core].get("organic", []):
        core_kws.add(kw["keyword"])
    for kw in all_keywords[core].get("paid", []):
        core_kws.add(kw["keyword"])

    for kw, data in keyword_universe.items():
        if kw in core_kws:
            continue
        if data["cpc"] < 5:
            continue
        num_competitors = len(data["domains_organic"]) + len(data["domains_paid"])
        if num_competitors >= 2:
            best_org = None
            for d, info in data["domains_organic"].items():
                if d != core and (best_org is None or info["position"] < best_org[1]):
                    best_org = (d, info["position"])
            gaps.append({
                "keyword": kw,
                "volume": data["volume"],
                "cpc": data["cpc"],
                "num_competitors": num_competitors,
                "best_ranker": best_org[0] if best_org else "N/A",
                "best_pos": best_org[1] if best_org else "N/A",
            })

    gaps.sort(key=lambda x: (-x["num_competitors"], -x["volume"]))

    print(f"\n  GAPS FOR {core.upper()} - Keywords they're MISSING:")
    print(f"  {'Keyword':<45} {'Vol':>8} {'CPC':>8} {'Comps':>6} {'Best Ranker':<20} {'Pos':>5}")
    print(f"  {'-'*45} {'-'*8} {'-'*8} {'-'*6} {'-'*20} {'-'*5}")
    for g in gaps[:20]:
        print(f"  {g['keyword']:<45} {g['volume']:>8,} ${g['cpc']:>7.2f} {g['num_competitors']:>6} {g['best_ranker']:<20} {g['best_pos']:>5}")


# ─────────────────────────────────────────────
# PHASE 7: COMPETITOR BRAND BIDDING MAP
# ─────────────────────────────────────────────
print("\n\n" + "#"*80)
print("  PHASE 7: COMPETITOR BRAND BIDDING MAP (SEM)")
print("#"*80)
print("  Who is bidding on whose brand terms?\n")

brand_map = {
    "five9.com": ["five9", "five 9", "fivn"],
    "verint.com": ["verint"],
    "genesys.com": ["genesys", "purecloud", "pureconnect"],
    "nice.com": ["nice", "niceincontact", "nice incontact", "cxone"],
    "talkdesk.com": ["talkdesk"],
    "8x8.com": ["8x8"],
    "ringcentral.com": ["ringcentral"],
    "avaya.com": ["avaya"],
    "dialpad.com": ["dialpad"],
    "twilio.com": ["twilio", "twilio flex"],
    "vonage.com": ["vonage"],
}

# Build conquest matrix
conquest_matrix = defaultdict(lambda: defaultdict(list))

for domain in expanded_set:
    for kw in all_keywords[domain].get("paid", []):
        kw_lower = kw["keyword"].lower()
        for target_domain, brand_terms in brand_map.items():
            if target_domain == domain:
                continue
            for bt in brand_terms:
                if bt in kw_lower:
                    conquest_matrix[domain][target_domain].append({
                        "keyword": kw["keyword"],
                        "volume": kw["volume"],
                        "cpc": kw["cpc"],
                        "position": kw["position"],
                        "etv": kw["etv"],
                    })
                    break

print(f"  {'Bidder':<20} {'Targeting':<20} {'Keywords':>8} {'Est. Traffic':>12} {'Top Keyword'}")
print(f"  {'-'*20} {'-'*20} {'-'*8} {'-'*12} {'-'*40}")

for bidder in sorted(conquest_matrix.keys()):
    for target in sorted(conquest_matrix[bidder].keys()):
        kws = conquest_matrix[bidder][target]
        total_traffic = sum(k["etv"] for k in kws)
        top_kw = max(kws, key=lambda x: x["etv"])
        print(f"  {bidder:<20} {target:<20} {len(kws):>8} {total_traffic:>12,.0f} {top_kw['keyword'][:40]}")


# ─────────────────────────────────────────────
# PHASE 8: STRATEGY RECOMMENDATIONS
# ─────────────────────────────────────────────
print("\n\n" + "#"*80)
print("  PHASE 8: STRATEGIC RECOMMENDATIONS")
print("#"*80)

# 8A: Top SEO opportunities (high CPC, achievable position, multiple competitors validate)
print(f"\n{'='*80}")
print(f"  8A: TOP SEO CONTENT OPPORTUNITIES (High Intent, Validated by Competition)")
print(f"{'='*80}")
print(f"  These keywords have high CPC (buying intent) and multiple competitors ranking.\n")

seo_opps = []
for kw, data in keyword_universe.items():
    if data["cpc"] < 10:
        continue
    num_org = len(data["domains_organic"])
    if num_org < 2:
        continue
    # Check if any competitor ranks well (top 20)
    positions = [info["position"] for info in data["domains_organic"].values()]
    best_pos = min(positions) if positions else 100
    if best_pos > 30:
        continue
    opportunity_score = (data["cpc"] * data["volume"] * num_org) / (best_pos + 1)
    seo_opps.append({
        "keyword": kw,
        "volume": data["volume"],
        "cpc": data["cpc"],
        "num_competitors": num_org,
        "best_position": best_pos,
        "opportunity_score": opportunity_score,
        "data": data,
    })

seo_opps.sort(key=lambda x: -x["opportunity_score"])

print(f"  {'#':>3} {'Keyword':<45} {'Vol':>8} {'CPC':>8} {'Comps':>5} {'Best':>5} {'Opportunity'}")
print(f"  {'-'*3} {'-'*45} {'-'*8} {'-'*8} {'-'*5} {'-'*5} {'-'*15}")
for i, opp in enumerate(seo_opps[:30], 1):
    who = []
    for d, info in sorted(opp["data"]["domains_organic"].items(), key=lambda x: x[1]["position"]):
        who.append(f"{d.replace('.com','')[:6]}#{info['position']}")
    who_str = ", ".join(who[:3])
    print(f"  {i:>3} {opp['keyword']:<45} {opp['volume']:>8,} ${opp['cpc']:>7.2f} {opp['num_competitors']:>5} {opp['best_position']:>5} {who_str}")


# 8B: Top SEM opportunities
print(f"\n{'='*80}")
print(f"  8B: TOP SEM / PPC OPPORTUNITIES")
print(f"{'='*80}")
print(f"  Keywords where competitors are spending but opportunity exists.\n")

sem_opps = []
for kw, data in keyword_universe.items():
    num_paid = len(data["domains_paid"])
    if num_paid < 1:
        continue
    if data["cpc"] < 5:
        continue
    total_paid_traffic = sum(info["etv"] for info in data["domains_paid"].values())
    sem_opps.append({
        "keyword": kw,
        "volume": data["volume"],
        "cpc": data["cpc"],
        "num_bidders": num_paid,
        "total_paid_traffic": total_paid_traffic,
        "data": data,
    })

sem_opps.sort(key=lambda x: (-x["num_bidders"], -x["volume"]))

print(f"  {'#':>3} {'Keyword':<45} {'Vol':>8} {'CPC':>8} {'Bidders':>7} {'Traffic':>9} {'Who is Bidding'}")
print(f"  {'-'*3} {'-'*45} {'-'*8} {'-'*8} {'-'*7} {'-'*9} {'-'*40}")
for i, opp in enumerate(sem_opps[:30], 1):
    who = [d.replace(".com", "")[:8] for d in opp["data"]["domains_paid"].keys()]
    who_str = ", ".join(who[:4])
    if len(who) > 4:
        who_str += f" +{len(who)-4}"
    print(f"  {i:>3} {opp['keyword']:<45} {opp['volume']:>8,} ${opp['cpc']:>7.2f} {opp['num_bidders']:>7} {opp['total_paid_traffic']:>9,.0f} {who_str}")


# 8C: Conquest strategy recommendations
print(f"\n{'='*80}")
print(f"  8C: CONQUEST SEM STRATEGY - COMPETITOR BRANDS WORTH BIDDING ON")
print(f"{'='*80}")

for core in core_domains:
    own_brands = [b.lower() for b in brand_map.get(core, [])]
    conquest_targets = []

    for target_domain, brand_terms in brand_map.items():
        if target_domain == core:
            continue
        target_m = all_metrics.get(target_domain, {}).get("organic", {})
        target_traffic = target_m.get("etv", 0)
        # Check if anyone else is already conquesting this brand
        conquestors = []
        for bidder, targets in conquest_matrix.items():
            if target_domain in targets:
                conquestors.append(bidder)

        for bt in brand_terms:
            if bt in keyword_universe:
                kd = keyword_universe[bt]
                conquest_targets.append({
                    "brand": bt,
                    "domain": target_domain,
                    "volume": kd["volume"],
                    "cpc": kd["cpc"],
                    "target_traffic": target_traffic,
                    "already_conquered_by": conquestors,
                })

    conquest_targets.sort(key=lambda x: -x["volume"])

    print(f"\n  CONQUEST TARGETS FOR {core.upper()}:")
    print(f"  {'Brand Term':<25} {'Domain':<20} {'Vol':>8} {'CPC':>8} {'Target Traffic':>14} {'Already Bid By'}")
    print(f"  {'-'*25} {'-'*20} {'-'*8} {'-'*8} {'-'*14} {'-'*30}")
    for ct in conquest_targets:
        already = ", ".join([d.replace(".com","")[:8] for d in ct["already_conquered_by"]]) or "Nobody"
        print(f"  {ct['brand']:<25} {ct['domain']:<20} {ct['volume']:>8,} ${ct['cpc']:>7.2f} {ct['target_traffic']:>14,.0f} {already}")


# 8D: Content gap themes
print(f"\n{'='*80}")
print(f"  8D: SEO CONTENT THEMES - WHERE COMPETITORS DOMINATE")
print(f"{'='*80}")
print(f"  Thematic areas where 3+ competitors rank in top 20\n")

theme_keywords = defaultdict(list)
for kw, data in keyword_universe.items():
    top20_count = sum(1 for info in data["domains_organic"].values() if info["position"] <= 20)
    if top20_count >= 2 and data["cpc"] >= 3:
        theme_keywords["high_competition"].append({
            "keyword": kw,
            "volume": data["volume"],
            "cpc": data["cpc"],
            "top20_count": top20_count,
            "data": data,
        })

theme_keywords["high_competition"].sort(key=lambda x: (-x["top20_count"], -x["cpc"] * x["volume"]))

print(f"  {'#':>3} {'Keyword':<45} {'Vol':>8} {'CPC':>8} {'#Top20':>6} {'Who (Position)'}")
print(f"  {'-'*3} {'-'*45} {'-'*8} {'-'*8} {'-'*6} {'-'*50}")
for i, tk in enumerate(theme_keywords["high_competition"][:25], 1):
    who = []
    for d, info in sorted(tk["data"]["domains_organic"].items(), key=lambda x: x[1]["position"]):
        if info["position"] <= 20:
            who.append(f"{d.replace('.com','')[:8]}#{info['position']}")
    print(f"  {i:>3} {tk['keyword']:<45} {tk['volume']:>8,} ${tk['cpc']:>7.2f} {tk['top20_count']:>6} {', '.join(who)}")


print(f"\n\n{'#'*80}")
print(f"  ANALYSIS COMPLETE - {len(keyword_universe)} unique keywords analyzed")
print(f"  across {len(expanded_set)} competitor domains")
print(f"{'#'*80}")
