import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.core.security import hash_password, verify_password, create_access_token
from backend.app.models.models import User, FarmerCrop
from backend.app.schemas.schemas import UserCreate, UserLogin, UserUpdate, UserResponse, TokenResponse, ProfileCreate
from backend.app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication & Profiles"])

@router.post("/register", response_model=TokenResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email.strip().lower()).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="An account with this email address already exists."
        )

    new_user = User(
        full_name=user_in.full_name.strip(),
        email=user_in.email.strip().lower(),
        mobile=user_in.mobile.strip() if user_in.mobile else None,
        password_hash=hash_password(user_in.password),
        state=user_in.state,
        district=user_in.district,
        preferred_language=user_in.preferred_language
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": str(new_user.id), "email": new_user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": new_user
    }

@router.post("/login", response_model=TokenResponse)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email.strip().lower()).first()
    if not user or not verify_password(login_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please verify credentials."
        )

    token = create_access_token({"sub": str(user.id), "email": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserResponse)
def update_profile(
    update_in: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if update_in.full_name is not None and update_in.full_name.strip():
        current_user.full_name = update_in.full_name.strip()
    if update_in.mobile is not None:
        current_user.mobile = update_in.mobile.strip()
    if update_in.state is not None:
        current_user.state = update_in.state
    if update_in.district is not None:
        current_user.district = update_in.district
    if update_in.preferred_language is not None:
        current_user.preferred_language = update_in.preferred_language

    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/profiles", response_model=List[UserResponse])
def list_profiles(db: Session = Depends(get_db)):
    """Returns all registered farmer profiles for quick switching."""
    return db.query(User).order_by(User.id.asc()).all()

@router.post("/profiles", response_model=TokenResponse)
def create_profile(profile_in: ProfileCreate, db: Session = Depends(get_db)):
    """Adds a new farmer profile."""
    # Generate email if not supplied
    clean_name = profile_in.full_name.strip().lower().replace(" ", "_")
    target_email = profile_in.email.strip().lower() if profile_in.email else f"{clean_name}_{uuid.uuid4().hex[:4]}@krishirakshak.in"

    existing = db.query(User).filter(User.email == target_email).first()
    if existing:
        target_email = f"{clean_name}_{uuid.uuid4().hex[:6]}@krishirakshak.in"

    pwd = profile_in.password or "Kisan@2026"
    new_profile = User(
        full_name=profile_in.full_name.strip(),
        email=target_email,
        mobile=profile_in.mobile.strip() if profile_in.mobile else None,
        password_hash=hash_password(pwd),
        state=profile_in.state,
        district=profile_in.district,
        preferred_language=profile_in.preferred_language
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)

    # Seed an initial default crop for the new profile so the dashboard looks great
    initial_crop = FarmerCrop(
        user_id=new_profile.id,
        crop_name="Tomato",
        variety="Arka Rakshak",
        farming_type="IPM",
        farm_area_acres=1.0,
        stage="Vegetative",
        notes="Newly created profile plot"
    )
    db.add(initial_crop)
    db.commit()

    token = create_access_token({"sub": str(new_profile.id), "email": new_profile.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": new_profile
    }

@router.post("/profiles/{profile_id}/switch", response_model=TokenResponse)
def switch_profile(profile_id: int, db: Session = Depends(get_db)):
    """Switches the active farmer profile."""
    target_user = db.query(User).filter(User.id == profile_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="Farmer profile not found.")

    token = create_access_token({"sub": str(target_user.id), "email": target_user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": target_user
    }
