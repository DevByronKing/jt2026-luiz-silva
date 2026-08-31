**Link do Vídeo:** [INSERIR LINK DO GOOGLE DRIVE AQUI COM ACESSO PÚBLICO]

# Relatório Executivo — Plataforma de Apoio à Tomada de Decisão de Investimentos (Seazone OS)

---

## 1. Sumário Executivo & Contexto do Desafio
- **Objetivo Estratégico:** Construir uma solução analítica orientada a dados para subsidiar a tomada de decisão de investimentos imobiliários em Itapema (SC).
- **A Tese Avaliada:** Validação matemática da hipótese interna preliminar sobre compactos (1 quarto/studio) no Centro.
- **Conclusão Principal:** Refutação quantitativa da superioridade de yield dos compactos no Centro e validação do ativo **Centro (2 Quartos)** como o campeão no binômio risco-retorno, com **Morretes (2 Quartos)** despontando como o campeão em Cap Rate puro.

---

## 2. Validação da Tese: Duelo de Compactos vs. 2 Quartos no Centro de Itapema
- **Esmagamento do Cap Rate no 1Q Centro:** Preço do m² de aquisição inflacionado (**R$ 19.905/m²** vs. **R$ 13.048/m²** no 2Q).
- **Comparativo de Diárias (ADR):** ADR mediana de R$ 557 (2Q) vs. R$ 427 (1Q).
- **Matriz de Rentabilidade (Cap Rate Bruto e Líquido @ 55% de Ocupação):**
  - *Centro 1Q:* Gross Cap Rate de 9,63% | Net Cap Rate de 6,18%
  - *Centro 2Q:* Gross Cap Rate de 10,17% | Net Cap Rate de 6,75%
  - *Morretes 2Q:* Gross Cap Rate de 11,99% | Net Cap Rate de 8,65%
- **Equilíbrio entre Yield e Liquidez de Demanda:** Análise de conversão de reviews e velocidade de locação.

---

## 3. Engenharia de Dados & Tratamento de Anomalias
- **Bases de Dados Integradas:** `Details_Itapema.csv`, `Hosts_ids_Itapema.csv`, `Mesh_Ids_Data_Itapema.csv`, `Price_AV_Itapema.csv` e `VivaReal_Itapema.csv`.
- **Tratamento Geoespacial e Deduplicação de Diárias:** Merge 1:1 de coordenadas de `Mesh_Ids` e deduplicação de scrapes do calendário.
- **Higienização de Outliers Imobiliários:** Filtros de área útil, valores atípicos de compra e padronização de microrregiões.

---

## 4. Modelagem Quantitativa & Viabilidade Econômica (Cap Rate / ROI / Sensibilidade)
- **Função de Sensibilidade Financeira:** Variação de 35% a 75% de ocupação anual.
- **Estrutura de Custos Operacionais (Opex):** Taxa de Gestão Seazone (20%), condomínio, IPTU e reserva de manutenção.
- **Métricas de Retorno:** Net Operating Income (NOI), Fluxo de Caixa Mensal e Payback estimado.

---

## 5. Arquitetura da Solução

```
├── backend/
│   ├── requirements.txt
│   ├── data_pipeline.py
│   ├── financial_model.py
│   └── generate_payload.py
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── constants/theme.js
│       ├── utils/formatters.js
│       ├── utils/calculations.js
│       └── components/
├── ai-log/
│   ├── 01-engenharia-de-dados.md
│   ├── 02-refutacao-da-tese.md
│   └── 03-criacao-simulador.md
└── data/ (CSVs)
```

---

## 6. Instruções de Execução e Deploy

### Backend Python:
```bash
cd backend
pip install -r requirements.txt
python generate_payload.py
```

### Frontend React (Vite):
```bash
cd frontend
npm install
npm run dev
```

Para build de produção:
```bash
cd frontend
npm run build
```
