import uvicorn
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse
from app.api.sample import router as sample_router
from app.api.auth import router as auth_router
from app.api.roles import router as role_router
from app.api.products import router as products_router
from app.api.orders import router as orders_router
from app.api.reviews import router as reviews_router

app = FastAPI(title="individual_project_template", version="0.0.1")

# Include API routers first to ensure they take precedence
app.include_router(sample_router)
app.include_router(auth_router)
app.include_router(role_router)
app.include_router(products_router)
app.include_router(orders_router)
app.include_router(reviews_router)

# Mount static files at the root level to serve CSS, JS, and other assets with proper routing
app.mount("/", StaticFiles(directory="app/Static", html=True), name="static")

if __name__ == "__main__":
    uvicorn.run(app=app)
