  
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

async def compare_texts(text1: str, text2: str):
    vectors = model.encode([text1, text2])
    score = cosine_similarity([vectors[0]], [vectors[1]])[0][0]

    return {
        "text1": text1,
        "text2": text2,
        "similarity_score": round(score, 3)
    }
