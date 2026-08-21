#!/usr/bin/env python3
"""
Fetch the top-PnL Solana memecoin traders (e.g. pump.fun) from the Solana Tracker
Data API and print their wallet addresses.

Usage:
    export SOLANA_TRACKER_API_KEY=your_key_here   # free tier: https://www.solanatracker.io/data-api
    python scripts/top_solana_traders.py --timeframe 7d --limit 25

Docs: https://docs.solanatracker.io/  (endpoint: /pnl/leaderboard/top)
"""

import argparse
import os
import sys
import urllib.request
import urllib.error
import json

API_BASE = "https://data.solanatracker.io"


def fetch_top_traders(api_key: str, timeframe: str, limit: int):
    url = f"{API_BASE}/pnl/leaderboard/top?timeframe={timeframe}&limit={limit}"
    req = urllib.request.Request(url, headers={"x-api-key": api_key})
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        print(f"HTTP error {e.code}: {e.read().decode()}", file=sys.stderr)
        sys.exit(1)
    except urllib.error.URLError as e:
        print(f"Network error: {e.reason}", file=sys.stderr)
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="Top Solana memecoin traders by PnL")
    parser.add_argument("--timeframe", default="7d", help="e.g. 1d, 7d, 30d, all")
    parser.add_argument("--limit", type=int, default=25, help="number of wallets to show")
    args = parser.parse_args()

    api_key = os.environ.get("SOLANA_TRACKER_API_KEY")
    if not api_key:
        print(
            "Set SOLANA_TRACKER_API_KEY env var first.\n"
            "Get a free key at https://www.solanatracker.io/data-api",
            file=sys.stderr,
        )
        sys.exit(1)

    data = fetch_top_traders(api_key, args.timeframe, args.limit)
    wallets = data.get("wallets") or data.get("data") or data

    print(f"{'#':<4}{'Wallet':<46}{'PnL (USD)':>14}{'Win %':>10}")
    print("-" * 74)
    for i, w in enumerate(wallets, start=1):
        addr = w.get("wallet") or w.get("address", "?")
        pnl = w.get("pnl") or w.get("total_pnl") or w.get("realized_pnl", "?")
        winrate = w.get("winPercentage") or w.get("win_rate", "?")
        print(f"{i:<4}{addr:<46}{str(pnl):>14}{str(winrate):>10}")


if __name__ == "__main__":
    main()
