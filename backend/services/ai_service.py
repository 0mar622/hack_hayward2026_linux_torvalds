import os
import re
import json

def analyze_conversation(transcript: str, mode: str) -> dict:
    mode = (mode or "").lower().strip()

    def sentences(text):
        return [s.strip() for s in re.split(r'(?<=[.!?])\s+', text) if s.strip()]

    raw_sents = sentences(transcript)

    # Extract labels like "Interviewer:", "Omar:"
    def extract_labels(text):
        return re.findall(r'([A-Za-z][A-Za-z0-9 _-]{1,30})\s*:', text)

    labels = extract_labels(transcript)

    # ✅ FIXED NAME LOGIC
    def get_other_name():
        labels = re.findall(r'([A-Za-z][A-Za-z0-9 _-]{1,30})\s*:', transcript)
        labels = [l for l in labels if l.lower() != "you"]
        return labels[0] if labels else None

    other_name = get_other_name()

    # Clean sentences
    def clean(sent):
        sent = re.sub(r'^\s*[A-Za-z][A-Za-z0-9 _-]{0,30}:\s*', '', sent)
        sent = re.sub(r'^(hi|hello|hey)[\s,]+', "", sent, flags=re.I)
        return sent.strip()

    sents = [clean(s) for s in raw_sents if clean(s)]

    # Skip garbage sentences
    def valid_sentence(sent):
        if len(sent.split()) < 3:
            return False
        if re.fullmatch(r'[A-Z][a-z]+\.?', sent):
            return False
        return True

    # Paraphrase
    def paraphrase(sent):
        t = sent
        t = re.sub(r"\bI'm\b|\bI am\b", "The speaker is", t, flags=re.I)
        t = re.sub(r"\bI can\b", "they can", t, flags=re.I)
        t = re.sub(r"\bI\b", "they", t, flags=re.I)

        # capitalize only if sentence starts with it
        t = t[0].upper() + t[1:] if t else t
        
        t = re.sub(r"\bmy\b", "their", t, flags=re.I)
        return t.strip()

    # Extract timing
    def get_timing(text):
        m = re.search(r'\b(next week|this week|tomorrow|today|by \w+day)\b', text, re.I)
        return m.group(0) if m else None

    # Priority
    def get_priority(text):
        if re.search(r'\b(urgent|asap)\b', text, re.I):
            return "high"
        if re.search(r'\b(next week|soon)\b', text, re.I):
            return "medium"
        return "low"

    # Speech feedback
    def speech_feedback(text):
        return {
            "clarity": "high",
            "confidence": "medium",
            "filler_words": "low",
            "structure": None,
            "improvements": "Keep responses concise and structured"
        }

    used = set()

    # ✅ SUMMARY (skip follow-up sentences)
    summary = ""
    for i, s in enumerate(sents):
        if not valid_sentence(s):
            continue

        # ADD THIS
        if mode == "interview":
            if "you:" not in raw_sents[i].lower():
                continue

        # skip follow-up / request sentences
        if re.search(r'\b(send|follow up|email|please|could you|can you)\b', s, re.I):
            continue

        summary = paraphrase(s)
        used.add(i)
        break

    # fallback if empty
    if not summary:
        for s in sents:
            if valid_sentence(s) and not re.search(r'\b(send|follow up|email|please|could you|can you)\b', s, re.I):
                summary = paraphrase(s)
                break

    # ✅ OPPORTUNITY
    opportunity = None
    for i, s in enumerate(sents):
        if i in used:
            continue
        if re.search(r'\b(hiring|role|position|opening|opportunity|looking for|we are looking|join|team|help|support|collaborate|volunteer|assist|work with)\b', s, re.I):
            text = s.lower()
            if "intern" in text:
                opportunity = "Backend internship" if "backend" in text else "Internship"
            elif "volunteer" in text:
                opportunity = "Volunteer role"
            elif "senior" in text:
                opportunity = "Senior role"
            elif "engineer" in text:
                opportunity = "Engineering role"
            elif "collaborate" in text or "work with" in text:
                opportunity = "Collaboration"
            else:
                opportunity = "Opportunity"
            used.add(i)
            break
    
    if opportunity == summary:
        opportunity = None

    # ✅ FOLLOW UP
    follow_up = None
    follow_up_timing = None
    for i, s in enumerate(sents):
        if i in used:
            continue
        if re.search(r'\b(send|follow up|email|reach out|please)\b', s, re.I):
            follow_up = paraphrase(s)
            follow_up_timing = get_timing(s) or get_timing(transcript)
            used.add(i)
            break

    priority = get_priority(transcript)
    speech = speech_feedback(transcript)

    # ================= NETWORKING =================
    if mode == "networking":
        return {
            "name": other_name,
            "summary": summary,
            "opportunity": opportunity,
            "priority": priority,
            "follow_up": follow_up,
            "follow_up_timing": follow_up_timing,
            "speech_feedback": speech
        }

    # ================= INTERVIEW =================
    if mode == "interview":
        return {
            "summary": summary,
            "speech_feedback": speech
        }

    # ================= PITCH =================
    return {
        "summary": summary,
        "investor_feedback": ["Needs clearer differentiation and measurable impact"],
        "action_items": ["Clarify next steps and provide requested materials"],
        "speech_feedback": speech
    }


if __name__ == "__main__":
    samples = [
        # ===== NETWORKING (realistic) =====
        (
            "Bob: Hi, I'm Bob. I'm a backend engineer at Google working on distributed systems. "
            "You: Nice to meet you. "
            "Bob: We're hiring interns for backend roles. Feel free to reach out next week.",
            "networking"
        ),
        (
            "Sarah: Hello, I'm Sarah. I work in community outreach for a nonprofit. "
            "You: That sounds interesting. "
            "Sarah: We’re always looking for volunteers. You can email me by Friday to get involved.",
            "networking"
        ),

        # ===== INTERVIEW =====
        (
            "Interviewer: Can you design a scalable queue system? "
            "You: Yes, I would use a distributed message queue and discuss trade-offs like latency and consistency.",
            "interview"
        ),
        (
            "Panel: Tell me about a challenge you faced. "
            "You: I worked on a team project where we had communication issues, and I helped organize tasks better.",
            "interview"
        ),

        # ===== PITCH =====
        (
            "You: I'm building an AI networking assistant that analyzes conversations and suggests follow-ups. "
            "Investor: How do you plan to monetize this? "
            "Investor: You should also show benchmarks and differentiation.",
            "pitch"
        ),
        (
            "You: Our algorithm improves recommendation accuracy using real-time feedback. "
            "Judge: What baseline are you comparing against? "
            "Judge: Run more experiments and provide clearer results.",
            "pitch"
        ),
    ]

    for i, (txt, mode) in enumerate(samples, 1):
        print(f"\n=== CASE {i} — mode={mode} ===")
        print(json.dumps(analyze_conversation(txt, mode), indent=2, ensure_ascii=False))