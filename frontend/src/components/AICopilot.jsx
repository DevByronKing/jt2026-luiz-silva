import React, { useState, useMemo } from 'react';
import { formatBRL, formatPct } from '../utils/formatters';
import { QUICK_PROMPTS, INVESTOR_PROFILES } from '../constants/aiPrompts';
import {
  calculatePredictiveDiagnostics,
  processAICopilotQuery,
  generateExecutiveDossier,
  downloadDossierMarkdown
} from '../utils/aiAdvisor';
import {
  Bot,
  Sparkles,
  Send,
  Download,
  Copy,
  Check,
  ShieldCheck,
  TrendingUp,
  Activity,
  Zap,
  UserCheck,
  RotateCcw,
  User
} from 'lucide-react';

// Renderizador Semântico de Markdown para Respostas da IA
function FormattedMessageRenderer({ content }) {
  if (!content) return null;

  const lines = content.trim().split('\n');
  const elements = [];
  let currentList = [];
  let inBlockquote = false;
  let blockquoteLines = [];

  const flushList = (key) => {
    if (currentList.length > 0) {
      elements.push(
        <div key={`list-container-${key}`} className="space-y-2 my-2.5">
          {currentList.map((item, idx) => {
            const isNumbered = item.isNumbered;
            return (
              <div key={idx} className="flex items-start text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                {isNumbered ? (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0055FF]/15 dark:bg-[#0055FF]/30 text-[#0055FF] dark:text-[#3377FF] font-bold text-[11px] mr-2.5 flex-shrink-0 mt-0.5 font-mono">
                    {item.number}
                  </span>
                ) : (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0055FF] dark:bg-[#3377FF] mt-2 mr-2.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  {renderInlineFormatting(item.text)}
                </div>
              </div>
            );
          })}
        </div>
      );
      currentList = [];
    }
  };

  const flushBlockquote = (key) => {
    if (blockquoteLines.length > 0) {
      elements.push(
        <div
          key={`quote-${key}`}
          className="my-3.5 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-[#0055FF]/10 via-blue-50/50 to-transparent dark:from-[#0055FF]/20 dark:via-[#00143D]/50 border-l-4 border-[#0055FF] text-xs sm:text-sm text-slate-900 dark:text-slate-100 shadow-sm"
        >
          {blockquoteLines.map((q, idx) => (
            <p key={idx} className="leading-relaxed font-medium">
              {renderInlineFormatting(q)}
            </p>
          ))}
        </div>
      );
      blockquoteLines = [];
      inBlockquote = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Blockquote (Callouts)
    if (trimmed.startsWith('>')) {
      flushList(index);
      inBlockquote = true;
      blockquoteLines.push(trimmed.replace(/^>\s*/, ''));
      return;
    } else if (inBlockquote) {
      flushBlockquote(index);
    }

    // Headings (### ou ##)
    if (trimmed.startsWith('###') || trimmed.startsWith('##')) {
      flushList(index);
      const headingText = trimmed.replace(/^#+\s*/, '');
      elements.push(
        <div key={`h-${index}`} className="mt-3.5 mb-2.5 pb-2 border-b border-slate-200 dark:border-[#0055FF]/20 first:mt-0">
          <h4 className="text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>{headingText}</span>
          </h4>
        </div>
      );
      return;
    }

    // Numbered list item: "1. Texto"
    const numberMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numberMatch) {
      currentList.push({ isNumbered: true, number: numberMatch[1], text: numberMatch[2] });
      return;
    }

    // Bullet list item: "* Texto" ou "- Texto"
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      currentList.push({ isNumbered: false, text: trimmed.replace(/^[-*]\s*/, '') });
      return;
    } else {
      flushList(index);
    }

    // Paragraph
    if (trimmed.length > 0) {
      elements.push(
        <p key={`p-${index}`} className="my-1.5 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {renderInlineFormatting(trimmed)}
        </p>
      );
    }
  });

  flushList('final');
  flushBlockquote('final');

  return <div className="space-y-1">{elements}</div>;
}

