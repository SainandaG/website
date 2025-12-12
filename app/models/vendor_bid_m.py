from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from app.models.base_model import BaseModel


class VendorBid(BaseModel):
    __tablename__ = "vendor_bids"

    # ----------------------------
    # RELATIONS
    # ----------------------------
    vendor_id = Column(Integer, ForeignKey("vendors.id"), nullable=False)
    event_id = Column(Integer, nullable=True)
    category_id = Column(Integer, nullable=True)

    # ----------------------------
    # BID DETAILS
    # ----------------------------
    amount = Column(Float, nullable=False)
    status = Column(String(50), default="pending")
    # pending, submitted, rejected, accepted, cancelled

    notes = Column(String(500), nullable=True)
    submitted_at = Column(DateTime, nullable=True)
    accepted_at = Column(DateTime, nullable=True)

    # ----------------------------
    # EXTENDED FIELDS FOR ADMIN UI
    # ----------------------------

    # For Timeline/Delivery time
    timeline_days = Column(Integer, nullable=True)

    # Proposed delivery / event date
    proposed_date = Column(DateTime, nullable=True)

    # UI shows list of advantages → JSON list
    advantages = Column(JSON, nullable=True)

    # Requirements (e.g., certificates)
    requirements = Column(JSON, nullable=True)

    # Services included (Admin Bid Details)
    includes = Column(JSON, nullable=True)

    # ----------------------------
    # Vendor Profile Snapshot
    # ----------------------------
    vendor_rating = Column(Float, nullable=True)
    vendor_experience = Column(String(50), nullable=True)
    vendor_completed_events = Column(Integer, nullable=True)

    # ----------------------------
    # Relationship
    # ----------------------------
    vendor = relationship("Vendor", back_populates="bids")
