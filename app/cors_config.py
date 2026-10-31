import re


ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://expense-tracker-mvc-plum.vercel.app",
]
ALLOWED_ORIGIN_REGEX = r"https://expense-tracker-.*\.vercel\.app"


def is_allowed_origin(origin: str) -> bool:
    return origin in ALLOWED_ORIGINS or re.fullmatch(ALLOWED_ORIGIN_REGEX, origin) is not None
