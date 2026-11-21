# from pydantic import BaseModel

# class TranslationRequest(BaseModel):
#     text: str
#     source_lang: str
#     target_lang: str

# class TranslationResponse(BaseModel):
#     original_text: str
#     translated_text: str

# class TextRequest(BaseModel):
#     text: str

# class PlagiarismResponse(BaseModel):
#     text: str
#     is_plagiarized: bool
#     score: float
#     sources: list

# class SimilarityRequest(BaseModel):
#     text1: str
#     text2: str

# class SimilarityResponse(BaseModel):
#     text1: str
#     text2: str
#     similarity_score: float


from pydantic import BaseModel, Field
from typing import List, Dict, Optional

class TextRequest(BaseModel):
    text: str = Field(..., min_length=100, description="Text content to analyze (minimum 100 characters)")

class PlagiarismResponse(BaseModel):
    text: str = Field(..., description="Original analyzed text")
    is_plagiarized: bool = Field(..., description="Whether the text was detected as plagiarized")
    score: float = Field(..., ge=0, le=100, description="Confidence score (0-100)")
    sources: List[Dict[str, str]] = Field(default_factory=list, description="List of matching sources")
    details: Optional[Dict] = Field(None, description="Additional analysis details")
    error: Optional[str] = Field(None, description="Error message if analysis failed")

class TranslationRequest(BaseModel):
    text: str = Field(..., description="Text to translate")
    source_lang: str = Field(..., min_length=2, max_length=5, description="Source language code")
    target_lang: str = Field(..., min_length=2, max_length=5, description="Target language code")

class TranslationResponse(BaseModel):
    original_text: str = Field(..., description="Original untranslated text")
    translated_text: str = Field(..., description="Translated text")
    source_lang: str = Field(..., description="Source language code")
    target_lang: str = Field(..., description="Target language code")

class SimilarityRequest(BaseModel):
    text1: str = Field(..., description="First text to compare")
    text2: str = Field(..., description="Second text to compare")

class SimilarityResponse(BaseModel):
    text1: str = Field(..., description="First compared text")
    text2: str = Field(..., description="Second compared text")
    similarity_score: float = Field(..., ge=0, le=100, description="Similarity percentage (0-100)")
    details: Optional[Dict] = Field(None, description="Additional comparison details")