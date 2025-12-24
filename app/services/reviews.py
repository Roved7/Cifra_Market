from app.services.base import BaseService
from app.schemes.reviews import SReviewAdd, SReviewUpdate


class ReviewService(BaseService):

    async def add_review(self, review_data: SReviewAdd):
        await self.db.reviews.add(review_data)
        await self.db.commit()

    async def get_review(self, review_id: int):
        return await self.db.reviews.get_one_or_none(id=review_id)

    async def get_all_reviews(self):
        return await self.db.reviews.get_all()

    async def update_review(self, review_id: int, review_data: SReviewUpdate):
        await self.db.reviews.edit(review_data, id=review_id)
        await self.db.commit()

    async def delete_review(self, review_id: int):
        await self.db.reviews.delete(id=review_id)
        await self.db.commit()