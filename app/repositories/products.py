from app.models.products import ProductModel
from app.repositories.base import BaseRepository
from app.schemes.products import SProductGet


class ProductRepository(BaseRepository):
    model = ProductModel
    schema = SProductGet