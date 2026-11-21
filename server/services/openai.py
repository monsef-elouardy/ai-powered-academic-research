# # from openai import OpenAI
# # from config import OPENAI_API_KEY

# # client = OpenAI(api_key=OPENAI_API_KEY)

# # async def translate_text(text: str, source_lang: str = "fr", target_lang: str = "en") -> str:
# #     prompt = f"Traduis le texte suivant du {source_lang} vers le {target_lang} :\n\n{text}"

# #     response = client.chat.completions.create(
# #         model="gpt-3.5-turbo",
# #         messages=[{"role": "user", "content": prompt}],
# #         temperature=0.5,
# #         max_tokens=1000,
# #     )
# #     return response.choices[0].message.content.strip()

from openai import OpenAI
from config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

# async def translate_text(text: str, source_lang: str = "fr", target_lang: str = "en") -> str:
#     prompt = f"Traduis le texte suivant du {source_lang} vers le {target_lang} :\n\n{text}"
    
#     if target_lang == "ber":
#         prompt += "\n\nImportant : Retourne uniquement la traduction en alphabet latin, sans commentaires ni notes."

#     response = client.chat.completions.create(
#         model="gpt-3.5-turbo",
#         messages=[{"role": "user", "content": prompt}],
#         temperature=0.5,
#         max_tokens=1000,
#     )
#     translated = response.choices[0].message.content.strip()
    
#     if target_lang == "ber":
#         return {
#             "latin": translated,
#             "tifinagh": convert_to_tifinagh(translated)
#         }
#     return translated


async def translate_text(text: str, source_lang: str = "fr", target_lang: str = "en") -> str:
    prompt = f"Traduis le texte suivant du {source_lang} vers le {target_lang} :\n\n{text}"
    
    if target_lang == "ber":
        prompt += "\n\nImportant : Retourne uniquement la traduction en amazigh marocain (tamazight du Maroc) utilisant l'alphabet latin, sans commentaires ni notes."
        # Ou bien: "en tamazight marocain" selon la terminologie préférée

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.5,
        max_tokens=1000,
    )
    translated = response.choices[0].message.content.strip()
    
    if target_lang == "ber":
        return {
            "latin": translated,
            "tifinagh": convert_to_tifinagh(translated)
        }
    return translated

def convert_to_tifinagh(text: str) -> str:
    tifinagh_map = {
        'a': 'ⴰ', 'b': 'ⴱ', 'c': 'ⵛ', 'd': 'ⴷ', 'e': 'ⴻ',
        'f': 'ⴼ', 'g': 'ⴳ', 'h': 'ⵀ', 'i': 'ⵉ', 'j': 'ⵊ',
        'k': 'ⴽ', 'l': 'ⵍ', 'm': 'ⵎ', 'n': 'ⵏ', 'o': 'ⵓ',
        'p': 'ⵄ', 'q': 'ⵈ', 'r': 'ⵔ', 's': 'ⵙ', 't': 'ⵜ',
        'u': 'ⵓ', 'v': 'ⵖ', 'w': 'ⵡ', 'x': 'ⵅ', 'y': 'ⵢ',
        'z': 'ⵣ'
    }
    return ''.join([tifinagh_map.get(c.lower(), c) for c in text])