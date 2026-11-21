  
# from fastapi import APIRouter
# from models.schemas import TextRequest, PlagiarismResponse
# from services.plagiarism_api import check_plagiarism

# router = APIRouter()

# @router.post("/", response_model=PlagiarismResponse)
# async def check(req: TextRequest):
#     return await check_plagiarism(req.text)
# from fastapi import APIRouter, HTTPException, Depends
# from fastapi.security import APIKeyHeader
# from fastapi_limiter.depends import RateLimiter
# from models.schemas import TextRequest, PlagiarismResponse
# from services.plagiarism_api import check_plagiarism
# from typing import Dict
# import logging

# logger = logging.getLogger(__name__)
# router = APIRouter()

# API_KEY_NAME = "X-API-KEY"
# api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

# async def validate_api_key(api_key: str = Depends(api_key_header)):
#     """Validate the API key from header"""
#     if not api_key:
#         raise HTTPException(
#             status_code=401,
#             detail="API key is required"
#         )
#     # Add actual key validation logic here
#     return api_key

# # @router.post(
# #     "/detect-ai",
# #     response_model=PlagiarismResponse,
# #     dependencies=[Depends(RateLimiter(times=5, minutes=1))]
# # )
# @router.post(
#     "/detect-ai",
#     response_model=PlagiarismResponse,
#     dependencies=[Depends(RateLimiter(times=5, minutes=1))],
#     # Add these response headers:
#     responses={
#         200: {
#             "description": "Successful Response",
#             "headers": {
#                 "Access-Control-Allow-Origin": "http://localhost:3000"
#             }
#         }
#     }
# )

# async def detect_ai_text(
#     request: TextRequest,
#     api_key: str = Depends(validate_api_key)
# ) -> PlagiarismResponse:
#     """
#     Detect AI-generated text using plagiarism detection services.
    
#     Args:
#         request: TextRequest containing the text to analyze
#         api_key: Valid API key for authentication
        
#     Returns:
#         PlagiarismResponse with analysis results
        
#     Raises:
#         HTTPException: For invalid requests or service errors
#     """
#     try:
#         result = await check_plagiarism(request.text)
#         logger.debug(f"Plagiarism check result for text: {result}")
        
#         return PlagiarismResponse(
#             text=request.text,
#             is_plagiarized=result["is_plagiarized"],
#             score=result["score"],
#             sources=result.get("sources", []),
#             details=result.get("details"),
#             error=result.get("error")
#         )
        
#     except ValueError as e:
#         logger.error(f"Validation error in detect_ai_text: {str(e)}")
#         raise HTTPException(
#             status_code=400,
#             detail=str(e)
#         )
#     except Exception as e:
#         logger.error(f"Error in detect_ai_text: {str(e)}", exc_info=True)
#         raise HTTPException(
#             status_code=500,
#             detail="Internal server error during AI detection"
#         )
from fastapi import APIRouter, HTTPException, Depends
from fastapi_limiter.depends import RateLimiter
from models.schemas import TextRequest, PlagiarismResponse
from services.plagiarism_api import check_plagiarism
from typing import Dict
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post(
    "/detect-ai",
    response_model=PlagiarismResponse,
    dependencies=[Depends(RateLimiter(times=5, minutes=1))],
    responses={
        200: {
            "description": "Successful Response",
            "headers": {
                "Access-Control-Allow-Origin": "http://localhost:3000"
            }
        }
    }
)
async def detect_ai_text(
    request: TextRequest,
) -> PlagiarismResponse:
    """
    Detect AI-generated text using plagiarism detection services.
    
    Args:
        request: TextRequest containing the text to analyze
        
    Returns:
        PlagiarismResponse with analysis results
        
    Raises:
        HTTPException: For invalid requests or service errors
    """
    try:
        result = await check_plagiarism(request.text)
        logger.debug(f"Plagiarism check result for text: {result}")
        
        return PlagiarismResponse(
            text=request.text,
            is_plagiarized=result["is_plagiarized"],
            score=result["score"],
            sources=result.get("sources", []),
            details=result.get("details"),
            error=result.get("error")
        )
        
    except ValueError as e:
        logger.error(f"Validation error in detect_ai_text: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error in detect_ai_text: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Internal server error during AI detection"
        )