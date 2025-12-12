# app/schemas/admin_bidding_schema.py

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class BidSummaryResponse(BaseModel):
    id: int
    vendor_name: str
    vendor_rating: Optional[float] = None
    amount: float
    status: str
    event_name: Optional[str] = None
    event_date: Optional[datetime] = None

    class Config:
        from_attributes = True


class BidDetailResponse(BaseModel):
    id: int
    vendor_name: str
    vendor_rating: Optional[float] = None
    vendor_experience: Optional[str] = None
    completed_events: Optional[int] = None
    amount: float
    status: str

    proposal: Optional[str] = None
    includes: Optional[List[str]] = None
    requirements: Optional[List[str]] = None
    advantages: Optional[List[str]] = None

    timeline_days: Optional[int] = None
    proposed_date: Optional[datetime] = None
    submitted_at: Optional[datetime] = None

    event_name: Optional[str] = None
    event_date: Optional[datetime] = None

    class Config:
        from_attributes = True


class BidActionRequest(BaseModel):
    notes: Optional[str] = None
