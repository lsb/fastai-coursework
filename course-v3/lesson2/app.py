from fastai.vision import *
from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import io

defaults.device = torch.device('cpu')
learn = load_learner(Path('.'))
def predictions(img):
    return {k: v for (k,v) in zip(learn.data.classes, [float(x) for x in learn.predict(img)[-1]])}

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"app-name": "art-text-plant"}

@app.get("/health")
def read_health():
    return {"status": "hale and hearty and limber and spry"}

@app.post("/identify")
async def read_identify(image: UploadFile = File(...)):
    img = open_image(image.file)
    return predictions(img)