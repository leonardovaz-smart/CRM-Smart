
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Contacts from './components/Contacts';
import Deals from './components/Deals';
import Tasks from './components/Tasks';
import Proposals from './components/Proposals';
import { Contact, Deal, Task, TEAM_MEMBERS, User, DealStage, Proposal } from './types';

const INITIAL_CONTACTS: Contact[] = [
  { id: '1', name: 'Juliana Silva', company: 'Ambev', email: 'juliana@ambev.com.br', phone: '(11) 98888-8888', lastContact: '20/10/2023', status: 'active', jobLevel: 'Diretor' },
  { id: '2', name: 'Rodrigo Costa', company: 'XP Inc', email: 'rodrigo@xp.com.br', phone: '(11) 97777-7777', lastContact: '18/10/2023', status: 'lead', jobLevel: 'Gerente' },
  { id: '3', name: 'Fernanda Lima', company: 'Natura', email: 'fernanda@natura.net', phone: '(11) 96666-6666', lastContact: '22/10/2023', status: 'active', jobLevel: 'C-Level' },
];

const INITIAL_DEALS: Deal[] = [
  { 
    id: '1', 
    title: 'Campanha Interna Q4', 
    contactId: '1', 
    responsibleId: '1',
    value: 45000, 
    stage: 'proposal', 
    expectedCloseDate: '15/11/2023',
    products: ['Endomarketing', 'Criação Visual'],
    temperature: 'hot',
    saleType: 'normal',
    engagementModel: 'job',
    description: 'Campanha de reconhecimento para o time de vendas global.'
  },
  { 
    id: '2', 
    title: 'Employer Branding Review', 
    contactId: '2', 
    responsibleId: '2',
    value: 25000, 
    stage: 'negotiation', 
    expectedCloseDate: '30/10/2023',
    products: ['Consultoria de EVP'],
    temperature: 'warm',
    saleType: 'upsell',
    engagementModel: 'fee',
    description: 'Revisão semestral do posicionamento de marca empregadora.'
  },
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('smart_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    
    const savedContacts = localStorage.getItem('smart_contacts');
    if (savedContacts) setContacts(JSON.parse(savedContacts));

    const savedDeals = localStorage.getItem('smart_deals');
    if (savedDeals) setDeals(JSON.parse(savedDeals));

    const savedTasks = localStorage.getItem('smart_tasks');
    if (savedTasks) setTasks(JSON.parse(savedTasks));

    const savedProposals = localStorage.getItem('smart_proposals');
    if (savedProposals) setProposals(JSON.parse(savedProposals));
  }, []);

  useEffect(() => { localStorage.setItem('smart_contacts', JSON.stringify(contacts)); }, [contacts]);
  useEffect(() => { localStorage.setItem('smart_deals', JSON.stringify(deals)); }, [deals]);
  useEffect(() => { localStorage.setItem('smart_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('smart_proposals', JSON.stringify(proposals)); }, [proposals]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('smart_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('smart_user');
  };

  const onAddContact = (newContact: Contact) => setContacts(prev => [...prev, newContact]);
  const onUpdateContact = (updatedContact: Contact) => {
    setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c));
  };
  
  const onAddDeal = (newDeal: Deal) => setDeals(prev => [...prev, newDeal]);
  const onUpdateDeal = (updatedDeal: Deal) => {
    setDeals(prev => prev.map(d => d.id === updatedDeal.id ? updatedDeal : d));
  };
  const onAddTask = (newTask: Task) => setTasks(prev => [...prev, newTask]);
  
  const onMoveDeal = (dealId: string, newStage: DealStage) => {
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, stage: newStage } : d));
  };

  const onToggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const onAddProposal = (newProposal: Proposal) => {
    setProposals(prev => [newProposal, ...prev]);
    setDeals(prevDeals => prevDeals.map(deal => {
      if (deal.id === newProposal.dealId) {
        return { ...deal, value: newProposal.totalValue, stage: 'proposal' };
      }
      return deal;
    }));
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-smart-black flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-smart-white border-2 border-smart-green p-10 rounded-3xl shadow-[10px_10px_0px_0px_rgba(49,216,137,1)]">
          <div className="flex items-center gap-2 mb-8 justify-center">
            <div className="bg-smart-black w-10 h-10 rounded-sm flex items-center justify-center text-smart-green font-black text-2xl">S</div>
            <span className="text-3xl font-black tracking-tighter italic text-smart-black uppercase">SMART</span>
          </div>
          <h2 className="text-2xl font-black text-center mb-2 uppercase italic tracking-tighter">Entrar no Smart CRM</h2>
          <div className="space-y-4 mt-6">
            {TEAM_MEMBERS.map(user => (
              <button key={user.id} onClick={() => handleLogin(user)} className="w-full flex items-center gap-4 p-4 border-2 border-smart-black rounded-2xl hover:bg-smart-green hover:border-smart-green transition-all group">
                <img src={user.avatar} className="w-12 h-12 rounded-full border-2 border-smart-black" alt={user.name} />
                <div className="text-left">
                  <p className="font-black group-hover:text-smart-black">{user.name}</p>
                  <p className="text-xs text-gray-500 font-bold uppercase">{user.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-smart-white">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="pl-64 min-h-screen print:pl-0">
        <header className="h-32 border-b-2 border-smart-black bg-smart-white flex items-center justify-between px-10 sticky top-0 z-10 backdrop-blur-sm bg-white/90 print:hidden">
          <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Boas-vindas ao novo escritório da Smart.</h1>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
                <p className="font-black text-sm uppercase">{currentUser.name}</p>
                <button onClick={handleLogout} className="text-[10px] font-bold text-red-500 uppercase hover:underline">Sair do Prédio</button>
            </div>
            <img src={currentUser.avatar} className="w-12 h-12 rounded-full border-2 border-smart-black" alt="Profile" />
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto print:p-0">
          {activeView === 'dashboard' && <Dashboard contacts={contacts} deals={deals} />}
          {activeView === 'contacts' && <Contacts contacts={contacts} onAddContact={onAddContact} onUpdateContact={onUpdateContact} />}
          {activeView === 'deals' && <Deals deals={deals} contacts={contacts} onAddDeal={onAddDeal} onUpdateDeal={onUpdateDeal} onMoveDeal={onMoveDeal} />}
          {activeView === 'proposals' && <Proposals deals={deals} contacts={contacts} proposals={proposals} onAddProposal={onAddProposal} />}
          {activeView === 'tasks' && <Tasks tasks={tasks} onAddTask={onAddTask} onToggleTask={onToggleTask} />}
        </div>
      </main>
    </div>
  );
};

export default App;
