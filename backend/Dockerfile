FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# requirements.txt: FastAPI, uvicorn, DSPy, SQLAlchemy, psycopg2-binary, Alembic, etc.
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

COPY app ./app

EXPOSE 501

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "501"]
