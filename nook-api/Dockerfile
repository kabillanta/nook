# Use Python 3.10 slim image (Standard for FastAPI)
FROM python:3.10-slim

# Set working directory inside the container
WORKDIR /app

# Install system dependencies for Postgres (needed for building psycopg2)
RUN apt-get update && apt-get install -y libpq-dev gcc

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app code
COPY . .

# Cloud Run expects the app to listen on the $PORT environment variable
# We use the shell form to allow variable expansion
CMD sh -c "uvicorn main:app --host 0.0.0.0 --port $PORT"