from fastapi import FastAPI
from .database import Base, engine

from .controllers.user_controller import router as user_router
from .controllers.expense_controller import router as expense_router
from .controllers.summary_controller import router as summary_router


from .models import user
from .models import expense
from .models import summary

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(user_router)
app.include_router(expense_router)
app.include_router(summary_router)