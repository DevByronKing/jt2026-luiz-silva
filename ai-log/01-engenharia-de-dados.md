# AI Log 01 — Engenharia de Dados & Tratamento de Anomalias

## Contexto e Objetivos
A primeira etapa do desafio consistiu em ingerir, auditar, limpar e unificar as 5 bases de dados brutas do mercado imobiliário de Itapema (SC):
- `Details_Itapema.csv` (anúncios Airbnb)
- `Hosts_ids_Itapema.csv` (histórico de anfitriões)
- `Mesh_Ids_Data_Itapema.csv` (coordenadas geográficas e bairros)
- `Price_AV_Itapema.csv` (calendário diário de preços)
- `VivaReal_Itapema.csv` (anúncios de venda de imóveis)

---

## 1. Descobertas e Tratamentos Realizados

### A. Deduplicação do Calendário de Preços (`Price_AV_Itapema.csv`)
- **Problema Identificado:** O arquivo continha múltiplos snapshots da mesma data de estadia para o mesmo anúncio, capturados em momentos (`aquisition_date`) diferentes.
- **Tratamento:** Ordenação por data de aquisição e seleção estrita do último snapshot válido (`last()`) por par `(airbnb_listing_id, date)`.
- **Filtro de Diárias Atípicas:** Exclusão de valores aberrantes (erros de digitação/depósitos caução como R$ 50.000 ou diárias simbólicas abaixo de R$ 80). Faixa válida estabelecida: `R$ 80 <= price <= R$ 15.000`.
- **Métricas Derivadas:** Cálculo de ADR Mediana, Média, P25, P75 e contagem de noites no calendário para cada anúncio.

### B. Cruzamento Geoespacial e Anfitriões
- Merge 1:1 entre `Details_Itapema` e `Mesh_Ids_Data_Itapema` para associar latitude, longitude e bairro padronizado.
- Deduplicação dos dados de `Hosts_ids_Itapema` pelo `host_snapshot_date` mais recente para cada `owner_id`.

### C. Higienização da Base de Compra (`VivaReal_Itapema.csv`)
- **Filtro de Preço por m²:** Cálculo de `price_m2 = sale_price / usable_area`.
- **Filtros de Sanidade:**
  - `sale_price` entre R$ 150.000 e R$ 25.000.000.
  - `usable_area` entre 18 m² e 800 m².
  - `price_m2` entre R$ 3.000/m² e R$ 50.000/m².
  - `bedrooms` entre 0 e 5.
- **Normalização de Bairros:** Padronização de variações como `'Centro de Itapema'` -> `'Centro'`, `'Castelo Branco'` / `'Jardim Praia Mar'` -> `'Meia Praia'`, `'Jardim Morretes'` -> `'Morretes'`.

---

## 2. Decisões Metodológicas
- **Uso de Medianas:** A mediana foi escolhida como métrica de tendência central primária tanto para preços de venda quanto para diárias de Airbnb, neutralizando a distorção provocada por mansões e coberturas de luxo no litoral catarinense.
- **Estrutura Modular:** Pipeline implementado em Python (`backend/data_pipeline.py`) com resolução automática e resiliente de diretórios.
