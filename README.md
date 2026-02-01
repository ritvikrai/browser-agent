# Browser Agent

AI-powered browser automation for repetitive web tasks.

## Features

- 🌐 Natural language task descriptions
- 🤖 AI breaks down tasks into steps
- 🎭 Playwright-powered automation
- 📸 Screenshot verification
- 💾 Save and reuse workflows

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **AI**: OpenAI GPT-4o
- **Automation**: Playwright
- **Styling**: Tailwind CSS

## Getting Started

```bash
npm install
npx playwright install  # Install browsers
cp .env.example .env  # Add your OPENAI_API_KEY
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/plan` | Plan task steps |
| POST | `/api/run` | Execute automation |
| GET | `/api/tasks` | Get task history |
| GET/POST | `/api/workflows` | Manage saved workflows |

## Demo Mode

Works without API key with predefined workflow templates.

## License

MIT
