# 🤖 Seazone AI Builder Master Log — Metodologia & Trilha de Engenharia de IA

> **Hackathon Jovens Talentos 2026 | Seazone Tech**  
> **Candidato:** Luiz Silva (`jt2026-luiz-silva`)  
> **Tema:** Tomada de Decisão de Investimento Imobiliário & Refutação de Tese em Itapema (SC)  
> **Avaliação de IA (Peso 30%):** Processo iterativo, senso crítico, persistência técnica e engenharia de prompts.

---

## 🎯 Visão Geral da Metodologia de IA Aplicada

Esta pasta documenta **a sessão completa de ponta a ponta** do desenvolvimento da plataforma **Seazone OS (Decision Support Platform)**. Em conformidade estrita com o edital do hackathon, todas as interações estão registradas em formato **100% texto/Markdown e JSON estruturado** (sem prints ou capturas de tela), evidenciando o uso de IA não como gerador cego de código, mas como **ferramenta de modelagem quantitativa, validação de hipóteses e engenharia de software de alta performance**.

```
ai-log/
├── README.md                                      <- Índice da metodologia e framework de IA
├── 01_prompt_engineering_and_data_pipeline.md     <- Ingestão das 5 bases, deduplicação temporal e filtros
├── 02_hypothesis_testing_and_thesis_refutation.md <- Modelagem quantitativa e refutação matemática da tese
├── 03_financial_engine_and_fullstack_development.md <- Desenvolvimento do simulador, curvas de sensibilidade e DRE
├── 04_ai_copilot_predictive_and_supabase_persistence.md <- AI Copilot, diagnósticos preditivos e banco de dados
├── 05_production_audit_and_design_system_refinement.md <- Theming Seazone, depuração de CSS e auditoria de build
└── session_transcript_complete.json              <- Transcrição cronológica completa da sessão (Machine-Readable)
```

---

## 🧠 Frameworks e Padrões de Prompting Empregados

Durante todo o ciclo de construção, foram aplicadas técnicas avançadas de **Engenharia de Prompt**:

1. **Role-Prompting & Persona Conditioning:** Condicionamento da IA com personas de *Senior Real Estate Quantitative Analyst*, *FinOps Architect* e *Lead Full-Stack Engineer*.
2. **Chain-of-Thought (CoT) & Reasoning Step-by-Step:** Exigência de dedução matemática passo a passo antes da escrita de qualquer algoritmo ou componente visual.
3. **Senso Crítico & Fact-Checking Rigoroso:** Rejeição de médias aritméticas inflacionadas por mansões e coberturas de luxo em Itapema, forçando o uso sistemático de **medianas** e filtros de sanidade interquartil.
4. **Self-Correction & Debugging Iterativo:** Identificação e resolução autônoma de problemas complexos de pipeline (ex: deduplicação de múltiplos snapshots em `Price_AV_Itapema.csv` e isolamento de especificidade CSS no modo escuro do Tailwind/Vite).
5. **Human-in-the-Loop Supervision:** Validação contínua das premissas de negócio da Seazone (desconto de taxa de gestão de 20%, custos fixos de condomínio/IPTU e reserva de manutenção preventiva de 0,5% a.a. para o cálculo do verdadeiro **Net Cap Rate**).

---

## 📊 Matriz de Rastreabilidade das Decisões

| Etapa do Desafio | Desafio de Negócio / Técnico | Intervenção & Senso Crítico | Resultado Obtido |
|---|---|---|---|
| **Engenharia de Dados** | `Price_AV` com 118k+ linhas duplicadas por data de captura. | Instruído deduplicação estrita pelo último snapshot (`aquisition_date.last()`). | Base de diárias limpa e consistente com 4.441 anúncios. |
| **Higienização VivaReal** | Imóveis com preços aberrantes (R$ 1 e R$ 100M). | Estabelecido filtro de sanidade (R$ 150k a R$ 25M e R$ 3k a R$ 50k/m²). | Base de compra representativa com 7.968 imóveis reais. |
| **Validação da Tese** | Tese preliminar de que compactos 1Q no Centro seriam melhores. | Confrontado Custo de Aquisição/m² vs ADR do Airbnb e Cap Rate Líquido. | **Tese refutada matematicamente** (1Q m² +52,5% mais caro, Net Cap 6,18% vs 6,75% no 2Q). |
| **Simulação Financeira** | Necessidade de modelar sazonalidade e sensibilidade. | Criadas funções paramétricas de ocupação (35% a 75%) e taxas de gestão. | Simulador financeiro interativo com DRE dinâmico em tempo real. |
| **AI Copilot** | Consultor de IA que respondesse com dados reais sem alucinações. | Engenharia de contexto restrito (RAG) alimentado com os microdados consolidados. | Respostas executivas ricas com renderização Markdown e persistência Supabase. |
| **Theming & UI/UX** | Conflito de especificidade no Dark/Light Mode. | Reescrita dos seletores CSS para scoping puro em `html.dark` e `html:not(.dark)`. | Alternância instantânea e estética corporativa no padrão Seazone. |
