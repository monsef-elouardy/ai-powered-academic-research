from fastapi import APIRouter, HTTPException, UploadFile, File, Form, status
from fastapi.responses import JSONResponse
from typing import Optional
import requests
import os
import base64
from io import BytesIO
from PIL import Image
import logging
import pyimgur
from pydantic import BaseModel
from dotenv import load_dotenv
import tempfile
import json

# Charger les variables d'environnement
load_dotenv()

router = APIRouter()

# Configuration
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"]
TIMEOUT = 10  # Timeout pour les requêtes API

# API Keys
SERPAPI_API_KEY = os.getenv("SERPAPI_API_KEY")
IMGUR_CLIENT_ID = os.getenv("IMGUR_CLIENT_ID")

class SearchRequest(BaseModel):
    query: Optional[str] = None
    imageUrl: Optional[str] = None
    image_data: Optional[str] = None

@router.post(
    "/similarity",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    responses={
        400: {"description": "Invalid input"},
        404: {"description": "No results found"},
        500: {"description": "Internal server error"},
        502: {"description": "API service error"},
    },
)
async def similarity_search(
    query: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    imageUrl: Optional[str] = Form(None),
    image_data: Optional[str] = Form(None),
):
    try:
        # Validation des entrées
        if not query and not image and not imageUrl and not image_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Please provide either text query or image",
            )

        results = []
        search_type = "text"

        # Recherche par image
        if image or imageUrl or image_data:
            search_type = "image"
            img_url = None

            if image:
                if image.content_type not in ALLOWED_IMAGE_TYPES:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Only JPEG and PNG images are allowed",
                    )

                contents = await image.read()
                if len(contents) > MAX_IMAGE_SIZE:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Image too large. Max size: {MAX_IMAGE_SIZE/1024/1024}MB",
                    )

                image_data = f"data:{image.content_type};base64,{base64.b64encode(contents).decode()}"
                img_url = await process_image_upload(image_data)

            elif image_data:
                img_url = await process_image_upload(image_data)

            elif imageUrl:
                if not imageUrl.startswith(("http://", "https://")):
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Image URL must start with http:// or https://",
                    )
                img_url = imageUrl

            if img_url:
                results = await search_google_lens(img_url)

        # Recherche par texte
        if (search_type == "text" and query) or (not results and query):
            results = await search_google_images(query)

        if not results:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No results found",
            )

        return {
            "query": query if query else "Image search",
            "results": results,
            "stats": {
                "totalResults": len(results),
                "averageSimilarity": calculate_similarity_score(results),
            },
        }

    except HTTPException as he:
        raise he
    except requests.exceptions.RequestException as re:
        logging.error(f"API request error: {str(re)}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="External service error",
        )
    except Exception as e:
        logging.error(f"Server error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )

async def process_image_upload(image_data: str) -> str:
    try:
        # Extraction des données base64
        if "," in image_data:
            image_base64 = image_data.split(",")[1]
        else:
            image_base64 = image_data

        image_bytes = base64.b64decode(image_base64)
        
        # Vérification que c'est bien une image
        try:
            Image.open(BytesIO(image_bytes)).verify()
        except Exception:
            raise ValueError("Invalid image data")

        # Création d'un fichier temporaire
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as temp_file:
            temp_path = temp_file.name

        try:
            # Sauvegarde de l'image
            image = Image.open(BytesIO(image_bytes)).convert("RGB")
            image.save(temp_path, "JPEG", quality=85)
            
            # Upload sur Imgur
            imgur = pyimgur.Imgur(IMGUR_CLIENT_ID)
            uploaded_image = imgur.upload_image(temp_path, title="Image Search")
            return uploaded_image.link
        finally:
            # Nettoyage du fichier temporaire
            if os.path.exists(temp_path):
                try:
                    os.unlink(temp_path)
                except PermissionError:
                    logging.warning(f"Could not delete temp file {temp_path}")

    except Exception as e:
        logging.error(f"Image processing error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image processing failed",
        )

async def search_google_lens(image_url: str) -> list:
    params = {
        "engine": "google_lens",
        "url": image_url,
        "api_key": SERPAPI_API_KEY,
    }

    try:
        response = requests.get(
            "https://serpapi.com/search",
            params=params,
            timeout=TIMEOUT,
        )
        response.raise_for_status()
        data = response.json()

        return [
            {
                "image_url": item.get("thumbnail"),
                "title": item.get("title", "Similar image"),
                "url": item.get("link", "#"),
                "type": "image",
                "similarity": float(item.get("score", 0.8)),
            }
            for item in data.get("visual_matches", [])[:20]
        ]

    except Exception as e:
        logging.error(f"Google Lens API error: {str(e)}")
        return []

async def search_google_images(query: str) -> list:
    params = {
        "engine": "google_images",
        "q": query,
        "hl": "fr",
        "gl": "fr",
        "api_key": SERPAPI_API_KEY,
        "num": 20,
    }

    try:
        response = requests.get(
            "https://serpapi.com/search",
            params=params,
            timeout=TIMEOUT,
        )
        response.raise_for_status()
        data = response.json()

        return [
            {
                "image_url": item.get("thumbnail"),
                "title": item.get("title", query),
                "url": item.get("original") or item.get("link") or "#",
                "type": "image",
                "similarity": 0.9,
            }
            for item in data.get("images_results", [])
        ]

    except Exception as e:
        logging.error(f"Google Images API error: {str(e)}")
        return []

def calculate_similarity_score(results: list) -> float:
    if not results:
        return 0.0
    
    scores = [item.get("similarity", 0.8) for item in results]
    return round(sum(scores) / len(scores), 2)