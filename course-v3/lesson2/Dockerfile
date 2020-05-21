FROM pytorch/pytorch:1.4-cuda10.1-cudnn7-runtime
RUN conda install -c fastai fastai
RUN pip install fastapi uvicorn python-multipart
WORKDIR /app
COPY export.pkl .
COPY app.py .
# CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7777"]
CMD ["uvicorn", "app:app", "--host", "127.0.0.1", "--port", "7777"]
