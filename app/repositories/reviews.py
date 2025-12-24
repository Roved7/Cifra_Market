from app.models.reviews import ReviewModel
from app.repositories.base import BaseRepository
from app.schemes.reviews import SReviewGet


class ReviewRepository(BaseRepository):
    model = ReviewModel
    schema = SReviewGet