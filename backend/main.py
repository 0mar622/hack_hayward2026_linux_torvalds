#pip3 install fastapi uvicorn (do on the terminal before running)

from fastapi import FastAPI, Request

app = FastAPI()

@app.get("/")
def root():
    return {"status": "server is running"}

@app.post("/webhook")
async def webhook(request: Request):
    try:
        body = await request.json()
    except Exception:
        body = None

    query_params = dict(request.query_params)
    uid = query_params.get("uid", "")
    session_id = query_params.get("session_id", "")

    print("\n--- Incoming Request ---")
    print("query params:", query_params)
    print("body:", body)

    # Handle both possible payload shapes
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

    if "business idea" in transcript or "startup" in transcript:
        return {
            "session_id": body_session_id or "local-test",
            "notification": {
                "prompt": "You are mentoring {{user_name}}. Based on {{user_context}} and {{user_facts}}, give one practical startup next step in under 60 words.",
                "params": ["user_name", "user_context", "user_facts"]
            }
        }

    return {"session_id": body_session_id or "local-test", "ok": True}
