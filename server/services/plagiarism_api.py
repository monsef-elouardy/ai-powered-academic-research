# # Fictif – à adapter selon l'API réelle
# async def check_plagiarism(text: str):
#     # Simuler une vérification
#     return {
#         "text": text,
#         "is_plagiarized": False,
#         "score": 12,
#         "sources": []
#     }

# import requests
# import json
# from typing import Dict, Any

# ZEROGPT_API_KEY = "fff2a06b-c95f-43ea-9bd4-624258afef9c"

# async def check_plagiarism(text: str) -> Dict[str, Any]:
#     """Vérifie le plagiat en utilisant l'API ZeroGPT"""
#     print(f"Texte reçu pour analyse: {text[:200]}...")  # Affiche les 200 premiers caractères
    
#     if not text or len(text) < 100:
#         return {
#             "error": "Le texte doit contenir au moins 100 caractères",
#             "is_plagiarized": False,
#             "score": 0,
#             "human_score": 100
#         }

#     url = "https://api.zerogpt.com/api/detect/detectText"
    
#     headers = {
#         'ApiKey': ZEROGPT_API_KEY,
#         'Content-Type': 'application/json'
#     }
    
#     payload = json.dumps({
#         "input_text": text[:5000]  # Limite à 5000 caractères
#     })
    
#     try:
#         print("Envoi à l'API ZeroGPT...")
#         response = requests.post(url, headers=headers, data=payload, timeout=10)
#         response.raise_for_status()
#         data = response.json()
#         print(f"Réponse de ZeroGPT: {data}")
        
#         ai_score = float(data.get('fakePercentage', 0))
#         human_score = 100 - ai_score
#         is_ai = ai_score > 50  # Seuil à 50%
        
#         return {
#             "text": text,
#             "is_plagiarized": is_ai,
#             "score": ai_score,
#             "human_score": human_score,
#             "details": data,
#             "sources": []  # ZeroGPT ne fournit pas de sources
#         }
        
#     except requests.exceptions.RequestException as e:
#         print(f"Erreur API ZeroGPT: {str(e)}")
#         return {
#             "error": f"Erreur API: {str(e)}",
#             "is_plagiarized": False,
#             "score": 0,
#             "human_score": 100
#         }

import requests
import json
import logging
from typing import Dict, Any

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ZEROGPT_API_KEY = "fff2a06b-c95f-43ea-9bd4-624258afef9c"

async def check_plagiarism(text: str, threshold: float = 50.0) -> Dict[str, Any]:
    """Vérifie le plagiat avec l'API ZeroGPT en utilisant un seuil personnalisé."""
    if not text or len(text) < 100:
        error_msg = "Le texte doit contenir au moins 100 caractères."
        logger.error(error_msg)
        return {
            "error": error_msg,
            "is_plagiarized": False,
            "score": 0,
            "human_score": 100
        }

    url = "https://api.zerogpt.com/api/detect/detectText"
    headers = {"ApiKey": ZEROGPT_API_KEY, "Content-Type": "application/json"}
    payload = json.dumps({"input_text": text[:5000]})

    try:
        response = requests.post(url, headers=headers, data=payload, timeout=10)
        response.raise_for_status()
        data = response.json()

        ai_score = float(data.get("data", {}).get("fakePercentage", 0))
        feedback = data.get("data", {}).get("feedback", "")
        is_ai = (ai_score > threshold) or ("AI/GPT" in feedback)

        logger.info(f"Résultat : Score IA={ai_score}%, Feedback='{feedback}'")
        
        return {
            "text": text,
            "is_plagiarized": is_ai,
            "score": ai_score,
            "human_score": 100 - ai_score,
            "feedback": feedback,
            "details": data,
            "sources": []
        }

    except requests.exceptions.RequestException as e:
        logger.error(f"Erreur API ZeroGPT: {str(e)}")
        return {
            "error": f"Erreur API: {str(e)}",
            "is_plagiarized": False,
            "score": 0,
            "human_score": 100
        }