
import React from 'react';
import { Deal, Contact, TEAM_MEMBERS, DealTemperature, SaleType, EngagementModel, DealStage } from '../types';
import { STAGES_LABELS } from '../constants';
import Modal from './Modal';

interface DealDetailsModalProps {
  deal: Deal;
  contacts: Contact[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedDeal: Deal) => void;
}

const DealDetailsModal: React.FC<DealDetailsModalProps> = ({ deal, contacts, isOpen, onClose, onUpdate }) => {
  const associatedContact = contacts.find(c => c.id === deal.contactId);
  const responsible = TEAM_MEMBERS.find(u => u.id === deal.responsibleId);

  const temperatures: { value: DealTemperature; label: string; icon: string; color: string }[] = [
    { value: 'hot', label: 'Tá pegando fogo! 🔥', icon: '🔥', color: 'bg-red-500' },
    { value: 'warm', label: 'Morno, tipo café ☕', icon: '☕', color: 'bg-orange-400' },
    { value: 'cold', label: 'Gelado (Chamem o RH) ❄️', icon: '❄️', color: 'bg-blue-400' },
  ];

  const handleUpdate = (updates: Partial<Deal>) => {
    onUpdate({ ...deal, ...updates });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Detalhamento: ${deal.title}`}>
      <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
        {/* Status e Estágio */}
        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-1">
             <label className="text-[10px] font-black uppercase text-gray-400">Estágio Atual</label>
             <select 
               className="w-full p-2 border-2 border-smart-black rounded-lg text-xs font-bold bg-white"
               value={deal.stage}
               onChange={(e) => handleUpdate({ stage: e.target.value as DealStage })}
             >
               {Object.entries(STAGES_LABELS).map(([key, label]) => (
                 <option key={key} value={key}>{label}</option>
               ))}
             </select>
           </div>
           <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400">Tipo de Negócio</label>
              <select 
                className="w-full p-2 border-2 border-smart-black rounded-lg text-xs font-bold bg-white"
                value={deal.engagementModel}
                onChange={(e) => handleUpdate({ engagementModel: e.target.value as EngagementModel })}
              >
                <option value="job">Jobão (Pontual)</option>
                <option value="fee">Casamento (Fee)</option>
              </select>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400">Temperatura</label>
            <select 
              className="w-full p-2 border-2 border-smart-black rounded-lg text-xs font-bold bg-white"
              value={deal.temperature}
              onChange={(e) => handleUpdate({ temperature: e.target.value as DealTemperature })}
            >
              {temperatures.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400">Valor do Brilho (R$)</label>
            <input 
              type="number"
              className="w-full p-2 border-2 border-smart-black rounded-lg text-xs font-bold"
              value={deal.value}
              onChange={(e) => handleUpdate({ value: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400">Estratégia de Venda</label>
            <select 
              className="w-full p-2 border-2 border-smart-black rounded-lg text-xs font-bold bg-white"
              value={deal.saleType}
              onChange={(e) => handleUpdate({ saleType: e.target.value as SaleType })}
            >
              <option value="normal">Nova Venda</option>
              <option value="upsell">Upsell</option>
              <option value="cross_sell">Cross Sell</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400">Responsável Smart</label>
            <select 
              className="w-full p-2 border-2 border-smart-black rounded-lg text-xs font-bold bg-white"
              value={deal.responsibleId}
              onChange={(e) => handleUpdate({ responsibleId: e.target.value })}
            >
              {TEAM_MEMBERS.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Produtos Section refined to match screenshot */}
        <div className="p-4 bg-white rounded-2xl border-2 border-smart-black">
          <div className="flex items-center gap-3 mb-3">
            {deal.products.map((p, i) => (
              <span key={i} className="bg-smart-black text-smart-white px-3 py-1.5 rounded-full font-black text-[10px] flex items-center gap-2">
                {p}
                <button 
                  onClick={() => handleUpdate({ products: deal.products.filter((_, idx) => idx !== i) })}
                  className="hover:text-smart-green font-bold text-xs"
                >x</button>
              </span>
            ))}
            <button 
              onClick={() => {
                const p = prompt('Qual produto adicionar?');
                if (p) handleUpdate({ products: [...deal.products, p] });
              }}
              className="text-[10px] font-black uppercase text-smart-green hover:opacity-80 transition-opacity"
            >+ ADICIONAR</button>
          </div>
          <textarea 
            placeholder="Algum insight genial para esse projeto?"
            className="w-full p-3 text-sm rounded-xl border-2 border-smart-black focus:outline-none focus:ring-1 focus:ring-smart-green h-20 font-medium bg-transparent"
            value={deal.description}
            onChange={(e) => handleUpdate({ description: e.target.value })}
          />
        </div>

        {/* Cliente Conectado Section refined to match screenshot highlight */}
        <div className="p-5 bg-white border-2 border-smart-black rounded-2xl">
           <label className="text-[10px] font-black uppercase text-gray-400 italic mb-3 block">CLIENTE CONECTADO</label>
           
           <div className="flex items-center gap-4 mb-5">
             <div className="w-12 h-12 rounded-full bg-smart-green flex items-center justify-center font-black text-lg border-2 border-smart-black text-smart-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
               {associatedContact?.name.charAt(0)}
             </div>
             <div>
               <p className="text-sm font-black text-smart-black leading-tight">{associatedContact?.name || 'Não vinculado'}</p>
               <p className="text-[10px] text-gray-500 font-black uppercase tracking-tight">{associatedContact?.company}</p>
             </div>
           </div>

           <select 
             className="w-full p-3 border-none rounded-xl text-xs font-bold text-smart-black bg-smart-gray outline-none focus:ring-2 focus:ring-smart-green/30"
             value={deal.contactId}
             onChange={(e) => handleUpdate({ contactId: e.target.value })}
           >
             {contacts.map(c => <option key={c.id} value={c.id}>{c.name} ({c.company})</option>)}
           </select>
        </div>

        <div className="pt-2">
           <button 
             onClick={onClose}
             className="w-full bg-smart-black text-smart-white py-4 rounded-2xl font-black uppercase text-sm hover:bg-smart-green hover:text-smart-black transition-all shadow-[6px_6px_0px_0px_rgba(49,216,137,1)] active:translate-y-1 active:shadow-none"
           >
             SALVAR & FECHAR
           </button>
        </div>
      </div>
    </Modal>
  );
};

export default DealDetailsModal;
