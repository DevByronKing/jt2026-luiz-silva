"""
Orquestrador de Geracao de Payload de Investimento (Seazone OS)
Executa a ingestao, tratamento e modelagem financeira quantitativa.
Exporta o payload para a raiz e para o frontend.
"""

import os
import sys
import json
import argparse
from data_pipeline import clean_and_merge_data
from financial_model import build_investment_payload

# Assegura que saidas no terminal usem UTF-8 quando suportado
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def run_payload_generation(data_dir=None, output_files=None):
    """
    Executa todo o pipeline e salva o payload JSON nos destinos especificados.
    """
    if output_files is None:
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        output_files = [
            os.path.join(base_dir, 'seazone_engine_payload.json'),
            os.path.join(base_dir, 'frontend', 'src', 'seazone_engine_payload.json')
        ]

    print("=" * 75)
    print("[Seazone Engine] SEAZONE QUANTITATIVE INVESTMENT ENGINE - ITAPEMA (SC)")
    print("=" * 75)

    # 1. Pipeline de Dados
    airbnb, vr_clean = clean_and_merge_data(data_dir)

    # 2. Modelo Financeiro
    print("[Quant Engine] Processando matriz de viabilidade e curvas de sensibilidade...")
    payload = build_investment_payload(airbnb, vr_clean)

    # 3. Exportacao do JSON
    for out_path in output_files:
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(payload, f, indent=2, ensure_ascii=False)
        print(f"[Export] Payload salvo em: '{out_path}'")

    print("\n" + "=" * 75)
    print("[Resumo] RESUMO DOS ATIVOS MODELADOS (Baseline 55% Ocupacao)")
    print("=" * 75)
    print(f"{'Ativo':<35} | {'Preco Compra':<14} | {'ADR':<8} | {'Gross Cap':<10} | {'Net Cap':<10}")
    print("-" * 88)
    for asset in payload['thesis_duel_assets']:
        b = asset['baseline_55pct_occupancy']
        price = f"R$ {asset['market_data']['median_sale_price']:,.0f}".replace(',', '.')
        adr = f"R$ {asset['rental_pricing']['median_adr']:.0f}"
        g_cap = f"{b['gross_cap_rate_pct']:.2f}%"
        n_cap = f"{b['net_cap_rate_pct']:.2f}%"
        print(f"{asset['label']:<35} | {price:<14} | {adr:<8} | {g_cap:<10} | {n_cap:<10}")
    print("=" * 75)

    return payload

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Seazone Investment Engine Payload Generator')
    parser.add_argument('--data-dir', type=str, default=None, help='Caminho para a pasta com os CSVs')
    args = parser.parse_args()
    
    run_payload_generation(data_dir=args.data_dir)
