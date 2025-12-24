from app.services.base import BaseService
from app.repositories.reviews import ReviewRepository
from app.schemes.reviews import SReviewAdd, SReviewUpdate


class ReviewService(BaseService):
    repository: ReviewRepository

    async def add_review(self, review_data: SReviewAdd):
        return await self.repository.create(review_data)

    async def get_review(self, review_id: int):
        return await self.repository.get(review_id)

    async def get_all_reviews(self):
        return await self.repository.get_all()

    async def update_review(self, review_id: int, review_data: SReviewUpdate):
        return await self.repository.update(review_id, review_data)

    async def delete_review(self, review_id: int):
        return await self.repository.delete(review_id)