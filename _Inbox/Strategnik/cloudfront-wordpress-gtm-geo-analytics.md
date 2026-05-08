# Geo-Based Google Analytics Setup
## CDN + WordPress + GTM Tag Firing by Region

**Use case:** Fire Google Analytics with full tracking for non-EU/UK users. Serve a consent banner and use GA4 Consent Mode v2 for EU/UK users. Remain GDPR, UK GDPR, and US state privacy law compliant.

---

## Architecture Overview

```
User Request
    → CDN (detects country via geo header)
        → WordPress/PHP (reads header, injects dataLayer)
            → GTM (reads dataLayer, fires correct tags)
                → GA4 (full) for US/OTHER
                → GA4 (consent mode v2) for EU/UK
```

---

## Step 1 — Enable Geo Header at the CDN

Your CDN detects the visitor's country and passes it to your origin server as an HTTP header. The setup depends on which CDN you use.



### Option \: AWS CloudFront

CloudFront can detect visitor country but strips geo headers before forwarding to your origin by default. You must explicitly enable forwarding.

**In AWS Console:**

1. Go to **CloudFront → Distributions → [your distribution]**
2. Select the **Behaviors** tab → edit the default behavior
3. Under **Cache and origin request settings**, find **Origin Request Policy**
4. Either edit the existing policy or create a new one:
   - Go to **Policies → Origin Request Policies → Create Policy**
   - Under **Headers**, select **Include the following headers**
   - Add: `CloudFront-Viewer-Country`
5. Attach the policy to your distribution behavior
6. **Deploy the distribution** (takes 5–15 minutes)

**Verify it's working:**

Add a temporary test to any PHP page and load it in your browser:

```php
<?php echo 'Country: ' . ($_SERVER['HTTP_CLOUDFRONT_VIEWER_COUNTRY'] ?? 'not set'); ?>
```

You should see a two-letter country code. Remove the test snippet after confirming.

> **Note:** `CloudFront-Viewer-Country` is an origin request header — it does **not** appear in browser DevTools response headers. You must verify server-side.

---

## Step 2 — Inject Country into the DataLayer via WordPress

This runs at the PHP layer before GTM loads, so the variable is available immediately when GTM fires.

### Add to `functions.php` (or a custom mu-plugin):

```php
function inject_geo_datalayer() {

    // Read CDN country header (Cloudflare or CloudFront)
    $country = null;

    if (!empty($_SERVER['HTTP_CF_IPCOUNTRY'])) {
        // Cloudflare
        $country = sanitize_text_field($_SERVER['HTTP_CF_IPCOUNTRY']);
    } elseif (!empty($_SERVER['HTTP_CLOUDFRONT_VIEWER_COUNTRY'])) {
        // AWS CloudFront
        $country = sanitize_text_field($_SERVER['HTTP_CLOUDFRONT_VIEWER_COUNTRY']);
    }

    // EU member states + UK
    $eu_uk_countries = [
        'AT', // Austria
        'BE', // Belgium
        'BG', // Bulgaria
        'HR', // Croatia
        'CY', // Cyprus
        'CZ', // Czech Republic
        'DK', // Denmark
        'EE', // Estonia
        'FI', // Finland
        'FR', // France
        'DE', // Germany
        'GR', // Greece
        'HU', // Hungary
        'IE', // Ireland
        'IT', // Italy
        'LV', // Latvia
        'LT', // Lithuania
        'LU', // Luxembourg
        'MT', // Malta
        'NL', // Netherlands
        'PL', // Poland
        'PT', // Portugal
        'RO', // Romania
        'SK', // Slovakia
        'SI', // Slovenia
        'ES', // Spain
        'SE', // Sweden
        'GB', // United Kingdom
    ];

    // Default to EU_UK if header is missing — safer for GDPR compliance.
    // If the CDN header fails, EU users get the consent banner (correct)
    // and US users see it unnecessarily (harmless). The reverse — defaulting
    // to US and silently tracking an EU user — is a compliance violation.
    if ($country === null) {
        $region = 'EU_UK';
        $country = 'UNKNOWN';
    } else {
        $region = in_array($country, $eu_uk_countries) ? 'EU_UK' : 'OTHER';
    }

    // Inject into dataLayer before GTM loads
    echo "<script>
        window.dataLayer = window.dataLayer || [];
        dataLayer.push({
            'userRegion': '{$region}',
            'userCountry': '{$country}'
        });
    </script>";
}

// Priority 1 ensures this fires before GTM snippet in wp_head
add_action('wp_head', 'inject_geo_datalayer', 1);
```

