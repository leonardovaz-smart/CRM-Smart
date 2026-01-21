
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
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Configurar Nova Proposta" maxWidth="max-w-2xl">
        <div className="space-y-6">
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
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Serviços da Proposta</label>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 border-2 border-smart-gray p-2 rounded-xl">
                {SMART_PRICE_LIST.map(item => (
                  <button 
                    key={item.id}
                    onClick={() => addItemToProposal(item.id)}
                    className="flex justify-between items-center p-3 border-2 border-gray-100 rounded-xl hover:border-smart-green transition-all text-left"
                  >
                    <div>
                      <p className="text-[10px] font-black uppercase leading-tight">{item.description}</p>
                      <p className="text-[9px] font-bold text-gray-400">{formatCurrency(item.value)}</p>
                    </div>
                    <span className="text-smart-green font-black">+</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {currentProposalItems.length > 0 && (
            <div className="pt-4 border-t-2 border-smart-black">
              <div className="space-y-2 mb-4">
                {currentProposalItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-2 bg-smart-gray rounded-lg">
                    <span className="text-[10px] font-black uppercase">{item.description}</span>
                    <button onClick={() => removeItemFromProposal(item.id)} className="text-red-500 font-black px-2">×</button>
                  </div>
                ))}
              </div>
              <div className="bg-smart-black text-smart-green p-4 rounded-xl flex justify-between items-center">
                <span className="text-xs font-black uppercase italic">Investimento</span>
                <span className="text-xl font-black">{formatCurrency(currentProposalItems.reduce((acc, i) => acc + i.unitValue, 0))}</span>
              </div>
            </div>
          )}

          <button 
            disabled={currentProposalItems.length === 0}
            onClick={handleAddProposal}
            className="w-full py-4 bg-smart-green text-smart-black rounded-xl font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
          >
            Confirmar Proposta
          </button>
        </div>
      </Modal>

      {viewingProposal && (
        <Modal 
          isOpen={!!viewingProposal} 
          onClose={() => setViewingProposal(null)} 
          title="Visualização da Proposta"
          maxWidth="max-w-4xl"
        >
          <div className="space-y-6">
            <div id="proposal-printable" className="bg-white p-10 border-2 border-smart-black rounded-3xl text-smart-black font-sans print:border-none print:p-0 print:m-0 print:shadow-none">
              <div className="flex justify-between items-center border-b-4 border-smart-black pb-6 mb-8">
                <div className="flex items-center gap-2">
                  <div className="bg-smart-black text-smart-green w-10 h-10 flex items-center justify-center font-black text-2xl">S</div>
                  <span className="text-3xl font-black italic tracking-tighter uppercase">Smart.</span>
                </div>
                <div className="text-right">
                  <h1 className="text-xl font-black uppercase italic tracking-tighter leading-none">
                    Proposta Comercial
                  </h1>
                  <p className="text-[10px] font-black text-smart-green mt-1">{viewingProposal.date}</p>
                </div>
              </div>

              <div className="mb-10">
                <div className="bg-smart-black text-smart-white text-[10px] font-black uppercase flex px-4 py-3 rounded-t-xl">
                  <span className="flex-grow">Item</span>
                  <span className="w-32 text-right">Valor</span>
                </div>
                <div className="border-x-2 border-b-2 border-smart-black rounded-b-xl">
                  {viewingProposal.items.map((item, idx) => (
                    <div key={idx} className="flex px-4 py-4 border-b border-gray-100 last:border-0">
                      <span className="flex-grow font-bold text-sm">{item.description}</span>
                      <span className="w-32 text-right font-black text-sm">{formatCurrency(item.unitValue)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end mb-12">
                <div className="bg-smart-green p-6 border-4 border-smart-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-right print:shadow-none">
                  <p className="text-[10px] font-black uppercase mb-1">INVESTIMENTO TOTAL</p>
                  <p className="text-3xl font-black">{formatCurrency(viewingProposal.totalValue)}</p>
                </div>
              </div>

              <div className="bg-smart-gray p-6 rounded-2xl border-2 border-smart-black print:bg-white print:border-gray-200">
                <h4 className="text-xs font-black uppercase italic tracking-tighter mb-4 border-b-2 border-smart-black inline-block">Termos e Condições</h4>
                <div className="text-[9px] text-gray-700 leading-relaxed font-medium whitespace-pre-line">
                  {PROPOSAL_TERMS}
                </div>
              </div>

              <div className="mt-12 text-center text-[8px] font-black uppercase text-gray-400">
                Smart. | Alameda Santos 2.224, cj. 52, Jardim Paulista, São Paulo | wearesmart.com.br
              </div>
            </div>

            <div className="flex gap-4 print:hidden">
              <button 
                onClick={exportToPDF}
                className="flex-1 bg-smart-green text-smart-black py-4 rounded-2xl font-black uppercase text-sm hover:bg-black hover:text-smart-green transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
              >
                Exportar para PDF / Imprimir
              </button>
              <button 
                onClick={() => setViewingProposal(null)}
                className="px-8 py-4 bg-smart-black text-smart-white rounded-2xl font-black uppercase text-sm"
              >
                Fechar
              </button>
            </div>
          </div>
        </Modal>
      )}

      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #proposal-printable, #proposal-printable * { visibility: visible !important; }
          #proposal-printable {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            margin: 0;
            padding: 20mm !important;
            border: none !important;
          }
          .modal-overlay { background: white !important; }
        }
      `}</style>
    </div>
  );
};

export default Proposals;
