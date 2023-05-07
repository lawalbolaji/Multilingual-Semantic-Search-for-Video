FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

RUN apt-get update && apt-get install -y \
    build-essential \
    software-properties-common \
    ffmpeg

COPY . .

EXPOSE 3100

ENTRYPOINT ["uvicorn", "src.server:app", "--reload", "--port=3100", "--host=0.0.0.0"]
