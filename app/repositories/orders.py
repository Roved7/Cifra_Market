from app.models.orders import OrderModel
from app.repositories.base import BaseRepository


class OrderRepository(BaseRepository):
    model = OrderModel