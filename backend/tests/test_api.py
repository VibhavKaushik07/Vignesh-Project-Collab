import sys
from pathlib import Path
from fastapi.testclient import TestClient

# Ensure PROJECT_ROOT in sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.app.main import app

client = TestClient(app)

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["platform"] == "KrishiRakshak"
    assert data["status"] == "healthy"
    print("[PASS] Health endpoint verified")

def test_auth_and_login():
    # Login with demo user
    res = client.post("/api/auth/login", json={
        "email": "farmer@krishirakshak.in",
        "password": "Kisan@2026"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "farmer@krishirakshak.in"
    print("[PASS] Demo farmer login verified")
    return data["access_token"]

def test_pesticides():
    res = client.get("/api/pesticides?crop=Tomato")
    assert res.status_code == 200
    pesticides = res.json()
    assert len(pesticides) > 0
    print(f"[PASS] Smart Pesticides Advisory verified ({len(pesticides)} products for Tomato)")

def test_organic_alternatives():
    res = client.get("/api/organic")
    assert res.status_code == 200
    items = res.json()
    assert len(items) > 0
    print(f"[PASS] Organic Alternatives verified ({len(items)} natural recipes)")

def test_comparisons():
    res = client.get("/api/comparison")
    assert res.status_code == 200
    comps = res.json()
    assert len(comps) > 0
    print(f"[PASS] Chemical vs Organic Comparisons verified ({len(comps)} matrices)")

def test_weather():
    res = client.get("/api/weather?district=Bengaluru%20Rural")
    assert res.status_code == 200
    w = res.json()
    assert "spraying_advisory" in w
    assert "current" in w
    assert len(w["forecast"]) >= 5
    print(f"[PASS] Weather & Spraying Advisory verified: Status is {w['spraying_advisory']['status']}")

def test_chat():
    res = client.post("/api/chat", json={
        "message": "How do I prepare Jeevamrutha?",
        "session_id": "test-session",
        "language": "en"
    })
    assert res.status_code == 200
    chat = res.json()
    assert "Jeevamrutha" in chat["response"]
    assert len(chat["sources"]) > 0
    print("[PASS] AI Assistant Chatbot verified with retrieved sources")

def test_dashboard(token: str):
    res = client.get("/api/dashboard", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    dash = res.json()
    assert dash["farmer"]["full_name"] == "Vignesh"
    assert len(dash["crops"]) > 0
    assert "weather" in dash
    print(f"[PASS] Farmer Dashboard verified ({len(dash['crops'])} crops, {dash['stats']['total_acres']} acres)")

def test_disease_detection():
    # Create a small valid test PNG image in memory
    from io import BytesIO
    from PIL import Image

    img = Image.new("RGB", (100, 100), color=(34, 139, 34))
    buf = BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)

    files = {"file": ("test_leaf.png", buf, "image/png")}
    data = {"crop_name": "Tomato"}

    res = client.post("/api/disease/analyze", data=data, files=files)
    assert res.status_code == 200
    pred = res.json()
    assert pred["crop_name"] == "Tomato"
    assert "disease_name" in pred
    assert pred["confidence"] > 0
    assert pred["is_demo_mode"] is True
    print(f"[PASS] AI Crop Disease Detection verified: Detected '{pred['disease_name']}' with {round(pred['confidence']*100)}% confidence")

if __name__ == "__main__":
    print("--- Running KrishiRakshak Automated Verification Test Suite ---")
    test_health()
    token = test_auth_and_login()
    test_pesticides()
    test_organic_alternatives()
    test_comparisons()
    test_weather()
    test_chat()
    test_dashboard(token)
    test_disease_detection()
    print("--- ALL BACKEND TEST CASES PASSED SUCCESSFULLY! ---")
