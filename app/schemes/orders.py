from pydantic import BaseModel
from typing import Optional


class SOrderAdd(BaseModel):
    user_id: int
    total: int
    product_id: int
    quantity: int


class SOrderGet(SOrderAdd):
    id: int


class SOrderUpdate(BaseModel):
    user_id: Optional[int] = None
    total: Optional[int] = None
    product_id: Optional[int] = None
    quantity: Optional[int] = None