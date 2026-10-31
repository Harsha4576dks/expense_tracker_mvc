from fastapi import FastAPI
import os
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .middleware.authorization import AuthorizationMiddleware
from .cors_config import ALLOWED_ORIGINS, ALLOWED_ORIGIN_REGEX
from dotenv import load_dotenv

load_dotenv()

from .controllers.user_controller import router as user_router
from .controllers.expense_controller import router as expense_router
from .controllers.summary_controller import router as summary_router
from .controllers.auth_controller import router as authorization_router
from .controllers.graph_controller import router as graph_router
from .controllers.email_controller import router as email_router

from .models import user
from .models import expense
from .models import summary
from .models import auth_

app = FastAPI(
    title = "Expense Tracker API",
    description="Backend runnig successfully",
    version="1.0.0"
    )

Base.metadata.create_all(bind=engine)

app.add_middleware(AuthorizationMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=ALLOWED_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)


app.include_router(user_router)
app.include_router(expense_router)
app.include_router(summary_router)
app.include_router(authorization_router)
app.include_router(graph_router)
app.include_router(email_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)