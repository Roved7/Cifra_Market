from app.models.products import ProductModel
from app.repositories.base import BaseRepository


class ProductRepository(BaseRepository):
    model = ProductModel