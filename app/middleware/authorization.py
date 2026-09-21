from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from ..database import SessionLocal
from ..models.user import User
from ..user_auth import verify_access_token


class AuthorizationMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        path = request.url.path

        public_routes = [
            "/auth/register",
            "/auth/login",
            "/docs",
            "/openapi.json",
            "/redoc"
        ]

        if path in public_routes:
            response = await call_next(request)

            return response

        authorization = request.headers.get("Authorization")
        if not authorization:
            return JSONResponse( status_code=401, content={ "detail": "Please sign in first" })

        if not authorization.startswith("Bearer "):
            return JSONResponse( status_code=401, content={ "detail": "Invalid authorization header" })

        token = authorization.split(" ")[1]

        user_id = verify_access_token(token)
        if user_id is None:
            return JSONResponse(status_code=401, content={"detail": "Invalid or expired token" })

        db = SessionLocal()
        try:
            user = db.query(User).filter( User.id == user_id ).first()
            if not user:
                return JSONResponse( status_code=401, content={ "detail": "User not found"  } )

            request.state.user = user
            response = await call_next(request)

            return response

        finally:
            db.close()