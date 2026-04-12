#!/usr/bin/env python3
"""
Social posting orchestrator for Strategnik.

Reads the next queued post from scripts/social/queue/,
posts to LinkedIn and X/Twitter, then moves it to queue/posted/.

Queue format: JSON files named with sort order (e.g., 001-topic.json)

Usage:
    python3 post_social.py                    # Post next in queue
    python3 post_social.py --dry-run          # Preview without posting
    python3 post_social.py --platform x       # Post to X only
    python3 post_social.py --platform linkedin # Post to LinkedIn only
    python3 post_social.py --file queue/003-friction.json  # Post specific file

Env vars required:
    X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET
    LINKEDIN_ACCESS_TOKEN
"""

import argparse
import json
import os
import shutil
import sys
from datetime import datetime
from pathlib import Path

QUEUE_DIR = Path(__file__).parent / "queue"
POSTED_DIR = QUEUE_DIR / "posted"


def load_env_file(path: Path) -> None:
    """Load env vars from a file if it exists."""
    if not path.exists():
        return
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key not in os.environ:
            os.environ[key] = value


def get_next_post() -> Path | None:
    """Get the next unposted JSON file from the queue."""
    if not QUEUE_DIR.exists():
        return None
    files = sorted(f for f in QUEUE_DIR.glob("*.json") if f.is_file())
    return files[0] if files else None


def post_to_x(content: dict) -> dict | None:
    """Post content to X/Twitter."""
    from post_to_x import post_tweet, post_thread

    api_key = os.environ.get("X_API_KEY")
    api_secret = os.environ.get("X_API_SECRET")
    access_token = os.environ.get("X_ACCESS_TOKEN")
    access_token_secret = os.environ.get("X_ACCESS_TOKEN_SECRET")

    if not all([api_key, api_secret, access_token, access_token_secret]):
        print("  [X] Skipping — missing credentials")
        return None

    x_content = content.get("x", {})
    text = x_content.get("text") or content.get("text", "")
    thread = x_content.get("thread")

    if thread:
        return post_thread(thread, api_key, api_secret, access_token, access_token_secret)
    elif text:
        return post_tweet(text, api_key, api_secret, access_token, access_token_secret)
    else:
        print("  [X] Skipping — no content")
        return None


def post_to_linkedin(content: dict) -> dict | None:
    """Post content to LinkedIn."""
    from post_to_linkedin import post_text, post_article

    access_token = os.environ.get("LINKEDIN_ACCESS_TOKEN")
    if not access_token:
        print("  [LinkedIn] Skipping — missing LINKEDIN_ACCESS_TOKEN")
        return None

    li_content = content.get("linkedin", {})
    text = li_content.get("text") or content.get("text", "")
    url = li_content.get("url")
    title = li_content.get("title")

    if url and title:
        return post_article(text, url, title, access_token)
    elif text:
        return post_text(text, access_token)
    else:
        print("  [LinkedIn] Skipping — no content")
        return None


def main():
    parser = argparse.ArgumentParser(description="Post to LinkedIn and X from queue")
    parser.add_argument("--dry-run", action="store_true", help="Preview without posting")
    parser.add_argument("--platform", choices=["x", "linkedin", "both"], default="both")
    parser.add_argument("--file", help="Post a specific queue file")
    args = parser.parse_args()

    # Load env from ~/.env if not already set (for local runs)
    load_env_file(Path.home() / ".env")

    # Find the post to publish
    if args.file:
        post_file = Path(args.file)
        if not post_file.exists():
            post_file = QUEUE_DIR / args.file
    else:
        post_file = get_next_post()

    if not post_file or not post_file.exists():
        print("No posts in queue. Add JSON files to scripts/social/queue/")
        print("\nExample format:")
        print(json.dumps({
            "text": "Shared text for both platforms (fallback)",
            "linkedin": {
                "text": "LinkedIn-specific post text...",
                "url": "https://strategnik.com/thinking/post-slug/",
                "title": "Article title for link preview"
            },
            "x": {
                "text": "Tweet text (280 chars max)",
                "thread": ["Tweet 1...", "Tweet 2...", "Tweet 3..."]
            }
        }, indent=2))
        sys.exit(0)

    content = json.loads(post_file.read_text())
    print(f"Posting: {post_file.name}")
    print(f"  Text preview: {(content.get('text', '') or content.get('linkedin', {}).get('text', ''))[:100]}...")

    if args.dry_run:
        print("\n[DRY RUN] Would post to:", args.platform)
        print(json.dumps(content, indent=2))
        return

    results = {}

    if args.platform in ("x", "both"):
        try:
            results["x"] = post_to_x(content)
        except Exception as e:
            print(f"  [X] ERROR: {e}")
            results["x"] = {"error": str(e)}

    if args.platform in ("linkedin", "both"):
        try:
            results["linkedin"] = post_to_linkedin(content)
        except Exception as e:
            print(f"  [LinkedIn] ERROR: {e}")
            results["linkedin"] = {"error": str(e)}

    # Move to posted/ with timestamp
    POSTED_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    posted_name = f"{timestamp}_{post_file.name}"
    posted_path = POSTED_DIR / posted_name

    # Add results metadata to the file
    content["_posted"] = {
        "timestamp": datetime.now().isoformat(),
        "results": results,
    }
    posted_path.write_text(json.dumps(content, indent=2))
    post_file.unlink()

    print(f"\nDone. Moved to {posted_path.name}")


if __name__ == "__main__":
    main()
