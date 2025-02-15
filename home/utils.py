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
