from typing import TYPE_CHECKING

from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.database import Base

if TYPE_CHECKING:
    from app.models.users import UserModel
    from app.models.reviews import ReviewModel
    from app.models.orders import OrderModel


class ProductModel(Base):
    __tablename__ = "product"

    id: Mapped[int] = mapped_column(primary_key=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    price: Mapped[int] = mapped_column(Integer, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(String(255))
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    author: Mapped["UserModel"] = relationship("UserModel", foreign_keys=[author_id])
    reviews: Mapped[list["ReviewModel"]] = relationship("ReviewModel", foreign_keys="ReviewModel.product_id")
    orders: Mapped[list["OrderModel"]] = relationship("OrderModel", foreign_keys="OrderModel.product_id")