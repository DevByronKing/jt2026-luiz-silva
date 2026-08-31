-- ================================================================
-- SEAZONE OS - ESQUEMA DE BANCO DE DADOS (SUPABASE POSTGRESQL)
-- Execute este script no "SQL Editor" do seu painel do Supabase:
-- https://supabase.com/dashboard/project/_/sql/new
-- ================================================================

-- 1. TABELA: SIMULAÇÕES DE CARTEIRA (Portfolio Allocator)
CREATE TABLE IF NOT EXISTS public.portfolio_simulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    investor_name TEXT DEFAULT 'Investidor Anônimo',
    total_budget NUMERIC NOT NULL,
    occupancy_rate NUMERIC NOT NULL,
    seazone_fee_pct NUMERIC NOT NULL,
    strategy_profile TEXT,
    allocated_assets JSONB NOT NULL,
    total_invested NUMERIC NOT NULL,
    remaining_cash NUMERIC NOT NULL,
    expected_annual_net NUMERIC NOT NULL,
    weighted_net_cap_rate NUMERIC NOT NULL,
    monthly_cash_flow NUMERIC NOT NULL
);

-- 2. TABELA: HISTÓRICO DE CONSULTORIA DA IA (AI Copilot Queries)
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    session_id TEXT,
    user_query TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    topic_category TEXT,
    occupancy_context NUMERIC,
    seazone_fee_context NUMERIC
);

-- 3. TABELA: MATRIZ SWOT E PROJEÇÕES DE 5 ANOS
CREATE TABLE IF NOT EXISTS public.swot_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    asset_id TEXT NOT NULL,
    asset_name TEXT NOT NULL,
    verdict TEXT NOT NULL,
    strengths JSONB,
    weaknesses JSONB,
    opportunities JSONB,
    threats JSONB,
    five_year_projection JSONB
);

-- 4. TABELA: ATIVOS IMOBILIÁRIOS CONSOLIDADOS (Airbnb + VivaReal)
CREATE TABLE IF NOT EXISTS public.market_assets (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    neighborhood TEXT NOT NULL,
    typology TEXT NOT NULL,
    bedrooms INT NOT NULL,
    median_sale_price NUMERIC NOT NULL,
    median_price_m2 NUMERIC NOT NULL,
    median_adr NUMERIC NOT NULL,
    liquidity_conversion_pct NUMERIC NOT NULL,
    avg_reviews NUMERIC,
    is_winner BOOLEAN DEFAULT false,
    is_yield_champ BOOLEAN DEFAULT false,
    thesis_role TEXT,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ================================================================
-- POLÍTICAS DE SEGURANÇA (ROW LEVEL SECURITY - RLS)
-- Permite leitura e inserção pública com a anon_key
-- ================================================================

ALTER TABLE public.portfolio_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swot_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_assets ENABLE ROW LEVEL SECURITY;

-- Políticas de Acesso Público (Leitura / Escrita via Frontend)
CREATE POLICY "Permitir leitura pública de simulações" ON public.portfolio_simulations FOR SELECT USING (true);
CREATE POLICY "Permitir inserção de simulações" ON public.portfolio_simulations FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir leitura pública do histórico AI" ON public.ai_conversations FOR SELECT USING (true);
CREATE POLICY "Permitir inserção de consultas AI" ON public.ai_conversations FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir leitura de relatórios SWOT" ON public.swot_reports FOR SELECT USING (true);
CREATE POLICY "Permitir inserção de relatórios SWOT" ON public.swot_reports FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir leitura de ativos de mercado" ON public.market_assets FOR SELECT USING (true);
CREATE POLICY "Permitir inserção/atualização de ativos" ON public.market_assets FOR ALL USING (true);

-- ================================================================
-- CARGA INICIAL (SEED) DOS ATIVOS CONSOLIDADOS DE ITAPEMA
-- ================================================================

INSERT INTO public.market_assets (id, label, neighborhood, typology, bedrooms, median_sale_price, median_price_m2, median_adr, liquidity_conversion_pct, avg_reviews, is_winner, is_yield_champ, thesis_role)
VALUES 
  ('centro_1q', 'Centro (1 Quarto / Compacto)', 'Centro', '1 Quarto / Studio', 1, 890000, 19905, 427, 76.4, 15.1, false, false, 'Tese Preliminar (Desafiante)'),
  ('centro_2q', 'Centro (2 Quartos)', 'Centro', '2 Quartos', 2, 1100000, 13048, 557, 70.7, 10.6, true, false, 'Vencedor Equilibrado (Yield + Liquidez)'),
  ('morretes_1q', 'Morretes (1 Quarto / Compacto)', 'Morretes', '1 Quarto / Compacto', 1, 600000, 12889, 350, 67.3, 8.3, false, false, 'Entrada Low Ticket / Alto Yield'),
  ('morretes_2q', 'Morretes (2 Quartos)', 'Morretes', '2 Quartos', 2, 750000, 11117, 448, 68.1, 5.7, false, true, 'Campeão de Yield Puro'),
  ('meia_praia_2q', 'Meia Praia (2 Quartos)', 'Meia Praia', '2 Quartos', 2, 970000, 11856, 450, 71.0, 11.8, false, false, 'Mercado Consolidado / Alta Demanda'),
  ('meia_praia_3q', 'Meia Praia (3 Quartos)', 'Meia Praia', '3 Quartos', 3, 1800000, 14398, 650, 63.0, 8.1, false, false, 'Volume Tradicional Familiar')
ON CONFLICT (id) DO UPDATE SET
  median_sale_price = EXCLUDED.median_sale_price,
  median_price_m2 = EXCLUDED.median_price_m2,
  median_adr = EXCLUDED.median_adr,
  updated_at = timezone('utc'::text, now());
