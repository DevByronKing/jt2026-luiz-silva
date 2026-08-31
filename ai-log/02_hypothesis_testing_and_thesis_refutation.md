# Sessão 02 — Modelagem Quantitativa & Refutação Matemática da Tese

**Objetivo:** Avaliar empiricamente a hipótese preliminar interna sugerida pela Seazone: *"Apartamentos compactos (studio/1 quarto) na região do Centro são a aposta mais eficiente para a Seazone."*

---

## 💬 Transcrição do Prompt Estratégico

> **User Prompt (AI Builder):**
> *"Cruze a base limpa de vendas do VivaReal com as métricas de receita do Airbnb em Itapema. Modele o Cap Rate Bruto e o Cap Rate Líquido (descontando 20% de taxa Seazone, 3% de canais OTA, condomínio, IPTU e reserva de manutenção de 0,5% a.a.) para cada tipologia e bairro. Tome posição formal sobre a tese dos compactos no Centro. Os dados sustentam essa hipótese ou a refutam? Demonstre a matemática."*

---

## 🧠 Chain of Thought (Dedução Matemática & Modelagem Financeira)

### 1. Fórmulas de Retorno Financeiro Empregadas:
- **Receita Bruta Anual (Gross Revenue):**
  $$\text{Gross Annual} = \text{ADR Mediana} \times (365 \times \text{Taxa de Ocupação})$$
- **Despesas Operacionais Deduzidas (Opex):**
  $$\text{Taxa Seazone} = \text{Gross Annual} \times 20\%$$
  $$\text{Taxas de Plataformas OTA} = \text{Gross Annual} \times 3\%$$
  $$\text{Custos Fixos Anuais} = \text{Condomínio} + \text{IPTU} + (\text{Preço de Compra} \times 0.5\%)$$
- **Resultado Operacional Líquido (NOI - Net Operating Income):**
  $$\text{NOI} = \text{Gross Annual} - \text{Taxa Seazone} - \text{Taxa OTA} - \text{Custos Fixos}$$
- **Métricas de Rentabilidade:**
  $$\text{Gross Cap Rate} = \frac{\text{Gross Annual}}{\text{Preço de Compra}} \times 100$$
  $$\text{Net Cap Rate} = \frac{\text{NOI}}{\text{Preço de Compra}} \times 100$$

---

## 📊 Tabela Comparativa de Decisão (@ 55% de Ocupação Baseline)

| Bairro & Tipologia | Preço Compra Mediano | Preço/m² Compra | ADR Mediana Airbnb | Gross Cap Rate | Net Cap Rate (@ 55%) | Fluxo Líquido Mensal | Liquidez (% Reviews) | Veredito Estratégico |
|---|---|---|---|---|---|---|---|---|
| **Centro (1Q / Studio)** | R$ 890.000 | **R$ 19.905/m²** | R$ 427/dia | 9,63% | **6,18%** | R$ 4.583/mês | 76,4% | ❌ **Refutado em Rentabilidade** |
| **Centro (2 Quartos)** | R$ 1.100.000 | **R$ 13.048/m²** | R$ 557/dia | 10,17% | **6,75%** | R$ 6.188/mês | 70,7% | 🏆 **Campeão Risco/Retorno** |
| **Morretes (1Q / Compacto)** | R$ 600.000 | R$ 12.889/m² | R$ 350/dia | 11,71% | **8,50%** | R$ 4.250/mês | 67,3% | 💡 Low Ticket / Alto Yield |
| **Morretes (2 Quartos)** | R$ 750.000 | **R$ 11.117/m²** | R$ 448/dia | 11,99% | **8,65%** | R$ 5.407/mês | 68,1% | 🚀 **Campeão de Yield Puro** |
| **Meia Praia (2 Quartos)** | R$ 970.000 | R$ 11.856/m² | R$ 450/dia | 9,31% | **6,12%** | R$ 4.951/mês | 71,0% | 🏖️ Preservação Patrimonial |
| **Meia Praia (3 Quartos)** | R$ 1.800.000 | R$ 14.398/m² | R$ 650/dia | 7,25% | **4,73%** | R$ 7.091/mês | 63,0% | 👨‍👩‍👧 Alto Ticket Familiar |

---

## 🎯 Por que a Tese Preliminar foi Refutada?

1. **Efeito Distorção do Preço por m² (+52,5% mais caro):**
   - O compacto no Centro custa em média **R$ 19.905/m²** contra **R$ 13.048/m²** no 2 Quartos Centro. O investidor paga um sobrepreço excessivo por metro quadrado na aquisição.
2. **Incapacidade de Elasticidade da Diária:**
   - Para compensar o metro quadrado caro, o 1Q precisaria alcançar diárias quase idênticas às de um imóvel maior. Porém, a diária mediana do 2Q no Centro é **30,4% maior** (R$ 557 vs R$ 427), pois atrai famílias e grupos de turistas que dividem o custo da hospedagem.
3. **Esmagamento do Net Cap Rate:**
   - O Net Cap Rate do Centro 1Q fica em **6,18%**, perdendo tanto para o **Centro 2Q (6,75%)** quanto para os ativos de **Morretes (8,65%)**.

---

## 💡 Recomendação Estratégica Seazone (Estratégia Barbell)

Em vez de concentrar capital em compactos no Centro, a alocação ótima para um fundo de investimento em Itapema consiste na estratégia **Barbell (60/40)**:
- **60% em Centro 2 Quartos:** Ativo âncora com resiliência de demanda, menor vacância e alta liquidez de valorização.
- **40% em Morretes 2 Quartos:** Ativo alavancador de yield com menor barreira de entrada (R$ 750k) e o maior Cap Rate da cidade (8,65% a.a.).
- **Resultado Consolidado da Carteira:** Net Cap Rate médio ponderado de **~7,51% a.a.**
