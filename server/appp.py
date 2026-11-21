import requests
import json

def test_zerogpt(api_key, text_to_check):
    """
    Teste l'API ZeroGPT avec la structure de requête spécifiée
    
    Args:
        api_key (str): Votre clé API ZeroGPT
        text_to_check (str): Texte à analyser
        
    Returns:
        dict: Réponse de l'API
    """
    url = "https://api.zerogpt.com/api/detect/detectText"
    
    headers = {
        'ApiKey': api_key,
        'Content-Type': 'application/json'
    }
    
    payload = json.dumps({
        "input_text": text_to_check
    })
    
    try:
        response = requests.post(url, headers=headers, data=payload)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {"error": f"API request failed: {str(e)}"}

# Configuration
# API_KEY = "fff2a06b-c95f-43ea-9bd4-624258afef9c"
API_KEY="d5fe7df2-3c69-464c-8e45-7a46d5bddd4f"
TEST_TEXT = """
           Avec l’évolution rapide des technologies numériques et la croissance exponentielle des contenus disponibles sur le web, les systèmes intelligents destinés au traitement et à l'analyse automatique des données textuelles et visuelles deviennent indispensables. Aujourd’hui, les secteurs éducatifs, académiques et professionnels manifestent un besoin accru d’outils fiables permettant d'automatiser des tâches complexes telles que la traduction multilingue, la détection du plagiat ou encore l'analyse de similarité entre des ressources multimédias.
C’est précisément dans ce contexte que se situe notre projet de fin d’études, dont l’objectif principal consiste à concevoir et à développer une application web innovante intégrant trois fonctionnalités majeures : la traduction automatique de textes, la détection intelligente de plagiat au sein de documents scientifiques, et l’analyse de similarité entre images. Ce projet multidisciplinaire combine ainsi les domaines du développement web, du traitement automatique du langage naturel (NLP) et de la vision par ordinateur.
Lors de la réalisation de ce travail, nous avons rencontré divers défis techniques, notamment liés au choix des outils adaptés pour la mise en place des algorithmes d’intelligence artificielle, à l’apprentissage de certaines technologies telles que le framework Flask, les bases de données MongoDB et Elasticsearch, ainsi qu’à l'intégration des APIs modernes d’OpenAI pour la traduction et l’analyse sémantique. Pour répondre à ces exigences, une période significative a été consacrée à l’autoformation et à la documentation approfondie, permettant ainsi de maîtriser efficacement les technologies sélectionnées.
Le présent rapport décrit de manière détaillée toutes les étapes effectuées durant ce projet et s’articule autour de trois chapitres principaux :
	Premier chapitre : Contexte général du projet et spécification des besoins
Ce chapitre présente le cadre général du projet, la problématique traitée et les objectifs de l'application. Il inclut également une présentation approfondie du cahier des charges précisant les fonctionnalités attendues, les caractéristiques techniques et les exigences utilisateurs. Enfin, une partie est consacrée à la gestion et à la planification du projet via des outils et diagrammes spécifiques.
	Deuxième chapitre : Modélisation et conception de l’application
	Ce chapitre décrit la méthodologie adoptée pour la conception de notre système, ainsi que l'utilisation du langage de modélisation UML. Il présente en détail les différents diagrammes réalisés, tels que les diagrammes de cas d’utilisation, de classes et d'activités, facilitant ainsi la compréhension de la structure et des interactions au sein de l'application.

"""

# Exécution du test
result = test_zerogpt(API_KEY, TEST_TEXT)

# Affichage formaté des résultats
print("=== Résultat d'analyse ZeroGPT ===")
print(f"Texte analysé: {TEST_TEXT[:50]}...")  # Affiche les 50 premiers caractères
print("\nRéponse complète de l'API:")
print(json.dumps(result, indent=2))