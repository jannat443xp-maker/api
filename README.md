# 🎮 Free Fire UID Checker API

A lightweight Node.js / Express REST API that fetches Free Fire player info from the Garena profile endpoint.

---

## 📁 Project Structure

```
api/
├── server.js            ← Entry point
├── routes/
│   └── ff.js            ← GET & POST /api/ff/check
├── services/
│   └── ffService.js     ← Garena API call + response normalisation
├── .env                 ← Environment variables
└── package.json
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start (production)
npm start

# Start (dev with auto-reload)
npm run dev
```

Server runs at **http://localhost:3000** by default.  
Change the port in `.env`: `PORT=4000`

---

## 📡 Endpoints

### `GET /api/ff/check`

| Query Param | Type   | Required | Description        |
|-------------|--------|----------|--------------------|
| `uid`       | string | ✅       | Free Fire Player UID |

**Example request:**
```
GET http://localhost:3000/api/ff/check?uid=534049908
```

**Success response:**
```json
{
  "success": true,
  "player": {
    "uid": "534049908",
    "open_id": "31886ed48fdd3ad3432a6d985bc6c11f",
    "nickname": "SADMAN㆕75!",
    "region": "BD",
    "avatar": "https://cdn-gop.garenanow.com/gop/app/0000/100/067/icon.png"
  }
}
```

**Error response:**
```json
{
  "success": false,
  "error": "Player not found. UID does not exist."
}
```

---

### `POST /api/ff/check`

**Body (JSON):**
```json
{ "uid": "534049908" }
```

Response format is identical to GET.

---

## ⚡ Rate Limiting

- **30 requests / minute** per IP address.
- Exceeding the limit returns HTTP 429.

---

## 🔧 Environment Variables

| Variable | Default | Description       |
|----------|---------|-------------------|
| `PORT`   | `3000`  | Server listen port |
