from fastapi import APIRouter

from app.api.dependencies import DBDep
from app.schemes.products import SProductAdd, SProductGet, SProductUpdate
from app.services.products import ProductService

router = APIRouter(prefix="/products", tags=["Products"])


@router.post("/", summary="Создание нового продукта")
async def create_product(
    product_data: SProductAdd,
    db: DBDep,
) -> dict[str, str]:
    await ProductService(db).add_product(product_data)
    return {"status": "OK"}


@router.get("/{id}", summary="Получение конкретного продукта")
async def get_product(
    id: int,
    db: DBDep,
) -> SProductGet:
    return await ProductService(db).get_product(id)


@router.get("/", summary="Получение списка всех продуктов")
async def get_all_products(
    db: DBDep,
) -> list[SProductGet]:
    return await ProductService(db).get_all_products()


@router.put("/{id}", summary="Изменение конкретного продукта")
async def update_product(
    id: int,
    product_data: SProductUpdate,
    db: DBDep,
) -> dict[str, str]:
    await ProductService(db).update_product(id, product_data)
    return {"status": "OK"}


@router.delete("/{id}", summary="Удаление конкретного продукта")
async def delete_product(
    id: int,
    db: DBDep,
) -> dict[str, str]:
    await ProductService(db).delete_product(id)
    return {"status": "OK"}