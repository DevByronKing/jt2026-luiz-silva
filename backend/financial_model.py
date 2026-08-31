"""
Modelagem Quantitativa de Investimentos Imobiliários (Seazone OS)
Calcula Cap Rate, NOI, Curva de Sensibilidade e Scores de Decisão.
"""

import numpy as np
import pandas as pd

def build_investment_payload(airbnb_df, vr_clean_df, seazone_fee_pct=0.20):
    """
    Executa a modelagem quantitativa financeira sobre os ativos comparados.
    """
    target_combinations = [
        {'suburb': 'Centro', 'bedrooms': 1, 'label': 'Centro (1 Quarto / Compacto)', 'thesis_role': 'Tese Preliminar (Desafiante)'},
        {'suburb': 'Centro', 'bedrooms': 2, 'label': 'Centro (2 Quartos)', 'thesis_role': 'Vencedor Equilibrado (Yield + Liquidez)'},
        {'suburb': 'Morretes', 'bedrooms': 1, 'label': 'Morretes (1 Quarto / Compacto)', 'thesis_role': 'Entrada Low Ticket / Alto Yield'},
        {'suburb': 'Morretes', 'bedrooms': 2, 'label': 'Morretes (2 Quartos)', 'thesis_role': 'Campeão de Yield Puro'},
        {'suburb': 'Meia Praia', 'bedrooms': 2, 'label': 'Meia Praia (2 Quartos)', 'thesis_role': 'Mercado Consolidado / Alta Demanda'},
        {'suburb': 'Meia Praia', 'bedrooms': 3, 'label': 'Meia Praia (3 Quartos)', 'thesis_role': 'Volume Tradicional Familiar'}
    ]

    occupancy_range = [round(x, 2) for x in np.arange(0.35, 0.76, 0.05)]
    thesis_duel_assets = []

    for combo in target_combinations:
        sub = combo['suburb']
        beds = combo['bedrooms']

        # Métricas de Aquisição (VivaReal)
        vr_subset = vr_clean_df[(vr_clean_df['suburb_standard'] == sub) & (vr_clean_df['bedrooms'] == beds)]
        median_sale_price = float(vr_subset['sale_price'].median()) if len(vr_subset) > 0 else 0.0
        median_price_m2 = float(vr_subset['price_m2'].median()) if len(vr_subset) > 0 else 0.0
        median_area = float(vr_subset['usable_area'].median()) if len(vr_subset) > 0 else 0.0
        offer_count = int(len(vr_subset))

        # Custos Fixos Anuais (Condomínio + IPTU + 0.5% reserva de manutenção)
        median_monthly_condo = float(vr_subset['monthly_condo_fee'].dropna().median()) if len(vr_subset['monthly_condo_fee'].dropna()) > 0 else 450.0
        if np.isnan(median_monthly_condo) or median_monthly_condo <= 0:
            median_monthly_condo = 450.0
        median_yearly_iptu = float(vr_subset['yearly_iptu'].dropna().median()) if len(vr_subset['yearly_iptu'].dropna()) > 0 else 1200.0
        if np.isnan(median_yearly_iptu) or median_yearly_iptu <= 0:
            median_yearly_iptu = 1200.0

        annual_fixed_costs = (median_monthly_condo * 12) + median_yearly_iptu + (median_sale_price * 0.005)

        # Métricas de Aluguel de Curta Temporada (Airbnb)
        ab_subset = airbnb_df[(airbnb_df['suburb'] == sub) & (airbnb_df['number_of_bedrooms'] == beds)]
        total_listings = int(len(ab_subset))
        reviewed_listings = int((ab_subset['number_of_reviews'] > 0).sum())
        liquidity_conversion_rate = round(float((reviewed_listings / total_listings) * 100), 1) if total_listings > 0 else 0.0
        avg_reviews = round(float(ab_subset['number_of_reviews'].mean()), 1) if total_listings > 0 else 0.0

        priced_ab = ab_subset[ab_subset['adr_median'].notna()]
        median_adr = float(priced_ab['adr_median'].median()) if len(priced_ab) > 0 else 400.0

        # Curva de Sensibilidade (Ocupação 35% a 75%)
        sensitivity_table = []
        for occ in occupancy_range:
            annual_nights = round(365 * occ, 1)
            gross_annual_rev = round(median_adr * annual_nights, 2)
            seazone_management_fee = round(gross_annual_rev * seazone_fee_pct, 2)
            ota_costs = round(gross_annual_rev * 0.03, 2) # ~3% taxas operacionais e canais
            total_opex = round(seazone_management_fee + ota_costs + annual_fixed_costs, 2)
            net_income = round(gross_annual_rev - total_opex, 2)

            gross_cap_rate = round((gross_annual_rev / median_sale_price) * 100, 2) if median_sale_price > 0 else 0.0
            net_cap_rate = round((net_income / median_sale_price) * 100, 2) if median_sale_price > 0 else 0.0
            monthly_net_cash_flow = round(net_income / 12, 2)
            payback_years = round(median_sale_price / net_income, 1) if net_income > 0 else 999.0

            sensitivity_table.append({
                'occupancy_rate_pct': int(round(occ * 100)),
                'annual_occupied_nights': annual_nights,
                'gross_annual_revenue': gross_annual_rev,
                'seazone_fee': seazone_management_fee,
                'annual_fixed_costs': round(annual_fixed_costs, 2),
                'total_opex': total_opex,
                'net_operating_income': net_income,
                'monthly_net_cash_flow': monthly_net_cash_flow,
                'gross_cap_rate_pct': gross_cap_rate,
                'net_cap_rate_pct': net_cap_rate,
                'payback_years': payback_years
            })

        baseline_55 = next(item for item in sensitivity_table if item['occupancy_rate_pct'] == 55)
        yield_score = min(100, round((baseline_55['gross_cap_rate_pct'] / 15.0) * 100, 1))
        liquidity_score = min(100, round((liquidity_conversion_rate * 0.6) + (min(avg_reviews, 25) / 25 * 40), 1))
        overall_index = round((yield_score * 0.55) + (liquidity_score * 0.45), 1)

        thesis_duel_assets.append({
            'id': f"{sub.lower().replace(' ', '_')}_{beds}q",
            'suburb': sub,
            'bedrooms': beds,
            'label': combo['label'],
            'thesis_role': combo['thesis_role'],
            'market_data': {
                'median_sale_price': median_sale_price,
                'median_price_m2': median_price_m2,
                'median_area_m2': median_area,
                'for_sale_listings_count': offer_count,
                'total_airbnb_listings': total_listings,
                'liquidity_conversion_pct': liquidity_conversion_rate,
                'avg_reviews_per_listing': avg_reviews,
                'annual_fixed_costs': round(annual_fixed_costs, 2)
            },
            'rental_pricing': {
                'median_adr': median_adr
            },
            'baseline_55pct_occupancy': baseline_55,
            'sensitivity_curve': sensitivity_table,
            'scores': {
                'yield_score': yield_score,
                'liquidity_score': liquidity_score,
                'overall_index': overall_index
            }
        })

    payload = {
        'generated_at': pd.Timestamp.now().isoformat(),
        'city': 'Itapema',
        'state': 'SC',
        'seazone_brand_tokens': {
            'navy': '#00143D',
            'blue': '#0055FF',
            'coral': '#FC6058',
            'bg_dark': '#050B1A',
            'card_bg': '#0A1530'
        },
        'thesis_duel_assets': thesis_duel_assets
    }

    return payload
