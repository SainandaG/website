from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal


# --------------------------------------------
# BASE
# --------------------------------------------
class VendorOrderBase(BaseModel):
    vendor_id: int
    event_id: Optional[int]
    order_ref: str
    amount: Decimal
    status: str


# --------------------------------------------
# CREATE (internal use)
# --------------------------------------------
class VendorOrderCreateSchema(VendorOrderBase):
    confirmed_at: Optional[datetime] = None


# --------------------------------------------
# RESPONSE (API)
# --------------------------------------------
class VendorOrderResponseSchema(VendorOrderBase):
    id: int

    confirmed_at: Optional[datetime]
    completed_at: Optional[datetime]

    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
