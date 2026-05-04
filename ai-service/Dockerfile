# using python 3.11 as base image
FROM python:3.11-slim

# setting working directory
WORKDIR /app

# copying requirements first
COPY requirements.txt .

# installing dependencies
RUN pip install --no-cache-dir -r requirements.txt

# copying all files
COPY . .

# exposing port 5000
EXPOSE 5000

# running the app
CMD ["python", "app.py"]