> **Note on Elementor:** Elementor's Custom Code feature injects **client-side HTML/JS only** — it cannot execute PHP. The geo dataLayer injection must run server-side to read CDN headers, so it must live in `functions.php` or a custom mu-plugin. Do not attempt to use Elementor Custom Code for this step.

---

## Step 3 — Handle CDN Page Caching

Your CDN caches full HTML pages and will serve the same cached response to all users — breaking your geo injection if not addressed.



### CloudFront

CloudFront caches HTML responses by default. You must vary the cache by country.

1. Go to **CloudFront → Policies → Cache Policies → Create Policy**
2. Under **Cache Key Settings → Headers**, add `CloudFront-Viewer-Country`
3. Attach this cache policy to your distribution behavior

This creates per-country cached pages. Trade-off: more cache variants (~200 possible countries), higher origin load, lower cache hit ratio. For a B2B site with moderate traffic this is acceptable.

### Alternative for High-Traffic Sites (either CDN) - i dont think this is going to an issue BTW

If varying cache per country is too costly, load the dataLayer push via a separate uncached endpoint:

- Create a small PHP endpoint: `/geo-datalayer.php` that outputs only the `dataLayer.push()` call
- Exclude that URL pattern from CDN caching (Cloudflare: Cache Rule with "Bypass Cache"; CloudFront: separate behavior with caching disabled)
- Load it via a synchronous `<script src="/geo-datalayer.php"></script>` in your page header before GTM initializes

---

## Step 4 — Configure GTM Tags and Triggers

### 4a — Create a DataLayer Variable in GTM

1. Go to **GTM → Variables → New → Data Layer Variable**
2. Name it: `DL - User Region`
3. Data Layer Variable Name: `userRegion`
4. Save

### 4b — Create Triggers

**Trigger: EU/UK User**
- Type: Page View
- Fire on: Some Page Views
- Condition: `DL - User Region` **equals** `EU_UK`

**Trigger: Non-EU/UK User (US/OTHER)**
- Type: Page View
- Fire on: Some Page Views
- Condition: `DL - User Region` **equals** `OTHER`

**Trigger: EU/UK User — Consent Granted**
- Type: Custom Event
- Event name: `consent_granted` *(fired when user accepts via your consent banner)*
- Condition: `DL - User Region` **equals** `EU_UK`

### 4c — Configure Tags

| Tag | Type | Trigger | Notes |
|---|---|---|---|
| GA4 — Full Tracking | GA4 Configuration | Non-EU/UK User | Fires immediately, no consent banner |
| GA4 — Consent Mode | GA4 Configuration | EU/UK + Consent Granted | Fires only after user opts in; cookieless pings are sent automatically while consent is denied |
| Consent Banner | Custom HTML | EU/UK User | Loads your consent UI |

> **Why no separate "Cookieless Ping" tag?** When Consent Mode v2 is active with `analytics_storage: denied`, the GA4 Configuration tag **automatically** sends cookieless pings for behavioral modeling. A separate tag is unnecessary and risks double-counting.

### 4d — Configure GA4 Tag Consent Settings

For each GA4 tag in GTM, you must configure it to respect consent signals:

1. Open the GA4 tag → **Advanced Settings → Consent Settings**
2. Select **Require additional consent for tag to fire**
3. Add `analytics_storage` as a required consent type
4. Save

Without this, the GA4 tags will fire regardless of consent state — the `gtag('consent', ...)` calls alone do not control GTM-managed tags.

### 4e — Wire Up Consent Mode v2 (EU/UK only)

Add this as a **Custom HTML tag** firing on the **Consent Initialization - All Pages** trigger (not a regular Page View trigger — this dedicated trigger fires before all other triggers, guaranteeing consent defaults are set first):

```html
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}

  // Default: deny all consent types for EU/UK until user opts in
  gtag('consent', 'default', {
    'analytics_storage': 'denied',
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'wait_for_update': 2000
  });
</script>
```

> **Consent Mode v2 requires all four parameters.** Since March 2024, Google requires `ad_user_data` and `ad_personalization` in addition to `analytics_storage` and `ad_storage`. Without all four, Google classifies your implementation as v1 and you lose behavioral modeling data.

When user accepts your consent banner, fire this via GTM or your banner's callback:

```javascript
gtag('consent', 'update', {
  'analytics_storage': 'granted',
  'ad_user_data': 'granted',
  'ad_personalization': 'granted'
});
dataLayer.push({ 'event': 'consent_granted' });
```

---

## Step 5 — Test the Full Setup

### Checklist:

