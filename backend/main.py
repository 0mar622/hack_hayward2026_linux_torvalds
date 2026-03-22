from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.ai_service import analyze_conversation

app = FastAPI()

# ✅ CORS (allows frontend to talk to backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "server is running"}


# ================= WEBHOOK (existing code) =================

# ✅ Handle GET (for Omi validation / browser checks)
@app.get("/webhook")
async def webhook_get(request: Request):
    print("\n--- GET request received ---")
    print("query params:", dict(request.query_params))
    
    return {
        "status": "webhook alive",
        "method": "GET"
    }


# ✅ Handle POST (actual transcript data)
@app.post("/webhook")
async def webhook_post(request: Request):
    try:
        body = await request.json()
    except Exception:
        body = None

    query_params = dict(request.query_params)
    uid = query_params.get("uid", "")
    session_id = query_params.get("session_id", "")

    print("\n--- POST request received ---")
    print("query params:", query_params)
    print("body:", body)

    # Handle payload shapes
    if isinstance(body, list):
        segments = body
        body_session_id = session_id
    elif isinstance(body, dict):
        segments = body.get("segments", [])
        body_session_id = body.get("session_id", session_id)
    else:
        segments = []
        body_session_id = session_id

    transcript = " ".join(
        s.get("text", "") for s in segments if isinstance(s, dict)
    ).strip().lower()

    print("uid:", uid)
    print("session_id:", body_session_id)
    print("transcript:", transcript)

    return {
        "session_id": body_session_id or "local-test",
        "result": f"Received: {transcript}"
    }


# ================= ANALYZE ENDPOINT (NEW) =================

class AnalyzeRequest(BaseModel):
    transcript: str
    mode: str


@app.post("/analyze")
async def analyze(req: AnalyzeRequest):
    print("\n--- ANALYZE REQUEST ---")
    print("transcript:", req.transcript)
    print("mode:", req.mode)

    result = analyze_conversation(req.transcript, req.mode)
    return result