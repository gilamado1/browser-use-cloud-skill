---
name: browser-use-cloud
description: Cloud-based browser automation via Browser Use API. Execute web tasks with natural language - scraping, form filling, checking availability, and more. Handles anti-bot detection automatically.
metadata: {"openclaw":{"emoji":"🌐","requires":{"bins":["node"]}}}
---

# Browser Use Cloud 🌐

Cloud-based browser automation that just works. Send natural language tasks, get results back. No Playwright setup, no cookie management, no anti-bot headaches.

## Overview

Browser Use Cloud runs headless browsers in the cloud with:
- Built-in stealth mode (anti-detection)
- Persistent profiles (login sessions survive)
- Structured output (get clean JSON)
- US proxy by default (configurable)

**Best for:**
- Sites that block automation (Resy, Indeed, etc.)
- Tasks requiring login state
- Quick scraping without infrastructure

## Configuration

API key should be set in OpenClaw config at `skills.entries.browser-use-cloud.apiKey` or environment:

```bash
export BROWSER_USE_API_KEY=bu_...
```

## Usage

### Quick Task (Node.js)

```javascript
const { BrowserUseClient } = require('browser-use-sdk');

const client = new BrowserUseClient({
    apiKey: process.env.BROWSER_USE_API_KEY
});

const task = await client.tasks.createTask({
    task: 'Go to resy.com, search for "Carbone" in NYC, check Saturday availability for 2',
    llm: 'browser-use-llm',
    maxSteps: 30
});

// Watch for completion
for await (const update of task.watch()) {
    if (update.data?.status === 'finished') {
        console.log(update.data.output);
        break;
    }
}
```

### Using the Helper Script

```bash
# Simple task
node ~/clawd/skills/browser-use-cloud/run-task.js "Get the top 3 posts from news.ycombinator.com"

# With more steps for complex tasks
MAX_STEPS=50 node ~/clawd/skills/browser-use-cloud/run-task.js "Log into site and extract data"
```

## Task Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `task` | required | Natural language instruction |
| `llm` | `browser-use-llm` | Model to use |
| `maxSteps` | 100 | Max actions before stopping |
| `startUrl` | none | URL to navigate to first |
| `structuredOutput` | none | JSON schema for output format |
| `secrets` | none | Key-value pairs for credentials |

## Sessions & Profiles

For multi-step workflows (login → do stuff → logout):

```javascript
// Create persistent session
const session = await client.sessions.createSession({
    proxyCountryCode: 'us'  // or 'gb', 'de', etc.
});

// Run tasks in same session (shares cookies/state)
const loginTask = await client.tasks.createTask({
    sessionId: session.id,
    task: 'Log into example.com with username X password Y'
});
await loginTask.complete();

const dataTask = await client.tasks.createTask({
    sessionId: session.id,
    task: 'Now extract the dashboard data'
});
```

## Structured Output

Get clean JSON instead of prose:

```javascript
const task = await client.tasks.createTask({
    task: 'Get top 5 HN posts',
    structuredOutput: JSON.stringify({
        type: 'array',
        items: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                url: { type: 'string' },
                points: { type: 'number' }
            }
        }
    })
});
```

## Example Tasks

**Resy availability check:**
```
Go to resy.com, search for "Carbone" in New York, and check if there are any reservations available for 2 people this Saturday evening.
```

**Indeed applicant screening:**
```
Go to indeed.com/hire, log in, and list the 5 most recent applicants for the Ambulette Driver position with their names and application dates.
```

**Price monitoring:**
```
Go to amazon.com and find the current price for "Sony WH-1000XM5 headphones".
```

## Limitations

- Tasks have a default timeout (~2 min)
- Complex multi-page workflows may need higher `maxSteps`
- No real-time streaming of page content (just status updates)
- Costs per task (check Browser Use pricing)

## Links

- [Browser Use Cloud](https://cloud.browser-use.com)
- [Documentation](https://docs.cloud.browser-use.com)
- [SDK on npm](https://www.npmjs.com/package/browser-use-sdk)
