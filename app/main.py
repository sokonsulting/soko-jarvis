from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI(
    title="SOKO JARVIS",
    version="0.2.0"
)

@app.get("/health")
def health():
    return {
        "status": "online",
        "assistant": "SOKO JARVIS",
        "version": "0.2.0"
    }

app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
