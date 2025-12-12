from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings

# DB
from app.database import engine, Base

# Core Admin Routes
from app.routes import (
    auth_route,
    user_route,
    organization_route,
    branch_route,
    role_route,
    menu_route,
)

# Event
from app.routes.event_route import router as event_router

# Category
from app.routes.category_route import router as category_router

# Vendor Routes
from app.routes.vendor_auth_route import router as vendor_auth_router
from app.routes.vendor_profile_route import router as vendor_profile_router
from app.routes.vendor_dashboard_route import router as vendor_dashboard_router

# Admin Bidding Routes (NEW)
from app.routes.admin_bidding_route import router as admin_bidding_router


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Evination FastAPI Application",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# -------------------------
# CORS
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # Modify later for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# ROUTES REGISTRATION
# -------------------------

# ---- Core Admin APIs ----
app.include_router(auth_route.router, prefix="/api")
app.include_router(user_route.router, prefix="/api")
app.include_router(organization_route.router, prefix="/api")
app.include_router(branch_route.router, prefix="/api")
app.include_router(role_route.router, prefix="/api")
app.include_router(menu_route.router, prefix="/api")

# ---- Category API ----
app.include_router(category_router, prefix="/api")

# ---- Event Module ----
app.include_router(event_router, prefix="/api")

# ---- Vendor APIs ----
app.include_router(vendor_auth_router, prefix="/api")
app.include_router(vendor_profile_router, prefix="/api")
app.include_router(vendor_dashboard_router, prefix="/api")

# ---- Admin Bidding APIs ----
app.include_router(admin_bidding_router, prefix="/api")


# -------------------------
# HEALTH / ROOT
# -------------------------
@app.get("/")
async def root():
    return {
        "message": "Welcome to Evination API",
        "version": settings.APP_VERSION,
        "docs": "/api/docs"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": settings.APP_VERSION}
