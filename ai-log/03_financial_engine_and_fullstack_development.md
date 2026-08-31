# Sessão 03 — Arquitetura Full-Stack, Simulador Financeiro & Curvas de Sensibilidade

**Objetivo:** Construir uma aplicação web executiva (React + Vite + Tailwind CSS) de alta fidelidade visual, com simulador de sensibilidade de ocupação, DRE em tempo real e comparador de ativos imobiliários.

---

## 💬 Transcrição do Prompt Estratégico

> **User Prompt (AI Builder):**
> *"Crie uma interface executiva para tomada de decisão imobiliária (Seazone OS). A aplicação deve conter abas organizadas (Duelo & Veredito, Simulador Financeiro & DRE, Curvas de Sensibilidade e AI Copilot). O usuário deve conseguir alterar interativamente a taxa de ocupação (35% a 75%) e a taxa de gestão Seazone (10% a 30%), recalculando instantaneamente todos os retornos, DREs e gráficos do Recharts."*

---

## 🧠 Chain of Thought (Engenharia de Software & Arquitetura de Componentes)

1. **Separação de Responsabilidades (SoC):**
   - **`calculations.js`**: Função pura e determinística `calculateFinancialMetrics(asset, occupancy, seazoneFee)` exportada para recálculo instantâneo sem efeitos colaterais.
   - **`formatters.js`**: Padronização monetária brasileira (`Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`) e percentuais.
   - **Componentes Modulares:**
     - `ExecutiveVerdict.jsx`: Hero banner com a decisão do comitê e métricas de destaque.
     - `AssetComparisonCard.jsx`: Cards com tags de papel na tese, KPIs e comparativos.
     - `OccupancySlider.jsx`: Sliders interativos com feedback tátil e visual de parâmetros.
     - `SensitivityChart.jsx`: Curvas de sensibilidade de Net Cap Rate vs Ocupação renderizadas via Recharts.
     - `ConsolidatedTable.jsx`: Matriz executiva consolidada de decisão.
     - `LeverageSimulator.jsx`: Simulador de alavancagem bancária e retorno Cash-on-Cash.

2. **Algoritmo de Ponto de Equilíbrio Operacional (Breakeven):**
   - Implementação da fórmula que calcula a quantidade exata de noites e percentual mínimo de ocupação anual para zerar o NOI:
   ```javascript
   export function calculateFinancialMetrics(asset, occupancyPct, seazoneFeePct) {
     const salePrice = asset.market_data.median_sale_price;
     const medianAdr = asset.rental_pricing.median_adr;
     const nights = Math.round(365 * (occupancyPct / 100));
     const grossAnnual = nights * medianAdr;
     
     const seazoneFee = grossAnnual * (seazoneFeePct / 100);
     const otaCosts = grossAnnual * 0.03; // taxa média de distribuição
     const fixedCosts = asset.market_data.annual_fixed_costs;
     
     const totalExpenses = seazoneFee + otaCosts + fixedCosts;
     const netIncome = grossAnnual - totalExpenses;
     const netCapRate = salePrice > 0 ? (netIncome / salePrice) * 100 : 0;
     const grossCapRate = salePrice > 0 ? (grossAnnual / salePrice) * 100 : 0;
     
     // Breakeven Occupancy
     const netMarginPerNight = medianAdr * (1 - (seazoneFeePct / 100) - 0.03);
     const breakevenNights = netMarginPerNight > 0 ? fixedCosts / netMarginPerNight : 365;
     const breakevenOccupancyPct = Math.min(100, Math.max(0, Number(((breakevenNights / 365) * 100).toFixed(1))));
     
     return { nights, grossAnnual, seazoneFee, otaCosts, fixedCosts, netIncome, netCapRate, grossCapRate, monthlyNet: netIncome / 12, payback: salePrice / netIncome, breakevenOccupancyPct };
   }
   ```

---

## 🎨 Design System e Estética Visual Corporativa

- **Paleta de Cores:** Navy Seazone (`#00143D`, `#050B1A`), Azul Seazone (`#0055FF`), Coral Alerta/Destaque (`#FC6058`), Verde Emerald (`#10B981`) para retornos financeiros.
- **Glassmorphism:** Efeitos translúcidos com `backdrop-blur-md` e bordas com opacidade suave.
- **Responsividade:** Grid adaptativo de 1 coluna (Mobile), 2 colunas (Tablet) e 3 colunas (Desktop 4K).
