# AgentHub - AI Agent Services Marketplace

Marketplace API for discovering, registering, and calling AI agent services with x402 micropayments on Base (USDC).

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check & endpoint list |
| GET | `/api/services` | List/search/filter services |
| GET | `/api/services/:id` | Get service details |
| POST | `/api/services` | Register a new service |
| GET | `/api/services/:id/pay` | Get x402 payment requirements |
| POST | `/api/services/:id/call` | Call a service (requires X-Payment header) |
| GET | `/api/developer/stats` | Developer usage analytics |

## Query Parameters

### GET /api/services
- `search` - Full-text search on name, description, tags
- `category` - Filter by category (nlp, data, etc.)
- `tag` - Filter by tag
- `status` - Filter by status (active, inactive)
- `page` / `limit` - Pagination

### POST /api/services
```json
{
  "name": "My Agent",
  "description": "Does cool stuff",
  "category": "nlp",
  "tags": ["ai", "text"],
  "endpoint": "https://my-api.com/do-thing",
  "pricing": { "amount": "10000", "currency": "USDC" }
}
```

## x402 Payment Flow
1. `GET /api/services/:id/pay` → returns 402 with payment requirements
2. Client creates payment using x402 protocol
3. `POST /api/services/:id/call` with `X-Payment` header → proxies to upstream service

## Deploy
```bash
npm install
vercel --prod
```
