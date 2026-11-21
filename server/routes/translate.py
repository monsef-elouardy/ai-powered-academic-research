# from fastapi import APIRouter
# from pydantic import BaseModel
# from services.openai import translate_text

# router = APIRouter()

# class TranslationRequest(BaseModel):
#     text: str
#     source_lang: str
#     target_lang: str

# @router.post("/translate")
# async def translate(req: TranslationRequest):
#     try:
#         translated = await translate_text(req.text, req.source_lang, req.target_lang)
#         return {"translated_text": translated}
#     except Exception as e:
#         return {"error": str(e)}, 500
from fastapi import APIRouter
from pydantic import BaseModel
from services.openai import translate_text

router = APIRouter()

class TranslationRequest(BaseModel):
    text: str
    source_lang: str
    target_lang: str

@router.post("/translate")
async def translate(req: TranslationRequest):
    try:
        result = await translate_text(req.text, req.source_lang, req.target_lang)
        if req.target_lang == "ber":
            return {
                "translated_text": result["latin"],
                "tifinagh": result["tifinagh"]
            }
        return {"translated_text": result}
    except Exception as e:
        return {"error": str(e)}, 500