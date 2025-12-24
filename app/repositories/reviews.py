from app.models.reviews import ReviewModel
from app.repositories.base import BaseRepository


class ReviewRepository(BaseRepository):
    model = ReviewModel