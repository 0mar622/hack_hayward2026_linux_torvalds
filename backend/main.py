#pip3 install fastapi uvicorn (do on the terminal before running)

from fastapi import FastAPI, Request

app = FastAPI()

@app.get("/")
def root():
    return {"status": "server is running"}

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
