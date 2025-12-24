from fastapi import APIRouter

from app.api.dependencies import DBDep
from app.schemes.reviews import SReviewAdd, SReviewGet, SReviewUpdate
from app.services.reviews import ReviewService

router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.post("/", summary="Создание нового отзыва")
async def create_review(
    review_data: SReviewAdd,
    db: DBDep,
) -> dict[str, str]:
    await ReviewService(db).add_review(review_data)
    return {"status": "OK"}


@router.get("/{id}", summary="Получение конкретного отзыва")
async def get_review(
    id: int,
    db: DBDep,
) -> SReviewGet:
    return await ReviewService(db).get_review(id)


@router.get("/", summary="Получение списка всех отзывов")
async def get_all_reviews(
    db: DBDep,
) -> list[SReviewGet]:
    return await ReviewService(db).get_all_reviews()


@router.put("/{id}", summary="Изменение конкретного отзыва")
async def update_review(
    id: int,
    review_data: SReviewUpdate,
    db: DBDep,
) -> dict[str, str]:
    await ReviewService(db).update_review(id, review_data)
    return {"status": "OK"}


@router.delete("/{id}", summary="Удаление конкретного отзыва")
async def delete_review(
    id: int,
    db: DBDep,
) -> dict[str, str]:
    await ReviewService(db).delete_review(id)
    return {"status": "OK"}