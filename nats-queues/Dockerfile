# set base image (host OS)
FROM python:3.8

RUN apt update

RUN mkdir /code
COPY . /code

# set the working directory in the container
WORKDIR /code

# copy the dependencies file to the working directory
COPY requirements.txt .

# install dependencies
RUN pip install -r requirements.txt

CMD ["python", "-u", "server.py"]
