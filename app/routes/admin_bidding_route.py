# app/routes/admin_bidding_route.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.admin_bidding_schema import (
    BidSummaryResponse,
    BidDetailResponse,
    BidActionRequest,
)
from app.services.admin_bidding_service import (
    fetch_all_bids,
    fetch_bid_details,
    approve_bid,
    decline_bid,
)

router = APIRouter(prefix="/admin/bidding", tags=["Admin - Bidding"])


@router.get("/", response_model=list[BidSummaryResponse])
def list_bids(db: Session = Depends(get_db)):
    """Return all vendor bids for admin dashboard."""
    return fetch_all_bids(db)


@router.get("/{bid_id}", response_model=BidDetailResponse)
def get_bid_details(bid_id: int, db: Session = Depends(get_db)):
    """Return full details for a single bid."""
    bid = fetch_bid_details(db, bid_id)
    if not bid:
        raise HTTPException(status_code=404, detail="Bid not found")
    return bid


@router.post("/{bid_id}/accept")
def accept_bid(bid_id: int, req: BidActionRequest, db: Session = Depends(get_db)):
    """Admin accepts a vendor's bid."""
    success = approve_bid(db, bid_id, req.notes)
    if not success:
        raise HTTPException(status_code=404, detail="Bid not found")
    return {"message": "Bid accepted successfully"}


@router.post("/{bid_id}/reject")
def reject_bid(bid_id: int, req: BidActionRequest, db: Session = Depends(get_db)):
    """Admin rejects a vendor's bid."""
    success = decline_bid(db, bid_id, req.notes)
    if not success:
        raise HTTPException(status_code=404, detail="Bid not found")
    return {"message": "Bid rejected successfully"}
