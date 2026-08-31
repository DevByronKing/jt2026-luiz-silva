"""
Pipeline de Engenharia e Tratamento de Dados (Seazone OS)
Carrega, trata, higieniza e cruza as bases do Airbnb e VivaReal de Itapema (SC).
"""

import os
import pandas as pd
import numpy as np

def resolve_data_directory(candidate_paths=None):
    """
    Localiza o diretório que contém os arquivos CSV do desafio.
    """
    if candidate_paths is None:
        candidate_paths = ['data', '../data', 'Data', '../Data', '../../data', '../../Data']
    
    required_files = [
        'Details_Itapema.csv',
        'Hosts_ids_Itapema.csv',
        'Mesh_Ids_Data_Itapema.csv',
        'Price_AV_Itapema.csv',
        'VivaReal_Itapema.csv'
    ]
    
    for path in candidate_paths:
        if os.path.isdir(path):
            all_present = all(os.path.isfile(os.path.join(path, f)) for f in required_files)
            if all_present:
                return os.path.abspath(path)
                
    raise FileNotFoundError(
        f"Não foi possível encontrar a pasta de dados contendo todos os 5 CSVs. Verifique caminhos: {candidate_paths}"
    )

def clean_and_merge_data(data_dir=None):
    """
    Executa a carga, deduplicação e cruzamento geoespacial dos dados de Itapema.
    Retorna: (airbnb_df, vivareal_clean_df)
    """
    if data_dir is None:
        data_dir = resolve_data_directory()
    
    print(f"[Pipeline] Carregando datasets a partir de '{data_dir}'...")
    details = pd.read_csv(os.path.join(data_dir, 'Details_Itapema.csv'))
    hosts = pd.read_csv(os.path.join(data_dir, 'Hosts_ids_Itapema.csv'))
    mesh = pd.read_csv(os.path.join(data_dir, 'Mesh_Ids_Data_Itapema.csv'))
    price_av = pd.read_csv(os.path.join(data_dir, 'Price_AV_Itapema.csv'))
    vivareal = pd.read_csv(os.path.join(data_dir, 'VivaReal_Itapema.csv'))

    # 1. Deduplicação e limpeza de diárias de Price_AV
    print("[Pipeline] Deduplicando calendário de preços por anúncio e data de estadia...")
    price_dedup = price_av.sort_values('aquisition_date').groupby(['airbnb_listing_id', 'date']).last().reset_index()
    # Filtro de limites realistas de diárias em Itapema (R$ 80 a R$ 15.000)
    price_clean = price_dedup[(price_dedup['price'] >= 80) & (price_dedup['price'] <= 15000)].copy()

    listing_prices = price_clean.groupby('airbnb_listing_id').agg(
        adr_mean=('price', 'mean'),
        adr_median=('price', 'median'),
        adr_p25=('price', lambda x: x.quantile(0.25)),
        adr_p75=('price', lambda x: x.quantile(0.75)),
        calendar_days=('date', 'count')
    ).reset_index()

    # 2. Merge geoespacial e dados de anfitrião
    print("[Pipeline] Cruzando metadados geoespaciais (Mesh) e perfil de anfitriões...")
    airbnb = details.merge(
        mesh[['airbnb_listing_id', 'latitude', 'longitude', 'suburb']].rename(
            columns={'latitude': 'lat_mesh', 'longitude': 'long_mesh'}
        ),
        on='airbnb_listing_id',
        how='left'
    )
    hosts_latest = hosts.sort_values('host_snapshot_date').groupby('owner_id').last().reset_index()
    airbnb = airbnb.merge(hosts_latest, on='owner_id', how='left')
    airbnb = airbnb.merge(listing_prices, on='airbnb_listing_id', how='left')

    # 3. Limpeza VivaReal
    print("[Pipeline] Higienizando dados de venda do VivaReal...")
    vr = vivareal.copy()
    vr['price_m2'] = vr['sale_price'] / vr['usable_area'].replace(0, np.nan)
    
    vr_clean = vr[
        (vr['sale_price'] >= 150000) & 
        (vr['sale_price'] <= 25000000) &
        (vr['usable_area'] >= 18) &
        (vr['usable_area'] <= 800) &
        (vr['price_m2'] >= 3000) &
        (vr['price_m2'] <= 50000) &
        (vr['bedrooms'] >= 0) &
        (vr['bedrooms'] <= 5)
    ].copy()

    def map_suburb(sub):
        if pd.isna(sub): return 'Outros'
        s = str(sub).strip()
        if s in ['Meia Praia', 'Castelo Branco', 'Andorinha', 'Jardim Praia Mar']:
            return 'Meia Praia'
        elif s in ['Centro', 'Centro de Itapema']:
            return 'Centro'
        elif s in ['Morretes', 'Jardim Morretes']:
            return 'Morretes'
        elif s in ['Canto da Praia']:
            return 'Canto da Praia'
        elif s in ['Tabuleiro dos Oliveiras', 'Tabuleiro']:
            return 'Tabuleiro dos Oliveiras'
        return s

    vr_clean['suburb_standard'] = vr_clean['suburb'].apply(map_suburb)
    print(f"[Pipeline] Concluído: {len(airbnb)} anúncios Airbnb | {len(vr_clean)} imóveis à venda VivaReal.")
    return airbnb, vr_clean

if __name__ == '__main__':
    clean_and_merge_data()
