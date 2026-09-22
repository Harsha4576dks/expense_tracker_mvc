import io
import math
from datetime import date
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from sqlalchemy.orm import Session
from ..repositories import graph_repository

STANDARD_CATEGORIES = ["Food", "Lifestyle", "Medical", "Vehicle", "Other"]

def get_aggregated_category_expenses(db: Session, user_id: int, start_date: date, end_date: date) -> dict[str, float]:
    expenses = graph_repository.get_user_expenses_by_date(db, user_id, start_date, end_date)
    category_totals = {cat: 0.0 for cat in STANDARD_CATEGORIES}

    for expense in expenses:
        raw_category = expense.category.strip().title() if expense.category else "Other"
        if raw_category in category_totals:
            category_totals[raw_category] += float(expense.amount_spent)
        else:
            category_totals["Other"] += float(expense.amount_spent)

    return category_totals


def generate_expense_graph_png(db: Session, user_id: int, start_date: date, end_date: date) -> bytes | None:
    data = get_aggregated_category_expenses(db, user_id, start_date, end_date)

    x_categories = list(data.keys())
    y_prices = list(data.values())

    fig, ax = plt.subplots(figsize=(8, 5))
    ax.bar(x_categories, y_prices, color="#4F46E5", width=0.55)

    max_price = max(y_prices) if y_prices else 0
    upper_limit = max(3000, math.ceil(max_price / 1000.0) * 1000)
    
    y_ticks = list(range(0, upper_limit + 1000, 1000))
    ax.set_yticks(y_ticks)
    ax.set_ylim(0, upper_limit + 500)

    ax.set_xlabel("Category", fontsize=11, fontweight="bold", labelpad=10)
    ax.set_ylabel("Price", fontsize=11, fontweight="bold", labelpad=10)
    ax.set_title("Monthly Expenses Breakdown", fontsize=13, fontweight="bold", pad=15)

    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.grid(axis="y", linestyle="--", alpha=0.3)

    plt.tight_layout()

    buffer = io.BytesIO()
    
    plt.savefig(buffer, format="png", bbox_inches="tight")
    plt.close(fig)

    buffer.seek(0)
    return buffer.getvalue()