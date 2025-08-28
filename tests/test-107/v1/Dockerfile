FROM ubuntu:18.04
RUN apt-get update && apt-get install -y \
    python3 python3-pip \
    libxml2=2.9.4* libxslt1.1=1.1.29* \
    libxml2-dev libxslt1-dev
RUN pip3 install --upgrade pip setuptools wheel
RUN pip3 install 'markupsafe==2.0.1' 'lxml==4.3.0' flask
COPY app.py /app.py
CMD ["python3", "/app.py"]