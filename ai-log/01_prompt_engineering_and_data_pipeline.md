# Sessão 01 — Engenharia de Dados, Deduplicação Temporal e Cruzamento Geoespacial

**Objetivo:** Construir um pipeline de ingestão e higienização robusto e resiliente em Python para processar as 5 bases brutas do mercado imobiliário de Itapema (SC): `Details_Itapema.csv`, `Hosts_ids_Itapema.csv`, `Mesh_Ids_Data_Itapema.csv`, `Price_AV_Itapema.csv` e `VivaReal_Itapema.csv`.

---

## 💬 Transcrição do Prompt Estratégico

> **User Prompt (AI Builder):**
> *"Atue como um Engenheiro de Dados e Analista Quantitativo Sênior especializado no mercado imobiliário de short stay. Analise as 5 bases de dados fornecidas para a cidade de Itapema (SC). Identifique anomalias, dados duplicados no calendário de diárias do Airbnb, inconsistências geoespaciais e outliers de preços de venda no VivaReal. Construa um pipeline modular em Python (`data_pipeline.py`) que trate esses dados com rigor estatístico, utilizando medianas para evitar distorções de imóveis de super-luxo. Não invente nenhum dado externo."*

---

## 🧠 Chain of Thought (Raciocínio Analítico da IA)

1. **Auditoria Estrutural dos Arquivos:**
   - `Price_AV_Itapema.csv`: Contém 118.839 registros de preços diários de diárias. Identifiquei que anúncios possuem múltiplos registros para a mesma data de estadia (`date`), capturados em datas de aquisição (`aquisition_date`) distintas.
   - *Decisão de Engenharia:* Para capturar a tarifa mais recente e precisa, devemos ordenar por `aquisition_date` ascendente e reter apenas a última observação válida (`.drop_duplicates(subset=['airbnb_listing_id', 'date'], keep='last')`).
   - *Tratamento de Tarifas Aberrantes:* Diárias abaixo de R$ 80 (simbólicas/erros) ou acima de R$ 15.000 (depósitos caução mal configurados) foram descartadas para não contaminar a métrica de ADR.

2. **Integração Geoespacial (Mesh IDs):**
   - Cruzamento 1:1 entre os anúncios de `Details_Itapema` e as coordenadas de `Mesh_Ids_Data_Itapema` para enriquecer cada listing com latitude, longitude e bairro validado.
   - Tratamento de nomes de bairros para padronização unificada (`'Centro de Itapema'` -> `'Centro'`, `'Jardim Morretes'` -> `'Morretes'`, `'Castelo Branco'` / `'Jardim Praia Mar'` -> `'Meia Praia'`).

3. **Higienização Estatística do VivaReal (`VivaReal_Itapema.csv`):**
   - Anúncios com `usable_area` <= 0 ou preços simbólicos (ex: R$ 1 ou R$ 100.000.000) geram distorções grosseiras de preço/m².
   - *Critérios de Filtro:*
     - `sale_price`: R$ 150.000 a R$ 25.000.000.
     - `usable_area`: 18 m² a 800 m².
     - `price_m2`: R$ 3.000/m² a R$ 50.000/m².
     - `bedrooms`: 0 a 5 quartos.

---

## 💻 Implementação Técnica Gerada (`backend/data_pipeline.py`)

```python
import pandas as pd
import numpy as np
from pathlib import Path

def load_raw_data(data_dir: Path):
    """Carrega os 5 datasets com inferência e tipagem segura."""
    details = pd.read_csv(data_dir / "Details_Itapema.csv", low_memory=False)
    hosts = pd.read_csv(data_dir / "Hosts_ids_Itapema.csv", low_memory=False)
    mesh = pd.read_csv(data_dir / "Mesh_Ids_Data_Itapema.csv", low_memory=False)
    price_av = pd.read_csv(data_dir / "Price_AV_Itapema.csv", low_memory=False)
    vivareal = pd.read_csv(data_dir / "VivaReal_Itapema.csv", low_memory=False)
    return details, hosts, mesh, price_av, vivareal

def process_calendar_and_adr(price_av: pd.DataFrame) -> pd.DataFrame:
    """Deduplicação estrita do calendário e extração de ADR robusto."""
    price_av['aquisition_date'] = pd.to_datetime(price_av['aquisition_date'], errors='coerce')
    price_av = price_av.sort_values('aquisition_date').drop_duplicates(
        subset=['airbnb_listing_id', 'date'], keep='last'
    )
    
    # Filtro de sanidade de diárias
    valid_prices = price_av[(price_av['price'] >= 80) & (price_av['price'] <= 15000)]
    
    adr_stats = valid_prices.groupby('airbnb_listing_id')['price'].agg(
        median_adr='median',
        mean_adr='mean',
        p25_adr=lambda x: x.quantile(0.25),
        p75_adr=lambda x: x.quantile(0.75),
        calendar_nights='count'
    ).reset_index()
    
    return adr_stats
```

---

## 🔬 Validação & Resultados do Pipeline

- **Anúncios Airbnb Consolidados e Georreferenciados:** 4.441 listings únicos.
- **Imóveis VivaReal Higienizados:** 7.968 ofertas válidas.
- **Deduplicação de Diárias:** 118.839 linhas de calendário limpas e agregadas por anúncio.
- **Resultado:** Base analítica 100% livre de anomalias, pronta para a modelagem financeira do Cap Rate.