- [ ] CDN geo header confirmed server-side (test page returns correct country code)
- [ ] `userRegion` appears in browser console (`dataLayer` inspection) before GTM fires
- [ ] GTM Preview mode shows correct tags firing per region
- [ ] VPN to a German or French IP → confirm EU_UK path and consent banner appears
- [ ] VPN off (US IP) → confirm GA4 full tracking fires with no banner
- [ ] EU user accepts consent → confirm `consent_granted` event fires and GA4 tag activates
- [ ] EU user rejects → confirm GA4 full tag does NOT fire
- [ ] Cache variation confirmed: EU and US users receive different dataLayer values on same URL
- [ ] GA4 tags have `analytics_storage` set as required consent in Advanced Settings
- [ ] Consent defaults fire on **Consent Initialization** trigger (check GTM Preview → Consent tab)

---

## Compliance Summary

| Region | Default State | Analytics Fires? | Legal Basis |
|---|---|---|---|
| US / OTHER | No banner | Yes — immediately | Legitimate interest (note: US state privacy laws like CCPA/CPRA, VCDPA, CPA, CTDPA may require opt-out mechanisms — see note below) |
| EU / UK | Banner shown, OFF by default | No — until opt-in | GDPR / UK GDPR compliant |
| EU / UK (opted in) | Banner accepted | Yes — full GA4 | Explicit consent obtained |
| EU / UK (opted out) | Banner rejected | Cookieless pings only (automatic) | Consent Mode v2 modeling |
| Unknown (header missing) | Banner shown, OFF by default | No — until opt-in | Fail-safe: treated as EU/UK |

> **US state privacy laws:** This setup addresses GDPR/UK GDPR but does not cover US state requirements. California (CCPA/CPRA), Virginia (VCDPA), Colorado (CPA), Connecticut (CTDPA), Texas (TDPSA), and other states have varying opt-out, disclosure, and consent requirements for analytics and ad tracking. If you have US visitors, consult your legal team about whether a "Do Not Sell/Share" link or additional opt-out mechanism is needed. This is a separate workstream from the EU consent architecture above.

---

## Quick Reference: Key CDN & GTM Settings

| Setting | Cloudflare | CloudFront |
|---|---|---|
| Geo header | `CF-IPCountry` (on by default) | `CloudFront-Viewer-Country` (enable via Origin Request Policy) |
| Cache variation | Cache Rule keyed on `CF-IPCountry` (only if full-page caching is on) | Cache Policy with `CloudFront-Viewer-Country` in cache key |
| PHP header access | `$_SERVER['HTTP_CF_IPCOUNTRY']` | `$_SERVER['HTTP_CLOUDFRONT_VIEWER_COUNTRY']` |

| Setting | Location | Value |
|---|---|---|
| DataLayer variable | GTM → Variables | `userRegion` |
| EU/UK trigger condition | GTM → Triggers | `userRegion equals EU_UK` |
| US trigger condition | GTM → Triggers | `userRegion equals OTHER` |
| Consent mode default | Custom HTML tag (Consent Initialization trigger) | `analytics_storage: denied`, `ad_storage: denied`, `ad_user_data: denied`, `ad_personalization: denied` |
| GA4 consent requirement | GA4 tag → Advanced Settings → Consent Settings | Require `analytics_storage` |

---

## Appendix: Cloudflare Worker Alternative

For Cloudflare users, a Worker can handle the entire geo→dataLayer injection at the edge, eliminating the need for PHP-level logic and cache variation. This is the cleanest approach if you're comfortable with Workers.

```javascript
export default {
  async fetch(request, env) {
    const country = request.cf?.country || 'UNKNOWN';
    const euUkCountries = new Set([
      'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR',
      'DE','GR','HU','IE','IT','LV','LT','LU','MT','NL',
      'PL','PT','RO','SK','SI','ES','SE','GB'
    ]);
    const region = euUkCountries.has(country) ? 'EU_UK' : 'OTHER';

    // Fetch original page from origin
    const response = await fetch(request);
    const contentType = response.headers.get('content-type') || '';

    // Only modify HTML responses
    if (!contentType.includes('text/html')) {
      return response;
    }

    // Inject dataLayer before </head>
    const rewriter = new HTMLRewriter().on('head', {
      element(el) {
        el.prepend(
          `<script>
            window.dataLayer = window.dataLayer || [];
            dataLayer.push({
              'userRegion': '${region}',
              'userCountry': '${country}'
            });
          </script>`,
          { html: true }
        );
      }
    });

    return rewriter.transform(response);
  }
};
```

**Advantages:** No PHP changes needed, no cache variation required (the Worker runs on every request before cache), works with any origin (not just WordPress).

**Setup:** Deploy via **Cloudflare Dashboard → Workers & Pages → Create Worker**, then add a Route that maps your domain to the Worker.

---

*Last updated: March 2026 | Applies to GA4, GTM web containers, Consent Mode v2, Cloudflare (all plans), CloudFront standard distributions, WordPress 6.x, Elementor 4.x*
