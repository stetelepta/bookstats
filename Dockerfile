FROM python:3
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
COPY requirements.txt /code/
COPY . /code/
WORKDIR /code/src/bookstats/
RUN pip install -r requirements.txt
CMD python manage.py runserver 0.0.0.0:8000;