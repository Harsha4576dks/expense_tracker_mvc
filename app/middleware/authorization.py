from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from ..database import SessionLocal
from ..models.user import User
from ..user_auth import verify_access_token
from ..cors_config import is_allowed_origin


class AuthorizationMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.method == "OPTIONS":
            return await call_next(request)
        path = request.url.path.rstrip("/")
        origin = request.headers.get("origin")

        if request.method not in {"GET", "HEAD"}:
            if origin and not is_allowed_origin(origin):
                return JSONResponse(status_code=403, content={"detail": "Origin not allowed"})
            if "access_token" in request.cookies and not origin:
                return JSONResponse(status_code=403, content={"detail": "Origin required"})

        public_routes = [
            "/auth/register",
            "/auth/login",
            "/auth/logout",
            "/docs",
            "/openapi.json",
            "/redoc"
        ]

        if path in public_routes:
            response = await call_next(request)

            return response

        token = request.cookies.get("access_token")
        if not token:
            return JSONResponse( status_code=401, content={ "detail": "Please sign in first" })

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