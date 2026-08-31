# AI Log 03 — Arquitetura da Solução, IA Copilot & Construção do Simulador (Seazone OS)

## Objetivo
Desenvolver uma aplicação executiva interativa para tomada de decisão de investimentos imobiliários, permitindo simulação em tempo real de ocupação, sensibilidade de taxas de gestão, consultoria de IA em tempo real e alternância entre Modo Claro e Escuro.

---

## 1. Arquitetura Técnica & Navegação em Abas

```
[ Datasets CSV ]
       │
       ▼ (data_pipeline.py)
[ Pipeline ETL & Deduplicação ]
       │
       ▼ (financial_model.py)
[ Modelagem Quantitativa & Sensibilidade ]
       │
       ▼ (generate_payload.py)
[ seazone_engine_payload.json ]
       │
       ▼ (React 18 + Vite + Tailwind CSS)
[ Seazone OS Executive Dashboard ]
   ├── Tab 1: 📊 Visão Geral & Duelo (Veredito, Cards, Head-to-Head & Matriz Master)
   ├── Tab 2: 🎛️ Simulador Financeiro (Sliders 35%-75%, DRE Operacional & Curva Recharts)
   ├── Tab 3: 🤖 Seazone AI Copilot (Chatbot Especialista, Prompts Rápidos & SWOT Generator)
   └── Tab 4: 💼 Alocador de Carteira (Portfolio Optimizer por Capital Disponível)
```

---

## 2. Integração do Seazone AI Copilot
- **Base de Conhecimento Quantitativa:** Alimentado com os dados reais de 4.441 anúncios de Airbnb e 7.968 imóveis do VivaReal em Itapema.
- **Dossiê SWOT Automatizado:** Permite selecionar qualquer imóvel e gerar com 1 clique um Parecer Executivo de Comitê de Investimento com Forças, Fraquezas, Oportunidades, Ameaças e Projeção a 5 Anos.
- **Consultoria Interativa:** Responde a dúvidas de investidores sobre tese de compactos, alocação ótima, sazonalidade de inverno e mitigação de custos de condomínio/IPTU.

---

## 3. Padrões de Design e Modos Claro / Escuro
- **Dark Mode (Padrão):** Navy profundo (`#050B1A`, `#0A1530`), Azul Seazone (`#0055FF`), Coral (`#FC6058`) e efeitos translúcidos de glassmorphism com glow.
- **Light Mode:** Fundo gelo (`#F8FAFC`, `#FFFFFF`), cartões limpos com bordas sutis (`#E2E8F0`), sombras suaves e alto contraste tipográfico.
- **Alternador de Tema:** Botão com ícones de Sol e Lua no topo com persistência em `localStorage`.

---

## 4. Otimizações de Código
- **Single Source of Truth:** Utilitários `formatters.js` e `calculations.js` compartilhados entre todos os componentes.
- **Modularização Python:** Separação limpa entre pipeline ETL (`data_pipeline.py`) e motor financeiro (`financial_model.py`).
- **Pronto para Produção:** Build testado e validado com Vite (compilação em ~3.0s) e deploy configurado na Vercel.
