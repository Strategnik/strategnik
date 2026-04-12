"""Post to X/Twitter using Tweepy and API v2."""

import tweepy


def post_tweet(text: str, api_key: str, api_secret: str, access_token: str, access_token_secret: str) -> dict:
    """Post a tweet. Returns tweet data on success."""
    client = tweepy.Client(
        consumer_key=api_key,
        consumer_secret=api_secret,
        access_token=access_token,
        access_token_secret=access_token_secret,
    )
    response = client.create_tweet(text=text)
    tweet_id = response.data["id"]
    url = f"https://x.com/i/status/{tweet_id}"
    print(f"  [X] Posted: {url}")
    return {"id": tweet_id, "url": url}


def post_thread(tweets: list[str], api_key: str, api_secret: str, access_token: str, access_token_secret: str) -> list[dict]:
    """Post a thread (list of tweets). Returns list of tweet data."""
    client = tweepy.Client(
        consumer_key=api_key,
        consumer_secret=api_secret,
        access_token=access_token,
        access_token_secret=access_token_secret,
    )
    results = []
    reply_to = None

    for i, text in enumerate(tweets):
        kwargs = {"text": text}
        if reply_to:
            kwargs["in_reply_to_tweet_id"] = reply_to

        response = client.create_tweet(**kwargs)
        tweet_id = response.data["id"]
        url = f"https://x.com/i/status/{tweet_id}"
        print(f"  [X] Tweet {i+1}/{len(tweets)}: {url}")
        results.append({"id": tweet_id, "url": url})
        reply_to = tweet_id

    return results
