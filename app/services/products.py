from app.services.base import BaseService
from app.repositories.products import ProductRepository
from app.schemes.products import SProductAdd, SProductUpdate


class ProductService(BaseService):
    repository: ProductRepository

    async def add_product(self, product_data: SProductAdd):
        return await self.repository.create(product_data)

    async def get_product(self, product_id: int):
        return await self.repository.get(product_id)

    async def get_all_products(self):
        return await self.repository.get_all()

    async def update_product(self, product_id: int, product_data: SProductUpdate):
        return await self.repository.update(product_id, product_data)

    async def delete_product(self, product_id: int):
        return await self.repository.delete(product_id)