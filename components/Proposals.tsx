
import React, { useState } from 'react';
import { Deal, Contact, Proposal, ProposalItem, User } from '../types';
import { SMART_PRICE_LIST, PROPOSAL_TERMS } from '../constants';
import Modal from './Modal';
import { GoogleGenAI } from "@google/genai";

interface ProposalsProps {
  deals: Deal[];
  contacts: Contact[];
  proposals: Proposal[];
  onAddProposal: (proposal: Proposal) => void;
  currentUser?: User;
}

interface AISuggestion {
  suggestedItemsIds: string[];
  deadlines: Record<string, string>;
  pricingInsight: string;
  creativeReasoning: string;
}

const Proposals: React.FC<ProposalsProps> = ({ deals, contacts, proposals, onAddProposal }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDealId, setSelectedDealId] = useState(deals[0]?.id || '');
  const [currentProposalItems, setCurrentProposalItems] = useState<ProposalItem[]>([]);
  const [viewingProposal, setViewingProposal] = useState<Proposal | null>(null);
  
  // AI States
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestion | null>(null);

  const selectedDeal = deals.find(d => d.id === selectedDealId);

  const handleAddProposal = () => {
    const total = currentProposalItems.reduce((acc, item) => acc + (item.unitValue * item.quantity), 0);
    const newProposal: Proposal = {
      id: Math.random().toString(36).substr(2, 9),
      dealId: selectedDealId,
      date: new Date().toLocaleDateString('pt-BR'),
      items: [...currentProposalItems],
      totalValue: total,
      status: 'draft'
    };
    onAddProposal(newProposal);
    setIsAddModalOpen(false);
    setCurrentProposalItems([]);
    setAiSuggestion(null);
  };

  const addItemToProposal = (priceItemId: string) => {
    const priceItem = SMART_PRICE_LIST.find(p => p.id === priceItemId);
    if (priceItem) {
      const newItem: ProposalItem = {
        id: Math.random().toString(36).substr(2, 9),
        priceItemId: priceItem.id,
        description: priceItem.description,
        quantity: 1,
        unitValue: priceItem.value
      };
      setCurrentProposalItems([...currentProposalItems, newItem]);
    }
  };

  const removeItemFromProposal = (id: string) => {
    setCurrentProposalItems(currentProposalItems.filter(item => item.id !== id));
  };

  const getSmartSuggestions = async () => {
    if (!selectedDeal) return;
    setIsAiLoading(true);
    setAiSuggestion(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Você é o assistente inteligente da Agência Smart, especialista em Comunicação Interna e Employer Branding.
        Sua missão é sugerir os serviços ideais para uma proposta comercial baseada no contexto do negócio abaixo.

        NEGÓCIO:
        Título: ${selectedDeal.title}
        Descrição: ${selectedDeal.description || 'Não informada'}
        Foco inicial: ${selectedDeal.products.join(', ')}

        CARDÁPIO DE SERVIÇOS DISPONÍVEIS (ID e Descrição):
        ${SMART_PRICE_LIST.map(p => `- ID ${p.id}: ${p.description} (Tamanho ${p.size})`).join('\n')}

        INSTRUÇÕES:
        1. Escolha de 2 a 4 IDs que mais brilham para este projeto.
        2. Para CADA item (mesmo os IDs sugeridos), estime um prazo de entrega realista (ex: 3 dias úteis, 1 semana).
        3. Dê um insight de precificação (ex: "O valor está ótimo para o escopo" ou "Considere cobrar um premium pela urgência").
        4. Escreva um parágrafo curto e criativo (com a linguagem leve e bem-humorada da Smart) explicando por que essas escolhas farão o cliente brilhar.

        Responda APENAS em JSON no formato:
        {
          "suggestedItemsIds": ["id1", "id2"],
          "deadlines": {"id1": "prazo", "id2": "prazo"},
          "pricingInsight": "string",
          "creativeReasoning": "string"
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const result = JSON.parse(response.text || '{}') as AISuggestion;
      setAiSuggestion(result);
    } catch (error) {
      console.error("Erro na IA Smart:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const applyAiSuggestions = () => {
    if (!aiSuggestion) return;
    const newItems = aiSuggestion.suggestedItemsIds
      .map(id => {
        const item = SMART_PRICE_LIST.find(p => p.id === id);
        if (item) {
          return {
            id: Math.random().toString(36).substr(2, 9),
            priceItemId: item.id,
            description: `${item.description} (Estimado: ${aiSuggestion.deadlines[id] || 'Sob consulta'})`,
            quantity: 1,
            unitValue: item.value
          } as ProposalItem;
        }
        return null;
      })
      .filter(i => i !== null) as ProposalItem[];

    setCurrentProposalItems([...currentProposalItems, ...newItems]);
    setAiSuggestion(null);
  };

  const exportToPDF = () => {
    window.print();
  };

  const formatCurrency = (val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <h2 className="text-3xl font-black italic tracking-tighter uppercase">Fábrica de Propostas</h2>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-smart-green text-smart-black px-6 py-3 rounded-full font-black uppercase text-sm hover:bg-black hover:text-smart-green transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          Nova Proposta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:hidden">
        {proposals.map(p => {
          const deal = deals.find(d => d.id === p.dealId);
          const client = contacts.find(c => c.id === deal?.contactId);
          return (
            <div key={p.id} className="bg-white border-2 border-smart-black p-6 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(49,216,137,1)] transition-all group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black uppercase px-2 py-1 bg-smart-gray rounded">{p.date}</span>
                <span className="text-[10px] font-black uppercase px-2 py-1 bg-smart-green text-smart-black rounded">Draft</span>
              </div>
              <h3 className="font-black text-xl mb-1 uppercase italic tracking-tight group-hover:text-smart-green">{deal?.title || 'Negócio Excluído'}</h3>
              <p className="text-xs font-bold text-gray-500 uppercase mb-4">{client?.company}</p>
              <p className="text-2xl font-black text-smart-black mb-6">{formatCurrency(p.totalValue)}</p>
              <button 
                onClick={() => setViewingProposal(p)}
                className="w-full py-3 bg-smart-black text-smart-white font-black uppercase text-xs rounded-xl hover:bg-smart-green hover:text-smart-black transition-all"
              >
                Ver Detalhes & Exportar
              </button>
            </div>
          );
        })}
        {proposals.length === 0 && (
          <div className="col-span-full py-20 text-center border-4 border-dashed border-gray-200 rounded-3xl">
            <p className="text-gray-400 font-black uppercase italic">Nenhuma proposta gerada ainda. Vamos brilhar?</p>
          </div>
        )}
      </div>

      {/* Modal Add Proposal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Configurar Nova Proposta" maxWidth="max-w-2xl">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Selecione o Negócio</label>
                <select 
                  className="w-full p-3 border-2 border-smart-black rounded-xl font-bold bg-white"
                  value={selectedDealId}
                  onChange={e => setSelectedDealId(e.target.value)}
                >
                  {deals.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Adicionar Manulamente</label>
                <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar border-2 border-smart-gray p-2 rounded-xl">
                  {SMART_PRICE_LIST.map(item => (
                    <button 
                      key={item.id}
                      onClick={() => addItemToProposal(item.id)}
                      className="flex justify-between items-center p-3 border-2 border-gray-100 rounded-xl hover:border-smart-green hover:bg-smart-gray transition-all text-left group"
                    >
                      <div className="max-w-[180px]">
                        <p className="text-[10px] font-black uppercase text-smart-black leading-tight truncate">{item.description}</p>
                        <p className="text-[9px] font-bold text-gray-400">{item.size} • {formatCurrency(item.value)}</p>
                      </div>
                      <span className="text-smart-green font-black group-hover:scale-125 transition-transform">+</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* AI SUGGESTION AREA */}
            <div className="space-y-4">
              <div className="bg-smart-black p-6 rounded-2xl border-2 border-smart-black shadow-[6px_6px_0px_0px_rgba(49,216,137,1)] text-smart-white relative overflow-hidden group">
                <div className="relative z-10">
                  <h4 className="text-xs font-black uppercase mb-2 text-smart-green flex items-center gap-2 italic">
                    Smart Suggest ✨
                    {isAiLoading && <span className="animate-spin text-lg">⚙️</span>}
                  </h4>
                  <p className="text-[10px] text-gray-300 font-medium mb-4">Deixe a IA analisar o negócio e sugerir os serviços que mais brilham para este cliente.</p>
                  
                  {!aiSuggestion && !isAiLoading && (
                    <button 
                      onClick={getSmartSuggestions}
                      className="w-full py-2 bg-smart-green text-smart-black font-black uppercase text-[10px] rounded-lg hover:bg-white transition-all shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
                    >
                      Pedir Ajuda à IA
                    </button>
                  )}

                  {isAiLoading && <p className="text-[10px] font-bold italic animate-pulse">Consultando o oráculo da Smart...</p>}

                  {aiSuggestion && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                      <p className="text-[10px] font-bold italic text-smart-green mb-3 leading-tight">"{aiSuggestion.creativeReasoning}"</p>
                      <div className="space-y-1 mb-4">
                        <p className="text-[9px] font-black uppercase text-gray-400">Prazos Sugeridos:</p>
                        {Object.entries(aiSuggestion.deadlines).map(([id, deadline]) => {
                          const item = SMART_PRICE_LIST.find(p => p.id === id);
                          return (
                            <p key={id} className="text-[9px] font-bold">
                              • {item?.description}: <span className="text-smart-green">{deadline}</span>
                            </p>
                          );
                        })}
                      </div>
                      <p className="text-[9px] bg-white/10 p-2 rounded border border-white/20 mb-4">💡 {aiSuggestion.pricingInsight}</p>
                      <button 
                        onClick={applyAiSuggestions}
                        className="w-full py-2 bg-smart-green text-smart-black font-black uppercase text-[10px] rounded-lg hover:bg-white transition-all"
                      >
                        Aceitar Sugestões
                      </button>
                    </div>
                  )}
                </div>
                {/* Background decorative element */}
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-smart-green/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
              </div>
            </div>
          </div>

          {currentProposalItems.length > 0 && (
            <div className="pt-4 border-t-4 border-smart-black">
              <label className="block text-[10px] font-black uppercase text-smart-green mb-3 italic">Carrinho de Projetos</label>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {currentProposalItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-smart-gray rounded-xl border border-gray-200">
                    <span className="text-[11px] font-black uppercase">{item.description}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-black">{formatCurrency(item.unitValue)}</span>
                      <button onClick={() => removeItemFromProposal(item.id)} className="text-red-500 font-black hover:scale-125 transition-transform text-lg">×</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-between items-center p-6 bg-smart-black text-smart-white rounded-2xl shadow-[6px_6px_0px_0px_rgba(49,216,137,1)]">
                <span className="text-xs font-black uppercase italic tracking-widest">Investimento Estimado</span>
                <span className="text-2xl font-black text-smart-green">{formatCurrency(currentProposalItems.reduce((acc, i) => acc + (i.unitValue * i.quantity), 0))}</span>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button 
              disabled={currentProposalItems.length === 0}
              onClick={handleAddProposal}
              className={`w-full py-5 rounded-3xl font-black uppercase text-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all ${
                currentProposalItems.length === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-smart-green text-smart-black hover:-translate-y-1'
              }`}
            >
              Confirmar Proposta & Atualizar Negócio
            </button>
          </div>
        </div>
      </Modal>

      {/* Viewing / PDF Preview Modal */}
      {viewingProposal && (
        <Modal 
          isOpen={!!viewingProposal} 
          onClose={() => setViewingProposal(null)} 
          title="Visualização da Proposta"
          maxWidth="max-w-4xl"
        >
          <div className="space-y-6">
            <div id="proposal-printable" className="bg-white p-4 md:p-10 border-2 border-smart-black rounded-3xl text-smart-black font-sans print:border-none print:p-0 print:shadow-none print:m-0 print:w-full print:block">
              {/* Header PDF Style */}
              <div className="flex flex-col md:flex-row justify-between items-center border-b-4 border-smart-black pb-6 mb-8 gap-4">
                <div className="flex items-center gap-2">
                  <div className="bg-smart-black text-smart-green w-10 h-10 flex items-center justify-center font-black text-2xl">S</div>
                  <span className="text-3xl font-black italic tracking-tighter uppercase">Smart.</span>
                </div>
                <div className="text-center md:text-right">
                  <h1 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter leading-none">
                    Nossa Proposta para {contacts.find(c => c.id === deals.find(d => d.id === viewingProposal.dealId)?.contactId)?.company || 'Cliente'}
                  </h1>
                  <p className="text-[10px] font-black text-smart-green mt-1">{viewingProposal.date}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-10 overflow-x-auto print:overflow-visible">
                <div className="min-w-[600px] print:min-w-full">
                  <div className="bg-smart-black text-smart-white text-[10px] font-black uppercase flex px-4 py-3 rounded-t-xl">
                    <span className="flex-grow">Descrição do Serviço</span>
                    <span className="w-24 text-center">Tam.</span>
                    <span className="w-32 text-right">Valor</span>
                  </div>
                  <div className="border-x-2 border-b-2 border-smart-black rounded-b-xl">
                    {viewingProposal.items.map((item, idx) => (
                      <div key={idx} className="flex px-4 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 print:hover:bg-transparent">
                        <span className="flex-grow font-bold text-sm">{item.description}</span>
                        <span className="w-24 text-center font-black text-xs uppercase">
                          {SMART_PRICE_LIST.find(p => p.id === item.priceItemId)?.size || 'M'}
                        </span>
                        <span className="w-32 text-right font-black text-sm">{formatCurrency(item.unitValue)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Total Row */}
              <div className="flex justify-center md:justify-end mb-12">
                <div className="bg-smart-green p-6 md:p-8 border-4 border-smart-black rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center md:text-right w-full md:w-auto print:shadow-none print:m-0 print:border-2">
                  <p className="text-[10px] font-black uppercase text-smart-black tracking-widest mb-2 leading-tight">INVESTIMENTO TOTAL (INCLUI IMPOSTOS)</p>
                  <p className="text-3xl md:text-4xl font-black">{formatCurrency(viewingProposal.totalValue)}</p>
                </div>
              </div>

              {/* Terms Section (Informações Importantes) */}
              <div className="bg-smart-gray p-6 md:p-8 rounded-3xl border-2 border-smart-black print:bg-white print:border-gray-200">
                <h4 className="text-xs md:text-sm font-black uppercase italic tracking-tighter mb-4 border-b-2 border-smart-black inline-block">Informações Importantes</h4>
                <div className="text-[9px] md:text-[10px] text-gray-700 leading-relaxed space-y-3 font-medium text-justify print:text-xs">
                  {PROPOSAL_TERMS.trim().split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>

              {/* Footer PDF */}
              <div className="mt-12 text-center text-[8px] font-black uppercase text-gray-400">
                Smart. | Alameda Santos 2.224, cj. 52, Jardim Paulista, São Paulo | wearesmart.com.br
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 flex-shrink-0 print:hidden">
              <button 
                onClick={exportToPDF}
                className="flex-1 bg-smart-green text-smart-black py-4 rounded-2xl font-black uppercase text-sm hover:bg-black hover:text-smart-green transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
              >
                Exportar para PDF / Imprimir
              </button>
              <button 
                onClick={() => setViewingProposal(null)}
                className="px-8 py-4 bg-smart-black text-smart-white rounded-2xl font-black uppercase text-sm hover:opacity-90 transition-opacity"
              >
                Fechar
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Improved Print Styles */}
      <style>{`
        @media print {
          /* Reset total da página */
          body, html {
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            background: #FFFFFF !important;
          }

          /* Esconder toda a UI do CRM e da Modal, deixando apenas os pais necessários visíveis */
          aside, header, nav, .print\\:hidden, button, select, .modal-overlay > div:first-child {
            display: none !important;
          }

          /* Remover backgrounds de overlay e centrar conteúdo */
          .modal-overlay {
            background: transparent !important;
            position: absolute !important;
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            z-index: 9999 !important;
          }

          /* Garantir que a caixa branca da modal suma e apenas o #proposal-printable fique */
          .modal-overlay > div {
             box-shadow: none !important;
             border: none !important;
             max-height: none !important;
             padding: 0 !important;
             margin: 0 !important;
             width: 100% !important;
          }

          #proposal-printable {
            display: block !important;
            visibility: visible !important;
            position: relative !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 30px !important;
            border: none !important;
            box-shadow: none !important;
          }

          /* Fix para cores sumindo em alguns navegadores */
          .bg-smart-green { background-color: #31D889 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .bg-smart-black { background-color: #000000 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .text-smart-green { color: #31D889 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .bg-smart-gray { background-color: #F4F4F4 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
};

export default Proposals;
