# Browser Use Cloud Skill 🌐

An [OpenClaw](https://github.com/openclaw/openclaw) skill for [Browser Use Cloud](https://cloud.browser-use.com) - cloud-based browser automation via natural language.

## What it does

Send natural language tasks to Browser Use Cloud's API and get results back. No Playwright setup, no cookie management, no anti-bot headaches.

```javascript
// "Check Resy for Carbone availability Saturday for 2"
// → "No tables available for Saturday. Notify alerts offered."
```

## Features

- **Natural language tasks** - describe what you want in plain English
- **Built-in stealth** - handles anti-bot detection automatically
- **Persistent sessions** - login state survives across tasks
- **Structured output** - get clean JSON when you need it

## Installation

1. Copy `SKILL.md` and `run-task.js` to your OpenClaw skills directory
2. Install the SDK: `npm install browser-use-sdk`
3. Get an API key at [cloud.browser-use.com](https://cloud.browser-use.com)
4. Add to OpenClaw config or set `BROWSER_USE_API_KEY` env var

## Usage

```bash
# Quick task
BROWSER_USE_API_KEY=bu_... node run-task.js "Get top 5 Hacker News posts"

# Complex task with more steps
MAX_STEPS=50 BROWSER_USE_API_KEY=bu_... node run-task.js "Search Amazon for..."
```

## Example Tasks

- `Go to resy.com, search for "Carbone" in NYC, check Saturday availability for 2`
- `Get the current price of Bitcoin from coinbase.com`
- `Go to news.ycombinator.com and return the top 5 posts`

## Links

- [Browser Use Cloud](https://cloud.browser-use.com)
- [OpenClaw](https://github.com/openclaw/openclaw)
- [ClawHub Skills](https://clawhub.com)

## License

MIT
