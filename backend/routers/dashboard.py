from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import date

from database import get_db
import models
import schemas
import auth

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/summary", response_model=schemas.DashboardSummary)
def get_summary(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    today = date.today()

    base_query = db.query(models.Entry).filter(
        models.Entry.user_id == current_user.id,
        extract("year", models.Entry.date) == today.year,
        extract("month", models.Entry.date) == today.month,
    )

    month_total = db.query(func.sum(models.Entry.amount)).filter(
        models.Entry.user_id == current_user.id,
        extract("year", models.Entry.date) == today.year,
        extract("month", models.Entry.date) == today.month,
    ).scalar() or 0.0

    category_totals = (
        db.query(models.Entry.category, func.sum(models.Entry.amount).label("total"))
        .filter(
            models.Entry.user_id == current_user.id,
            extract("year", models.Entry.date) == today.year,
            extract("month", models.Entry.date) == today.month,
        )
        .group_by(models.Entry.category)
        .all()
    )

    return {
        "month_total": month_total,
        "by_category": [
            {"category": category, "total": total}
            for category, total in category_totals
        ]
    }