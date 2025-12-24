from app.models.orders import OrderModel
from app.repositories.base import BaseRepository
from app.schemes.orders import SOrderGet


class OrderRepository(BaseRepository):
    model = OrderModel
    schema = SOrderGet