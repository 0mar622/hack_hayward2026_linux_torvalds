#pip3 install fastapi uvicorn (do on the terminal before running)

from fastapi import FastAPI, Request
from pydantic import BaseModel
from typing import List, Optional, Union

app = FastAPI()

class Segment(BaseModel):
    text: str
    speaker: Optional[str] = None
    speakerId: Optional[int] = None
    is_user: Optional[bool] = None
    start: Optional[float] = None
    end: Optional[float] = None

class WrappedPayload(BaseModel):
    session_id: Optional[str] = None
    segments: List[Segment]

@app.post("/webhook")
async def webhook(request: Request, uid: str = "", session_id: str = ""):
    body = await request.json()

    # Omi docs show two possible shapes in examples:
    # 1) raw array of segments
    # 2) object with { session_id, segments }
    if isinstance(body, list):
        segments = body
        body_session_id = session_id
    else:
        segments = body.get("segments", [])
        body_session_id = body.get("session_id", session_id)

    transcript = " ".join(
        s.get("text", "") if isinstance(s, dict) else ""
        for s in segments
    ).strip().lower()

    print("uid:", uid)
    print("session_id:", body_session_id)
    print("transcript:", transcript)

    # Example trigger logic
    if "business idea" in transcript or "startup" in transcript:
        return {
            "session_id": body_session_id,
            "notification": {
                "prompt": "You are mentoring {{user_name}}. Based on {{user_context}} and {{user_facts}}, give one practical startup next step in under 60 words.",
                "params": ["user_name", "user_context", "user_facts"]
            }
        }

    return {"session_id": body_session_id}
