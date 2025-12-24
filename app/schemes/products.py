from pydantic import BaseModel
from typing import Optional


class SProductAdd(BaseModel):
    author_id: int
    price: int
    title: str
    description: Optional[str] = None
    quantity: int = 0


class SProductGet(SProductAdd):
    id: int


class SProductUpdate(BaseModel):
    author_id: Optional[int] = None
    price: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    quantity: Optional[int] = None