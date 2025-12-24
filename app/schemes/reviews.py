from pydantic import BaseModel
from typing import Optional


class SReviewAdd(BaseModel):
    product_id: int
    rating: int
    user_id: int
    comment: Optional[str] = None


class SReviewGet(SReviewAdd):
    id: int


class SReviewUpdate(BaseModel):
    product_id: Optional[int] = None
    rating: Optional[int] = None
    user_id: Optional[int] = None
    comment: Optional[str] = None