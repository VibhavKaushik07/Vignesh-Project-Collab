from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import User, ChatMessage
from backend.app.schemas.schemas import ChatRequest, ChatResponse
from backend.app.services.chat_service import generate_assistant_response
from backend.app.api.deps import get_current_user_optional

router = APIRouter(prefix="/chat", tags=["KrishiRakshak AI Assistant"])

@router.post("", response_model=ChatResponse)
def ask_assistant(
    chat_in: ChatRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    # 1. Record user message
    user_msg = ChatMessage(
        user_id=current_user.id if current_user else None,
        session_id=chat_in.session_id or "default-session",
        sender="user",
        message=chat_in.message,
        language=chat_in.language or "en"
    )
    db.add(user_msg)
    db.commit()

    # 2. Generate response with knowledge retrieval
    result = generate_assistant_response(
        db=db,
        user_query=chat_in.message,
        language=chat_in.language or "en"
    )

    # 3. Record assistant message
    asst_msg = ChatMessage(
        user_id=current_user.id if current_user else None,
        session_id=chat_in.session_id or "default-session",
        sender="assistant",
        message=result["response"],
        language=chat_in.language or "en",
        sources="; ".join(result["sources"]) if result.get("sources") else None
    )
    db.add(asst_msg)
    db.commit()

    return {
        "response": result["response"],
        "session_id": chat_in.session_id or "default-session",
        "language": chat_in.language or "en",
        "sources": result.get("sources", []),
        "suggested_questions": result.get("suggested_questions", [])
    }

@router.get("/history")
def get_chat_history(
    session_id: str = "default-session",
    db: Session = Depends(get_db)
):
    messages = db.query(ChatMessage).filter(
        ChatMessage.session_id == session_id
    ).order_by(ChatMessage.created_at.asc()).all()

    return [
        {
            "id": m.id,
            "sender": m.sender,
            "message": m.message,
            "language": m.language,
            "sources": m.sources.split("; ") if m.sources else [],
            "created_at": m.created_at.isoformat() if m.created_at else None
        }
        for m in messages
    ]
