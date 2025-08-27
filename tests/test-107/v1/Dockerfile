FROM python:3.11-slim

WORKDIR /app
COPY app.py /app/app.py

# Install Flask
RUN pip install flask lxml

EXPOSE 80

CMD ["python", "app.py"]