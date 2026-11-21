# from fastapi import FastAPI, Request
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.exceptions import RequestValidationError
# from fastapi.responses import JSONResponse
# from routes.translate import router as translate_router
# from routes.plagiarism import router as plagiarism_router
# from routes.similarity import router as similarity_router
# import logging
# import json
# import os
# os.environ['KMP_DUPLICATE_LIB_OK'] = 'True'

# # Configuration du logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# app = FastAPI(
#     title="API d'Analyse de Similarité",
#     description="API pour l'analyse de similarité textuelle et visuelle",
#     version="1.0.0"
# )

# # CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Improved error handler
# @app.exception_handler(RequestValidationError)
# async def validation_exception_handler(request: Request, exc: RequestValidationError):
#     return JSONResponse(
#         status_code=422,
#         content={
#             "detail": exc.errors(),
#             "body": exc.body
#         },
#     )

# @app.exception_handler(Exception)
# async def general_exception_handler(request: Request, exc: Exception):
#     return JSONResponse(
#         status_code=500,
#         content={
#             "detail": str(exc),
#             "type": exc.__class__.__name__
#         },
#     )

# # Routes
# app.include_router(translate_router, prefix="/api")
# app.include_router(plagiarism_router, prefix="/api")
# app.include_router(similarity_router, prefix="/api")

# @app.get("/")
# async def root():
#     return {"message": "API d'analyse de similarité fonctionnelle"}

# @app.get("/health")
# async def health_check():
#     return {"status": "healthy"}

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(
#         app, 
#         host="0.0.0.0", 
#         port=8000,
#         reload=True,
#         log_level="info"
#     )
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from routes.translate import router as translate_router
from routes.plagiarism import router as plagiarism_router
from routes.similarity import router as similarity_router
from pydantic import BaseModel
from typing import Optional
from services.plagiarism_api import check_plagiarism
import logging
import os

os.environ['KMP_DUPLICATE_LIB_OK'] = 'True'

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="API TSP",
    description="API de backend application : traduction , détecter plagiat , analyse de similarité ",
    version="1.0.0"
)

# CORS Configuration (déjà correcte)
app.add_middleware(
    CORSMiddleware,
    # allow_origins=["*"],  
    allow_origins=["http://localhost:3000"],
    # Ou spécifiez ["http://localhost:3000"] pour plus de sécurité
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gestion des erreurs
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "detail": exc.errors(),
            "body": exc.body
        },
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "detail": str(exc),
            "type": exc.__class__.__name__
        },
    )

class AIDetectionRequest(BaseModel):
    text: str

@app.post("/api/detect-ai")
async def detect_ai(request: AIDetectionRequest):
    try:
        # Appel à la fonction de détection de plagiat
        result = await check_plagiarism(request.text)
        
        if "error" in result:
            return JSONResponse(
                status_code=400,
                content={"error": result["error"]}
            )
        
        return {
            "score": result["score"],
            "human_score": result["human_score"],
            "is_plagiarized": result["is_plagiarized"],
            "details": result["details"],
            "sources": result.get("sources", [])
        }
        
    except Exception as e:
        logging.error(f"Error in AI detection: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": "Internal server error"}
        )

# Routes
app.include_router(translate_router, prefix="/api")
app.include_router(plagiarism_router, prefix="/api")
app.include_router(similarity_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "API d'analyse de similarité fonctionnelle"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000,
        reload=True,
        log_level="info"
    )