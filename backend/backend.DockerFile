FROM python:3.11-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8080
CMD [ "python3", "backend/manage.py",  "runserver", "0.0.0.0:8080"]