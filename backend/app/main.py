from fastapi import FastAPI

app = FastAPI(
    title="Weathrly API",
    description="AI-powered weather backend",
    version="1.0.0"
)

@app.get("/")
def root():
    return {"message": "Weathrly backend is running "}

@app.get("/health")
def health():
    return {"status": "ok"}