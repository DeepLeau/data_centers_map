from huggingface_hub import InferenceClient
import json

from data_centers_map.settings import HUGGING_FACE_KEY


def Energy_cooling(T_ext, P_IT=1.23e6, Delta_t=3600, COP_0=6, beta=-0.05, 
                   T_set=25, k_thermal=50e3):
    """
    Calcule la consommation énergétique du refroidissement en fonction de la température extérieure T_ext.
    """
    T_int = T_ext + (P_IT / k_thermal) * (1 - 1 / COP_0)

    COP = COP_0 + beta * (T_int - T_set)

    E_cooling = P_IT * Delta_t / COP

    return E_cooling / 1e6  


def ThermalEfficiency_score(T_ext, P_IT=1.23e6, Delta_t=3600, COP_0=6, beta=-0.05, 
                            T_set=25, k_thermal=50e3, T_ext_min=-10, T_ext_max=45):
    """
    Calcule le score d’efficacité thermique en fonction de la température extérieure T_ext.
    """
    E_cooling_T = Energy_cooling(T_ext, P_IT, Delta_t, COP_0, beta, T_set, k_thermal)

    E_cooling_min = Energy_cooling(T_ext_min, P_IT, Delta_t, COP_0, beta, T_set, k_thermal)
    E_cooling_max = Energy_cooling(T_ext_max, P_IT, Delta_t, COP_0, beta, T_set, k_thermal)

    S = 100 * (1 - (E_cooling_T - E_cooling_min) / (E_cooling_max - E_cooling_min))

    return round(S, 2)  

def get_criteria_scores(query):
    client = InferenceClient(provider="hf-inference", api_key=HUGGING_FACE_KEY)

    messages = [
        {
            "role": "user",
            "content": (
                f"Evaluate the following prompt to extract and score three metrics: energy, network proximity, and environment. "
                f"Assign each metric a score from 0 to 100. Provide the results in a JSON file and nothing else. Prompt: {query}"
            )
        }
    ]

    completion = client.chat.completions.create(
        model="mistralai/Mistral-Nemo-Instruct-2407",
        messages=messages,
        max_tokens=500,
    )

    generated_text = completion.choices[0].message['content']

    try:
        scores_dict = json.loads(generated_text)
        scores_list = [
            scores_dict.get('energy', 0),
            scores_dict.get('network_proximity', 0),
            scores_dict.get('environment', 0)
        ]

        print(f"Energy: {scores_list[0]}")
        print(f"Network Proximity: {scores_list[1]}")
        print(f"Environment: {scores_list[2]}")

        return scores_list
    except json.JSONDecodeError:
        print("Erreur : Le texte n'est pas un JSON valide.")