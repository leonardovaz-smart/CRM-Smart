
import React, { useState } from 'react';
import { Contact, JobLevel } from '../types';
import { Icons } from '../constants';
import Modal from './Modal';

interface ContactsProps {
  contacts: Contact[];
  onAddContact: (contact: Contact) => void;
  onUpdateContact: (contact: Contact) => void;
}

const JOB_LEVELS: JobLevel[] = ['C-Level', 'Diretor', 'Gerente', 'Coordenador', 'Supervisor', 'Especialista', 'Analista', 'Consultor', 'Outro'];

const Contacts: React.FC<ContactsProps> = ({ contacts, onAddContact, onUpdateContact }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    company: '', 
    email: '', 
    phone: '', 
    status: 'lead' as Contact['status'],
    jobLevel: 'Analista' as JobLevel
  });

  const filtered = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddContact({
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      lastContact: 'Hoje',
      status: formData.status,
      jobLevel: formData.jobLevel
    });
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingContact) {
      onUpdateContact({
        ...editingContact,
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
        jobLevel: formData.jobLevel
      });
      setEditingContact(null);
      resetForm();
    }
  };

  const startEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      company: contact.company,
      email: contact.email,
      phone: contact.phone || '',
      status: contact.status,
      jobLevel: contact.jobLevel || 'Analista'
    });
  };

  const resetForm = () => {
    setFormData({ name: '', company: '', email: '', phone: '', status: 'lead', jobLevel: 'Analista' });
  };

  return (
    <div className="bg-smart-white border-2 border-smart-black rounded-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b-2 border-smart-black bg-smart-black text-smart-white flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold italic tracking-tighter uppercase">Nossa Rede de Brilhantes</h2>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Buscar por nome ou empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-smart-darkGray border border-smart-green text-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-smart-green/50 transition-all"
          />
        </div>
        <button 
          onClick={() => { resetForm(); setIsAddModalOpen(true); }}
          className="bg-smart-green text-smart-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-white transition-colors"
        >
          <Icons.Add /> Novo Contato
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-smart-gray text-smart-black font-black uppercase text-xs">
              <th className="px-6 py-4">Nome / Cargo</th>
              <th className="px-6 py-4">Empresa</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Último Contato</th>
              <th className="px-6 py-4 text-center">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-smart-gray">
            {filtered.map((contact) => (
              <tr key={contact.id} className="hover:bg-smart-green/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-smart-black text-smart-white flex items-center justify-center font-black text-sm uppercase border-2 border-smart-green/20">
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-sm">{contact.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-smart-black text-smart-green rounded">{contact.jobLevel || 'Analista'}</span>
                        <p className="text-[10px] text-gray-500 font-medium">{contact.email}</p>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-black uppercase text-xs tracking-tight">{contact.company}</td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full border ${
                    contact.status === 'active' ? 'border-smart-green text-smart-green' : 'border-gray-400 text-gray-400'
                  }`}>
                    {contact.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-gray-400">{contact.lastContact}</td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => startEdit(contact)}
                    className="text-[10px] font-black uppercase text-smart-black bg-smart-green/20 px-3 py-1 rounded-lg hover:bg-smart-green hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all opacity-0 group-hover:opacity-100"
                  >
                    Editar Perfil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Contact Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Novo Integrante da Rede" maxWidth="max-w-xl">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <ContactFormFields formData={formData} setFormData={setFormData} />
          <button type="submit" className="w-full bg-smart-black text-smart-white py-4 rounded-xl font-black uppercase hover:bg-smart-green hover:text-smart-black transition-all shadow-[6px_6px_0px_0px_rgba(49,216,137,1)] active:translate-y-1 active:shadow-none">
            Salvar Contato
          </button>
        </form>
      </Modal>

      {/* Edit Contact Modal */}
      <Modal isOpen={!!editingContact} onClose={() => setEditingContact(null)} title="Atualizar Brilhante" maxWidth="max-w-xl">
        <form onSubmit={handleUpdateSubmit} className="space-y-4">
          <ContactFormFields formData={formData} setFormData={setFormData} />
          <button type="submit" className="w-full bg-smart-green text-smart-black py-4 rounded-xl font-black uppercase hover:bg-smart-black hover:text-smart-white transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none">
            Atualizar Perfil ✨
          </button>
        </form>
      </Modal>
    </div>
  );
};

const ContactFormFields = ({ formData, setFormData }: { formData: any, setFormData: any }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Nome Completo</label>
        <input 
          required
          className="w-full p-3 border-2 border-smart-black rounded-xl outline-none focus:ring-2 focus:ring-smart-green font-bold text-sm" 
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
        />
      </div>
      <div>
        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Nível do Cargo</label>
        <select 
          required
          className="w-full p-3 border-2 border-smart-black rounded-xl outline-none focus:ring-2 focus:ring-smart-green font-bold text-sm bg-white" 
          value={formData.jobLevel}
          onChange={e => setFormData({...formData, jobLevel: e.target.value as JobLevel})}
        >
          {JOB_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
        </select>
      </div>
    </div>

    <div>
      <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Empresa</label>
      <input 
        required
        className="w-full p-3 border-2 border-smart-black rounded-xl outline-none focus:ring-2 focus:ring-smart-green font-bold text-sm" 
        value={formData.company}
        onChange={e => setFormData({...formData, company: e.target.value})}
      />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">E-mail Corporativo</label>
        <input 
          required
          type="email"
          className="w-full p-3 border-2 border-smart-black rounded-xl outline-none focus:ring-2 focus:ring-smart-green font-bold text-sm" 
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})}
        />
      </div>
      <div>
        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Telefone / WhatsApp</label>
        <input 
          className="w-full p-3 border-2 border-smart-black rounded-xl outline-none focus:ring-2 focus:ring-smart-green font-bold text-sm" 
          placeholder="(00) 00000-0000"
          value={formData.phone}
          onChange={e => setFormData({...formData, phone: e.target.value})}
        />
      </div>
    </div>

    <div>
      <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Status de Relacionamento</label>
      <select 
        className="w-full p-3 border-2 border-smart-black rounded-xl outline-none bg-white font-bold text-sm"
        value={formData.status}
        onChange={e => setFormData({...formData, status: e.target.value as any})}
      >
        <option value="lead">Lead (Frio ❄️)</option>
        <option value="active">Ativo (Brilhando ✨)</option>
        <option value="inactive">Inativo (Em pausa ☕)</option>
      </select>
    </div>
  </div>
);

export default Contacts;
