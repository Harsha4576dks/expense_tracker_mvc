from fastapi import FastAPI
from .database import Base, engine
from .middleware.authorization import AuthorizationMiddleware

from .controllers.user_controller import router as user_router
from .controllers.expense_controller import router as expense_router
from .controllers.summary_controller import router as summary_router
from .controllers.auth_controller import router as authorization_router
from .controllers.graph_controller import router as graph_router

from .models import user
from .models import expense
from .models import summary
from .models import auth_

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(AuthorizationMiddleware)
app.include_router(user_router)
app.include_router(expense_router)
app.include_router(summary_router)
app.include_router(authorization_router)
app.include_router(graph_router)