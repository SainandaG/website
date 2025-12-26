from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List

from app.database import get_db
from app.services.vendor_bidding_service import VendorBiddingService
from app.models.user_m import User
from app.models.vendor_m import Vendor
from app.dependencies import get_current_active_user, PermissionChecker

from app.schemas.vendor_bid_schema import (
    VendorBidCreateSchema,
    VendorAvailableEventSchema,
    VendorMyBidSchema,
)

router = APIRouter(
    prefix="/vendor/bidding",
    tags=["Vendor Bidding"]
)

@router.get(
    "/available-events",
    response_model=List[VendorAvailableEventSchema],
)
async def get_available_events(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Get all events available for the vendor to bid on.
    Only returns events where vendor can provide all required services.
    """
    vendor = db.query(Vendor).filter(Vendor.user_id == current_user.id).first()
    if not vendor:
        raise HTTPException(status_code=403, detail="User is not a vendor or vendor profile pending")
        
    return VendorBiddingService.get_available_events(
        db=db,
        vendor_id=vendor.id,
        skip=skip,
        limit=limit,
    )

@router.post(
    "/submit",
    status_code=status.HTTP_201_CREATED,
)
async def submit_bid(
    bid_data: VendorBidCreateSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Submit a bid for a specific event.
    """
    vendor = db.query(Vendor).filter(Vendor.user_id == current_user.id).first()
    if not vendor:
        raise HTTPException(status_code=403, detail="User is not a vendor or vendor profile pending")

    return VendorBiddingService.submit_bid(
        db=db,
        vendor_id=vendor.id,
        bid_data=bid_data,
    )


@router.get(
    "/my-bids",
    response_model=List[VendorMyBidSchema],
)
async def get_my_bids(
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Get all bids submitted by the current vendor.
    Optional filter by bid status.
    """
    vendor = db.query(Vendor).filter(Vendor.user_id == current_user.id).first()
    if not vendor:
        raise HTTPException(status_code=403, detail="User is not a vendor or vendor profile pending")

    return VendorBiddingService.get_my_bids(
        db=db,
        vendor_id=vendor.id,
        status=status,
        skip=skip,
        limit=limit,
    )