// Formatação inline de **negrito** e *itálico*
function renderInlineFormatting(text) {
  if (typeof text !== 'string') return text;

  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={i} className="italic text-slate-800 dark:text-slate-200">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}

export default function AICopilot({ selectedAsset, occupancy, seazoneFee, allAssets, leverageData }) {
  const [query, setQuery] = useState('');
  const [selectedProfileId, setSelectedProfileId] = useState('equilibrado');
  const [isCopied, setIsCopied] = useState(false);
  const [copiedMsgIdx, setCopiedMsgIdx] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const contextData = useMemo(() => ({
    selectedAsset: selectedAsset || allAssets?.[1],
    occupancy,
    seazoneFee,
    allAssets,
    leverageData
  }), [selectedAsset, occupancy, seazoneFee, allAssets, leverageData]);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `### 🤖 Seazone AI Investment Advisor

Olá! Sou o seu consultor quantitativo de investimentos imobiliários em Itapema (SC).

Fui alimentado com a base real de **4.441 anúncios do Airbnb** e **8.329 ofertas do VivaReal**.

> **Como posso apoiar sua tomada de decisão estratégica hoje?**
> Selecione um dos prompts rápidos abaixo ou digite sua dúvida personalizada.`
    }
  ]);

  // Diagnósticos Preditivos
  const diagnostics = useMemo(() => {
    return calculatePredictiveDiagnostics(contextData.selectedAsset, contextData.selectedAsset?.calc);
  }, [contextData.selectedAsset]);

  // Envio de Pergunta
  const handleSendQuery = (textToSend) => {
    const q = (textToSend || query).trim();
    if (!q) return;

    const newMessages = [...messages, { role: 'user', content: q }];
    setMessages(newMessages);
    setQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const response = processAICopilotQuery(q, contextData);
      setMessages([...newMessages, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 300);
  };

  // Download do Dossiê
  const handleDownloadDossier = () => {
    const dossierMarkdown = generateExecutiveDossier(contextData);
    downloadDossierMarkdown(dossierMarkdown, `Dossie_Executivo_Seazone_${contextData.selectedAsset?.id || 'Itapema'}.md`);
  };

  // Copiar Dossiê Completo
  const handleCopyDossier = () => {
    const dossierMarkdown = generateExecutiveDossier(contextData);
    navigator.clipboard.writeText(dossierMarkdown);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Copiar Mensagem Específica do Chat
  const handleCopyMessage = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgIdx(idx);
    setTimeout(() => setCopiedMsgIdx(null), 2000);
  };

  const currentProfile = INVESTOR_PROFILES[selectedProfileId] || INVESTOR_PROFILES.equilibrado;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Hero Header */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border transition-all duration-300 dark:border-[#0055FF]/30 border-slate-200 dark:bg-gradient-to-br dark:from-[#0A1530]/90 dark:to-[#050B1A]/95 bg-white relative overflow-hidden glow-blue">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider dark:bg-[#0055FF]/20 dark:border-[#0055FF]/40 dark:text-[#3377FF] bg-blue-50 border border-blue-200 text-[#0055FF]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Seazone AI Copilot & Dossiê Executivo</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Consultoria Estratégica Quantitativa em Tempo Real
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Consulte nossa IA treinada com os microdados imobiliários de Itapema, gere diagnósticos preditivos de elasticidade e exporte memorandos formais para comitês de investimento em 1 clique.
            </p>
          </div>

          {/* Botões de Exportação Rápida */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 min-w-[240px]">
            <button
              onClick={handleDownloadDossier}
              className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-bold text-xs bg-[#0055FF] hover:bg-[#3377FF] text-white shadow-lg shadow-[#0055FF]/30 transition transform hover:scale-[1.02]"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Dossiê (.MD)</span>
            </button>
            <button
              onClick={handleCopyDossier}
              className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-xs dark:bg-[#00143D] dark:text-slate-300 dark:hover:bg-[#002B80] bg-slate-100 text-slate-700 hover:bg-slate-200 border dark:border-slate-800 border-slate-200 transition"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Dossiê Copiado!' : 'Copiar para Área de Transferência'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Diagnósticos Preditivos & Perfis de Investidor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lado Esquerdo (2 Colunas): Diagnósticos Preditivos */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border dark:border-[#0055FF]/25 border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b dark:border-slate-800 border-slate-200 pb-3">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-[#0055FF]" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Diagnóstico Preditivo Avançado — {contextData.selectedAsset?.label}
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-[#00143D] text-[#0055FF] dark:text-[#3377FF] font-bold border border-blue-200 dark:border-[#0055FF]/30">
              ADR {formatBRL(contextData.selectedAsset?.rental_pricing?.median_adr)}/noite
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            
            {/* Card 1: Ponto de Equilíbrio */}
            <div className="p-4 rounded-xl dark:bg-[#00143D]/90 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Ponto de Equilíbrio</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                {diagnostics.breakevenOcc}%
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                Ocupação mínima anual necessária para cobrir 100% dos custos fixos e taxas.
              </p>
            </div>

            {/* Card 2: Elasticidade de Diária */}
            <div className="p-4 rounded-xl dark:bg-[#00143D]/90 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Elasticidade (+R$ 50 ADR)</span>
                <TrendingUp className="w-4 h-4 text-[#0055FF]" />
              </div>
              <div className="text-2xl font-black font-mono text-[#0055FF] dark:text-[#3377FF]">
                +{diagnostics.elasticityPct}%
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                Ganho de NOI (+{formatBRL(diagnostics.additionalNetWith50Brl)}/ano) com precificação dinâmica.
              </p>
            </div>

            {/* Card 3: Índice de Resiliência */}
            <div className="p-4 rounded-xl dark:bg-[#00143D]/90 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Índice de Resiliência</span>
                <Zap className="w-4 h-4 text-[#FC6058]" />
              </div>
              <div className="text-2xl font-black font-mono text-[#FC6058]">
                {diagnostics.resilienceScore}/100
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                Capacidade de sustentar margem positiva durante o inverno em Itapema.
              </p>
            </div>

          </div>
        </div>

        {/* Lado Direito (1 Coluna): Perfis de Investidor */}
        <div className="glass-panel rounded-2xl p-6 border dark:border-[#0055FF]/25 border-slate-200 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 border-b dark:border-slate-800 border-slate-200 pb-3">
              <UserCheck className="w-4 h-4 text-[#0055FF]" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Perfil de Investidor
              </h3>
            </div>

            <div className="flex gap-1.5 pt-3">
              {Object.values(INVESTOR_PROFILES).map((prof) => (
                <button
                  key={prof.id}
                  onClick={() => setSelectedProfileId(prof.id)}
                  className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold transition text-center ${
                    selectedProfileId === prof.id
                      ? 'bg-[#0055FF] text-white shadow-md shadow-[#0055FF]/30'
                      : 'dark:bg-[#00143D] dark:text-slate-400 bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {prof.name.split(' ')[0]}
                </button>
              ))}
            </div>

            <div className="mt-4 p-3.5 rounded-xl dark:bg-[#00143D] bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 dark:text-white">{currentProfile.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                  {currentProfile.targetNetCapRate}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                {currentProfile.description}
              </p>
              <div className="pt-2 border-t dark:border-slate-800 border-slate-200 text-[11px]">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Alocação Recomendada: </span>
                <strong className="text-[#0055FF] dark:text-[#3377FF]">{currentProfile.allocationStrategy}</strong>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleSendQuery(`Qual a tese detalhada de investimento recomendada para o perfil ${currentProfile.name}?`)}
            className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-[#0055FF]/10 hover:bg-[#0055FF]/20 text-[#0055FF] dark:text-[#3377FF] border border-[#0055FF]/30 transition text-center"
          >
            💬 Consultar Estratégia no Chat
          </button>
        </div>

      </div>

      {/* Caixa de Interação do Chat de IA */}
      <div className="glass-panel rounded-2xl p-6 border dark:border-[#0055FF]/25 border-slate-200 space-y-4">
        
        {/* Header do Chat */}
        <div className="flex items-center justify-between border-b dark:border-slate-800 border-slate-200 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0055FF] to-[#FC6058] flex items-center justify-center text-white shadow-md shadow-[#0055FF]/20">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  AI Investment Advisor — Chat Consultivo
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                  LIVE
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Alimentado com 4.441 anúncios do Airbnb e 8.329 ofertas do VivaReal
              </p>
            </div>
          </div>

          <button
            onClick={() => setMessages([{ role: 'assistant', content: '### 🤖 Chat Reiniciado\n\nComo posso apoiar sua análise de investimentos imobiliários em Itapema hoje?' }])}
            className="text-xs text-slate-400 hover:text-[#FC6058] flex items-center space-x-1 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpar Chat</span>
          </button>
        </div>

        {/* Pílulas de Prompts Rápidos */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Perguntas Estratégicas Frequentes:
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSendQuery(p.query)}
                className="text-xs px-3.5 py-2 rounded-xl dark:bg-[#00143D] dark:hover:bg-[#002B80] dark:border-[#0055FF]/30 dark:text-slate-200 bg-blue-50/70 hover:bg-blue-100 border border-blue-200 text-[#0055FF] font-medium transition shadow-sm"
              >
                💬 {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fluxo de Mensagens com Renderização Formatada */}
        <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2 pt-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#0055FF] to-[#FC6058] flex items-center justify-center text-white flex-shrink-0 mt-1 shadow-sm">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`relative group rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  m.role === 'assistant'
                    ? 'dark:bg-[#00143D]/90 bg-white border dark:border-[#0055FF]/25 border-slate-200 text-slate-800 dark:text-slate-200 max-w-[92%] sm:max-w-[85%]'
                    : 'bg-[#0055FF] text-white ml-auto max-w-[85%] rounded-br-none shadow-md shadow-[#0055FF]/20 font-medium'
                }`}
              >
                {m.role === 'assistant' ? (
                  <>
                    <FormattedMessageRenderer content={m.content} />
                    
                    {/* Botão de Copiar Resposta */}
                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex justify-end">
                      <button
                        onClick={() => handleCopyMessage(m.content, idx)}
                        className="text-[10px] font-semibold text-slate-400 hover:text-[#0055FF] dark:hover:text-[#3377FF] flex items-center space-x-1 transition"
                        title="Copiar resposta"
                      >
                        {copiedMsgIdx === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-500 font-bold">Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar texto</span>
                          </>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                )}
              </div>

              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 flex-shrink-0 mt-1">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#0055FF] to-[#FC6058] flex items-center justify-center text-white flex-shrink-0 mt-1">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="p-4 rounded-2xl dark:bg-[#00143D]/90 bg-white border dark:border-[#0055FF]/20 border-slate-200 text-slate-500 text-xs flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-[#0055FF] animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-[#0055FF] animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-2 h-2 rounded-full bg-[#0055FF] animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                <span className="font-mono text-[#0055FF] dark:text-[#3377FF] font-semibold">
                  Processando microdados de Itapema...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Barra de Entrada de Pergunta */}
        <div className="flex gap-2 pt-2 border-t dark:border-slate-800 border-slate-200">
          <input
            type="text"
            placeholder="Faça uma pergunta sobre rentabilidade, sazonalidade, liquidez ou alocação..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
            className="flex-1 px-4 py-3 rounded-xl text-xs sm:text-sm border dark:bg-[#00143D] dark:border-slate-800 dark:text-white bg-slate-50 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0055FF] transition"
          />
          <button
            onClick={() => handleSendQuery()}
            disabled={isTyping}
            className="px-5 py-3 rounded-xl bg-[#0055FF] hover:bg-[#3377FF] text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-[#0055FF]/30 transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>Enviar</span>
          </button>
        </div>

      </div>

    </div>
  );
}
