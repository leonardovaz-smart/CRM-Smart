
import React, { useState } from 'react';
import { Deal, DealStage, Contact, TEAM_MEMBERS, DealTemperature, SaleType, EngagementModel } from '../types';
import { STAGES_LABELS, Icons } from '../constants';
import Modal from './Modal';
import DealDetailsModal from './DealDetailsModal';

interface DealsProps {
  deals: Deal[];
  contacts: Contact[];
  onAddDeal: (deal: Deal) => void;
  onUpdateDeal: (deal: Deal) => void;
  onMoveDeal: (dealId: string, stage: DealStage) => void;
}

const Deals: React.FC<DealsProps> = ({ deals, contacts, onAddDeal, onUpdateDeal, onMoveDeal }) => {
  const stages: DealStage[] = ['prospecting', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  
  const [newDeal, setNewDeal] = useState({ 
    title: '', 
    value: '', 
    stage: 'prospecting' as DealStage,
    contactId: contacts[0]?.id || '',
    responsibleId: TEAM_MEMBERS[0]?.id || '1',
    temperature: 'warm' as DealTemperature,
    saleType: 'normal' as SaleType,
    engagementModel: 'job' as EngagementModel,
    productsStr: ''
  });

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('dealId', dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, stage: DealStage) => {
    const dealId = e.dataTransfer.getData('dealId');
    onMoveDeal(dealId, stage);
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    onAddDeal({
      id: Math.random().toString(36).substr(2, 9),
      title: newDeal.title,
      contactId: newDeal.contactId,
      responsibleId: newDeal.responsibleId,
      value: newDeal.value === '' ? 0 : Number(newDeal.value),
      stage: newDeal.stage,
      expectedCloseDate: 'A definir',
      products: newDeal.productsStr.split(',').map(p => p.trim()).filter(p => p !== ''),
      temperature: newDeal.temperature,
      saleType: newDeal.saleType,
      engagementModel: newDeal.engagementModel
    });
    setIsAddModalOpen(false);
    setNewDeal({ 
      title: '', 
      value: '', 
      stage: 'prospecting', 
      contactId: contacts[0]?.id || '',
      responsibleId: '1',
      temperature: 'warm',
      saleType: 'normal',
      engagementModel: 'job',
      productsStr: ''
    });
  };

  const handleUpdateFromModal = (updated: Deal) => {
    onUpdateDeal(updated);
    setSelectedDeal(updated); // This ensures immediate reactivity in the modal UI
  };

  const tempEmoji = (temp: string) => {
    switch(temp) {
      case 'hot': return '🔥';
      case 'warm': return '☕';
      case 'cold': return '❄️';
      default: return '';
    }
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar">
      {stages.map((stage) => (
        <div 
          key={stage} 
          className="flex-shrink-0 w-80"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, stage)}
        >
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-black uppercase text-sm tracking-wider flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${stage === 'closed_won' ? 'bg-smart-green' : 'bg-smart-black'}`}></span>
              {STAGES_LABELS[stage]}
            </h3>
            <span className="text-xs font-bold bg-smart-gray px-2 py-1 rounded">
              {deals.filter(d => d.stage === stage).length}
            </span>
          </div>
          
          <div className="space-y-4 min-h-[500px]">
            {deals.filter(d => d.stage === stage).map((deal) => {
              const agencyRep = TEAM_MEMBERS.find(m => m.id === deal.responsibleId);
              const client = contacts.find(c => c.id === deal.contactId);

              return (
                <div 
                  key={deal.id} 
                  draggable
                  onDragStart={(e) => handleDragStart(e, deal.id)}
                  onClick={() => setSelectedDeal(deal)}
                  className="bg-smart-white border-2 border-smart-black p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform cursor-grab active:cursor-grabbing group bg-white"
                >
                  <div className="flex justify-between items-start mb-2">
                     <h4 className="font-black text-lg leading-tight group-hover:text-smart-green transition-colors">{deal.title}</h4>
                     <span title={`Status: ${deal.temperature}`} className="text-lg">{tempEmoji(deal.temperature)}</span>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tight">{client?.company || 'Sem Cliente'}</p>
                    <p className="font-black text-smart-green text-sm">R$ {deal.value.toLocaleString('pt-BR')}</p>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div className="flex gap-1">
                      <span className="text-[7px] font-black uppercase px-1 py-0.5 rounded border border-smart-black bg-smart-gray">
                        {deal.engagementModel}
                      </span>
                      <span className="text-[7px] font-black uppercase px-1 py-0.5 rounded border border-smart-black bg-smart-white">
                        {deal.saleType.replace('_', ' ')}
                      </span>
                    </div>
                    {/* AVATAR DO RESPONSÁVEL NA AGÊNCIA */}
                    <div className="relative group/avatar" title={`Responsável: ${agencyRep?.name}`}>
                      <img 
                        src={agencyRep?.avatar} 
                        className="w-7 h-7 rounded-full border-2 border-smart-black object-cover" 
                        alt={agencyRep?.name} 
                      />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-smart-green rounded-full border border-smart-black"></div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 text-sm font-bold hover:border-smart-green hover:text-smart-green transition-all"
            >
              + Adicionar Negócio
            </button>
          </div>
        </div>
      ))}

      {/* Modal de Criação Expandido */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Novo Negócio na Mesa">
        <form onSubmit={handleSubmitAdd} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase mb-1">Título do Projeto</label>
              <input 
                required
                className="w-full p-3 border-2 border-smart-black rounded-xl focus:ring-2 focus:ring-smart-green outline-none font-bold" 
                placeholder="Ex: Campanha Brilhante 2024"
                value={newDeal.title}
                onChange={e => setNewDeal({...newDeal, title: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Cliente / Prospect</label>
                <select 
                  className="w-full p-3 border-2 border-smart-black rounded-xl bg-white font-bold text-sm"
                  value={newDeal.contactId}
                  onChange={e => setNewDeal({...newDeal, contactId: e.target.value})}
                >
                  {contacts.map(c => <option key={c.id} value={c.id}>{c.name} ({c.company})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Valor do Brilho (R$)</label>
                <input 
                  type="number"
                  className="w-full p-3 border-2 border-smart-black rounded-xl focus:ring-2 focus:ring-smart-green outline-none font-bold" 
                  placeholder="0.00"
                  value={newDeal.value}
                  onChange={e => setNewDeal({...newDeal, value: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Responsável Smart</label>
                <select 
                  className="w-full p-3 border-2 border-smart-black rounded-xl bg-white font-bold text-sm"
                  value={newDeal.responsibleId}
                  onChange={e => setNewDeal({...newDeal, responsibleId: e.target.value})}
                >
                  {TEAM_MEMBERS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Temperatura</label>
                <select 
                  className="w-full p-3 border-2 border-smart-black rounded-xl bg-white font-bold text-sm"
                  value={newDeal.temperature}
                  onChange={e => setNewDeal({...newDeal, temperature: e.target.value as DealTemperature})}
                >
                  <option value="hot">Tá pegando fogo! 🔥</option>
                  <option value="warm">Morno ☕</option>
                  <option value="cold">Gelado ❄️</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Tipo de Venda</label>
                <select 
                  className="w-full p-3 border-2 border-smart-black rounded-xl bg-white font-bold text-sm"
                  value={newDeal.saleType}
                  onChange={e => setNewDeal({...newDeal, saleType: e.target.value as SaleType})}
                >
                  <option value="normal">Nova Conquista</option>
                  <option value="upsell">Upsell</option>
                  <option value="cross_sell">Cross-sell</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Modelo</label>
                <select 
                  className="w-full p-3 border-2 border-smart-black rounded-xl bg-white font-bold text-sm"
                  value={newDeal.engagementModel}
                  onChange={e => setNewDeal({...newDeal, engagementModel: e.target.value as EngagementModel})}
                >
                  <option value="job">Job Pontual</option>
                  <option value="fee">Fee Mensal</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase mb-1">Produtos (separados por vírgula)</label>
              <input 
                className="w-full p-3 border-2 border-smart-black rounded-xl focus:ring-2 focus:ring-smart-green outline-none font-bold" 
                placeholder="Ex: Endomarketing, EVP, Branding"
                value={newDeal.productsStr}
                onChange={e => setNewDeal({...newDeal, productsStr: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-smart-black text-smart-white py-4 rounded-xl font-black uppercase hover:bg-smart-green hover:text-smart-black transition-all shadow-[6px_6px_0px_0px_rgba(49,216,137,1)] active:translate-y-1 active:shadow-none">
            Lançar no Pipeline
          </button>
        </form>
      </Modal>

      {/* Modal de Detalhamento Profundo */}
      {selectedDeal && (
        <DealDetailsModal 
          deal={selectedDeal}
          contacts={contacts}
          isOpen={!!selectedDeal}
          onClose={() => setSelectedDeal(null)}
          onUpdate={handleUpdateFromModal}
        />
      )}
    </div>
  );
};

export default Deals;
