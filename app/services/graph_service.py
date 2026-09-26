import io
import math
from datetime import date
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from sqlalchemy.orm import Session
from ..repositories import graph_repository,user_repository

STANDARD_CATEGORIES = ["Food", "Lifestyle", "Medical", "Vehicle", "Other"]

def get_aggregated_category_expenses(db: Session, user_id: int, start_date: date, end_date: date) -> dict[str, float]:
    expenses = graph_repository.get_user_expenses_by_date(db, user_id, start_date, end_date)
    if not expenses:
        return None
    
    category_totals = {cat: 0.0 for cat in STANDARD_CATEGORIES}

    for expense in expenses:
        raw_category = expense.category.strip().title() if expense.category else "Other"
        if raw_category in category_totals:
            category_totals[raw_category] += float(expense.amount_spent)
        else:
            category_totals["Other"] += float(expense.amount_spent)

    return category_totals


def _generate_progress_suggestion(data: dict[str, float]) -> str:
    
    total_spent = sum(data.values())
    if total_spent == 0:
        return "Progress Suggestion: No expenses recorded during this timeframe."

    top_category = max(data, key=data.get)
    top_amount = data[top_category]
    percentage = (top_amount / total_spent) * 100

    if top_category in ["Food", "Lifestyle"] and percentage > 40:
        return f"Progress Suggestion: '{top_category}' accounts for {percentage:.1f}% (₹{top_amount:,.2f}) of total spend. Consider capping non-essential orders to boost savings."
    
    elif top_category == "Vehicle" and percentage > 35:
        return f"Progress Suggestion: High transport costs detected ({percentage:.1f}% of total). Check fuel/maintenance logs to optimize travel expenses."
    
    elif top_category == "Medical":
        return f"Progress Suggestion: Essential medical expenses were your primary outlay ({percentage:.1f}%). Ensure health buffer funds are maintained."
    
    else:
        return f"Progress Suggestion: Highest expenditure was '{top_category}' (₹{top_amount:,.2f}, {percentage:.1f}% of total). Maintain balanced allocation next month."


def _build_matplotlib_figure( data: dict[str, float], user_id: int, user_name: str, start_date: date, end_date: date, include_footer: bool = False):

    x_categories = list(data.keys())
    y_prices = list(data.values())

    fig_height = 6.2 if include_footer else 5.0
    fig, ax = plt.subplots(figsize=(8, fig_height))
    
    ax.bar(x_categories, y_prices, color="#4F46E5", width=0.55)

    max_price = max(y_prices) if y_prices else 0
    upper_limit = max(3000, math.ceil(max_price / 1000.0) * 1000)
    
    y_ticks = list(range(0, upper_limit + 1000, 1000))
    ax.set_yticks(y_ticks)
    ax.set_ylim(0, upper_limit + 500)

    ax.set_xlabel("Category", fontsize=11, fontweight="bold", labelpad=10)
    ax.set_ylabel("Price (INR)", fontsize=11, fontweight="bold", labelpad=10)
    ax.set_title("Monthly Expenses Breakdown", fontsize=14, fontweight="bold", pad=15)

    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.grid(axis="y", linestyle="--", alpha=0.3)

    if include_footer:
        suggestion = _generate_progress_suggestion(data)
        commentary_text = (
            f"📌 User Details : {user_name} (ID: #{user_id})  |  Period: {start_date} to {end_date}\n"
            f"💡 Suggestion   : {suggestion}"
        )

        fig.text(
            0.5, 0.02, commentary_text,
            fontsize=9.5, color="#1F2937",
            horizontalalignment="center",
            multialignment="left",
            verticalalignment="bottom",
            bbox=dict(boxstyle="round,pad=0.7", facecolor="#F3F4F6", edgecolor="#D1D5DB", lw=1)
        )
        plt.tight_layout(rect=[0, 0.18, 1, 1])
    else:
        plt.tight_layout()

    return fig


def _get_user_name(db: Session, user_id: int) -> str:

    get_user_fn = (
        getattr(user_repository, "get_user_by_id", None)
        or getattr(user_repository, "get_user", None)
        or getattr(user_repository, "get_by_id", None)
    )

    if get_user_fn:
        try:
            user = get_user_fn(db, user_id)
            if user:
                return (
                    getattr(user, "full_name", None)
                    or getattr(user, "username", None)
                    or getattr(user, "name", None)
                    or f"User_{user_id}"
                )
        except Exception:
            pass

    return f"User_{user_id}"


def generate_expense_graph_png(db:Session, user_id:int, start_date:date, end_date:date) -> bytes | None:
    data = get_aggregated_category_expenses(db, user_id, start_date, end_date)
    if data is None:
        return None

    user_name = _get_user_name(db, user_id)
    fig = _build_matplotlib_figure(data, user_id, user_name, start_date, end_date, include_footer=False)
    buffer = io.BytesIO()
    fig.savefig(buffer, format="png", bbox_inches="tight")
    plt.close(fig)

    buffer.seek(0)
    return buffer.getvalue()


def generate_expense_graph_pdf(db:Session, user_id:int, start_date:date, end_date:date) -> bytes | None:
    data = get_aggregated_category_expenses(db, user_id, start_date, end_date)
    if data is None:
            return None

    user_name = _get_user_name(db, user_id)
    fig = _build_matplotlib_figure(data, user_id, user_name, start_date, end_date, include_footer=True)
    buffer = io.BytesIO()
    fig.savefig(buffer, format="pdf", bbox_inches="tight")
    plt.close(fig)

    buffer.seek(0)
    return buffer.getvalue()