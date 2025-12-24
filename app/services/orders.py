from app.services.base import BaseService
from app.repositories.orders import OrderRepository
from app.schemes.orders import SOrderAdd, SOrderUpdate


class OrderService(BaseService):
    repository: OrderRepository

    async def add_order(self, order_data: SOrderAdd):
        return await self.repository.create(order_data)

    async def get_order(self, order_id: int):
        return await self.repository.get(order_id)

    async def get_all_orders(self):
        return await self.repository.get_all()

    async def update_order(self, order_id: int, order_data: SOrderUpdate):
        return await self.repository.update(order_id, order_data)

    async def delete_order(self, order_id: int):
        return await self.repository.delete(order_id)