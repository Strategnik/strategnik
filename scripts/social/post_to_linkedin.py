"""Post to LinkedIn using the REST Posts API (v2)."""

import requests


def get_member_urn(access_token: str) -> str:
    """Get the authenticated member's URN."""
    resp = requests.get(
        "https://api.linkedin.com/v2/userinfo",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    resp.raise_for_status()
    data = resp.json()
    return f"urn:li:person:{data['sub']}"


def post_text(text: str, access_token: str, author_urn: str = None) -> dict:
    """Post a text-only update to LinkedIn.

    Args:
        text: Post content (up to 3000 chars).
        access_token: OAuth2 access token with w_member_social scope.
        author_urn: Member URN. Auto-fetched if not provided.
    """
    if not author_urn:
        author_urn = get_member_urn(access_token)

    payload = {
        "author": author_urn,
        "commentary": text,
        "visibility": "PUBLIC",
        "distribution": {
            "feedDistribution": "MAIN_FEED",
            "targetEntities": [],
            "thirdPartyDistributionChannels": [],
        },
        "lifecycleState": "PUBLISHED",
        "isReshareDisabledByAuthor": False,
    }

    resp = requests.post(
        "https://api.linkedin.com/rest/posts",
        json=payload,
        headers={
            "Authorization": f"Bearer {access_token}",
            "X-Restli-Protocol-Version": "2.0.0",
            "LinkedIn-Version": "202401",
            "Content-Type": "application/json",
        },
    )

    if resp.status_code == 201:
        post_id = resp.headers.get("x-restli-id", "unknown")
        print(f"  [LinkedIn] Posted: ID {post_id}")
        return {"id": post_id, "status": "published"}
    else:
        print(f"  [LinkedIn] Error {resp.status_code}: {resp.text}")
        resp.raise_for_status()


def post_article(text: str, url: str, title: str, access_token: str, author_urn: str = None) -> dict:
    """Post a link/article share to LinkedIn."""
    if not author_urn:
        author_urn = get_member_urn(access_token)

    payload = {
        "author": author_urn,
        "commentary": text,
        "visibility": "PUBLIC",
        "distribution": {
            "feedDistribution": "MAIN_FEED",
            "targetEntities": [],
            "thirdPartyDistributionChannels": [],
        },
        "content": {
            "article": {
                "source": url,
                "title": title,
            }
        },
        "lifecycleState": "PUBLISHED",
        "isReshareDisabledByAuthor": False,
    }

    resp = requests.post(
        "https://api.linkedin.com/rest/posts",
        json=payload,
        headers={
            "Authorization": f"Bearer {access_token}",
            "X-Restli-Protocol-Version": "2.0.0",
            "LinkedIn-Version": "202401",
            "Content-Type": "application/json",
        },
    )

    if resp.status_code == 201:
        post_id = resp.headers.get("x-restli-id", "unknown")
        print(f"  [LinkedIn] Article posted: ID {post_id}")
        return {"id": post_id, "status": "published"}
    else:
        print(f"  [LinkedIn] Error {resp.status_code}: {resp.text}")
        resp.raise_for_status()
