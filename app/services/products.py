from app.services.base import BaseService
from app.schemes.products import SProductAdd, SProductUpdate


class ProductService(BaseService):

    async def add_product(self, product_data: SProductAdd):
        await self.db.products.add(product_data)
        await self.db.commit()

    async def get_product(self, product_id: int):
        return await self.db.products.get_one_or_none(id=product_id)

    async def get_all_products(self):
        return await self.db.products.get_all()

    async def update_product(self, product_id: int, product_data: SProductUpdate):
        await self.db.products.edit(product_data, id=product_id)
        await self.db.commit()

    async def delete_product(self, product_id: int):
        await self.db.products.delete(id=product_id)
        await self.db.commit()