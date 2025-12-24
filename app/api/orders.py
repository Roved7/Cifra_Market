from fastapi import APIRouter

from app.api.dependencies import DBDep
from app.schemes.orders import SOrderAdd, SOrderGet, SOrderUpdate
from app.services.orders import OrderService

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/", summary="Создание нового заказа")
async def create_order(
    order_data: SOrderAdd,
    db: DBDep,
) -> dict[str, str]:
    await OrderService(db).add_order(order_data)
    return {"status": "OK"}


@router.get("/{id}", summary="Получение конкретного заказа")
async def get_order(
    id: int,
    db: DBDep,
) -> SOrderGet:
    return await OrderService(db).get_order(id)


@router.get("/", summary="Получение списка всех заказов")
async def get_all_orders(
    db: DBDep,
) -> list[SOrderGet]:
    return await OrderService(db).get_all_orders()


@router.put("/{id}", summary="Изменение конкретного заказа")
async def update_order(
    id: int,
    order_data: SOrderUpdate,
    db: DBDep,
) -> dict[str, str]:
    await OrderService(db).update_order(id, order_data)
    return {"status": "OK"}


@router.delete("/{id}", summary="Удаление конкретного заказа")
async def delete_order(
    id: int,
    db: DBDep,
) -> dict[str, str]:
    await OrderService(db).delete_order(id)
    return {"status": "OK"}