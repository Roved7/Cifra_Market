from app.services.base import BaseService
from app.schemes.orders import SOrderAdd, SOrderUpdate


class OrderService(BaseService):

    async def add_order(self, order_data: SOrderAdd):
        await self.db.orders.add(order_data)
        await self.db.commit()

    async def get_order(self, order_id: int):
        return await self.db.orders.get_one_or_none(id=order_id)

    async def get_all_orders(self):
        return await self.db.orders.get_all()

    async def update_order(self, order_id: int, order_data: SOrderUpdate):
        await self.db.orders.edit(order_data, id=order_id)
        await self.db.commit()

    async def delete_order(self, order_id: int):
        await self.db.orders.delete(id=order_id)
        await self.db.commit()