# Sessão 04 — Consultor Inteligente (AI Copilot), Diagnósticos Preditivos & Persistência Supabase

**Objetivo:** Integrar um consultor quantitativo autônomo baseado em IA, diagnósticos preditivos em tempo real, geração de memorandos executivos em 1 clique e modelagem de persistência em banco de dados Supabase (PostgreSQL).

---

## 💬 Transcrição do Prompt Estratégico

> **User Prompt (AI Builder):**
> *"Como integrar IA no sistema de forma inteligente, funcional e que agregue real valor? Adicione diagnósticos preditivos (Ponto de Equilíbrio, Elasticidade de Diária e Índice de Resiliência no inverno), chat consultivo com respostas formatadas em markdown sem texto bruto, gerador de Dossiê Executivo para comitês de investimento e persistência no Supabase."*

---

## 🧠 Chain of Thought (Engenharia de IA & Arquitetura de Persistência)

1. **Evitando Alucinações com Context-Restricted Grounding:**
   - Em vez de um chatbot genérico, o **Seazone AI Advisor** foi injetado com o contexto exato dos microdados de Itapema (4.441 anúncios de Airbnb, 7.968 imóveis do VivaReal, taxas de conversão de reviews e parâmetros de ocupação).
   - *Suporte Dual:* Motor de raciocínio local determinístico em `aiAdvisor.js` com suporte a chamadas diretas à API do Google Gemini via `geminiService.js` quando credenciais estiverem configuradas.

2. **Diagnósticos Preditivos em Tempo Real:**
   - **Elasticidade de Diária (+R$ 50 ADR):** Mensuração do ganho líquido marginal de NOI proporcionado pela precificação dinâmica com IA da Seazone.
   - **Índice de Resiliência à Baixa Temporada (0 a 100):** Combinação ponderada da distância para o breakeven de ocupação (60%) e da liquidez histórica de reviews (40%).

3. **Renderizador Semântico de Markdown (`FormattedMessageRenderer`):**
   - Construído parser em JavaScript para transformar respostas em cards executivos estruturados:
     - Títulos `###` -> Headers destacados com ícones.
     - Itens numerados `1.`, `2.` -> Badges circulares em azul Seazone.
     - Callouts `>` -> Caixas de destaque com borda lateral e fundo translúcido.
     - Botão de cópia individual por mensagem com confirmação visual (*"Copiado!"*).

4. **Gerador e Exportador de Dossiê Executivo (`.MD`):**
   - Função de exportação direta no navegador de um Memorando Formal para Comitê de Investimento completo (Sumário, DRE, KPIs, Análise de Alavancagem e Recomendação de Alocação).

5. **Modelagem do Banco de Dados Supabase (`supabase_schema.sql`):**
   ```sql
   -- Tabela de Simulações de Carteira
   CREATE TABLE IF NOT EXISTS public.portfolio_simulations (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
       investor_name TEXT DEFAULT 'Investidor Seazone',
       total_budget NUMERIC NOT NULL,
       occupancy_rate NUMERIC NOT NULL,
       seazone_fee_pct NUMERIC NOT NULL,
       strategy_profile TEXT,
       allocated_assets JSONB NOT NULL,
       expected_annual_net NUMERIC NOT NULL,
       weighted_net_cap_rate NUMERIC NOT NULL,
       monthly_cash_flow NUMERIC NOT NULL
   );
   
   -- Row Level Security (RLS)
   ALTER TABLE public.portfolio_simulations ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Permitir leitura e escrita publica anon" 
   ON public.portfolio_simulations FOR ALL USING (true);
   ```

---

## 🔒 Segurança de Credenciais (Compliance do Edital)
- As chaves de API (`VITE_GEMINI_API_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) foram rigorosamente isoladas no arquivo `.env` e protegidas pelo `.gitignore`, prevenindo qualquer vazamento de credenciais no repositório público.
