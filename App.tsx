
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Contacts from './components/Contacts';
import Deals from './components/Deals';
import Tasks from './components/Tasks';
import Proposals from './components/Proposals';
import { Contact, Deal, Task, User, DealStage, Proposal } from './types';
import { auth, googleProvider } from './firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';

const INITIAL_CONTACTS: Contact[] = [
  { id: '1', name: 'Juliana Silva', company: 'Ambev', email: 'juliana@ambev.com.br', phone: '(11) 98888-8888', lastContact: '20/10/2023', status: 'active', jobLevel: 'Diretor' },
  { id: '2', name: 'Rodrigo Costa', company: 'XP Inc', email: 'rodrigo@xp.com.br', phone: '(11) 97777-7777', lastContact: '18/10/2023', status: 'lead', jobLevel: 'Gerente' },
];

const INITIAL_DEALS: Deal[] = [
  { 
    id: '1', 
    title: 'Campanha Interna Q4', 
    contactId: '1', 
    responsibleId: 'me',
    value: 45000, 
    stage: 'proposal', 
    expectedCloseDate: '15/11/2023',
    products: ['Endomarketing', 'Criação Visual'],
    temperature: 'hot',
    saleType: 'normal',
    engagementModel: 'job',
    description: 'Campanha de reconhecimento para o time de vendas global.'
  },
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Validação de domínio restrita
        const userEmail = firebaseUser.email || '';
        if (!userEmail.endsWith('@wearesmart.com.br')) {
          await signOut(auth);
          setCurrentUser(null);
          setAuthError("Acesso negado. Utilize seu e-mail corporativo @wearesmart.com.br");
          alert('Acesso restrito a funcionários da Smart');
          setLoading(false);
          return;
        }

        const wasLoggedOut = !currentUser;
        setCurrentUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Usuário Smart',
          role: 'Estrategista Smart',
          avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.displayName}&background=31D889&color=000`
        });
        
        if (wasLoggedOut) {
          setActiveView('dashboard');
        }
        setAuthError(null);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    // Carregamento de dados locais
    const savedContacts = localStorage.getItem('smart_contacts');
    if (savedContacts) setContacts(JSON.parse(savedContacts));

    const savedDeals = localStorage.getItem('smart_deals');
    if (savedDeals) setDeals(JSON.parse(savedDeals));

    const savedTasks = localStorage.getItem('smart_tasks');
    if (savedTasks) setTasks(JSON.parse(savedTasks));

    const savedProposals = localStorage.getItem('smart_proposals');
    if (savedProposals) setProposals(JSON.parse(savedProposals));

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => { localStorage.setItem('smart_contacts', JSON.stringify(contacts)); }, [contacts]);
  useEffect(() => { localStorage.setItem('smart_deals', JSON.stringify(deals)); }, [deals]);
  useEffect(() => { localStorage.setItem('smart_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('smart_proposals', JSON.stringify(proposals)); }, [proposals]);

  const handleLogin = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Erro no login:", error);
      if (error.code === 'auth/unauthorized-domain') {
        setAuthError("Domínio não autorizado no Firebase. Adicione este endereço em Authorized Domains.");
      } else if (error.code === 'auth/popup-closed-by-user') {
        setAuthError("O login foi cancelado.");
      } else {
        setAuthError("Falha na conexão com o Google.");
      }
    }
  };

  const handleLogout = async () => {
    if (confirm('Deseja mesmo sair do escritório?')) {
      try {
        await signOut(auth);
        setCurrentUser(null);
      } catch (error) {
        console.error("Erro ao sair:", error);
      }
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-smart-black flex flex-col items-center justify-center">
         <div className="bg-smart-green w-16 h-16 rounded-sm flex items-center justify-center text-smart-black font-black text-4xl mb-6 animate-bounce shadow-[0_0_20px_rgba(49,216,137,0.5)]">S</div>
         <p className="text-smart-white font-black italic tracking-tighter uppercase text-xl">Preparando o escritório...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-smart-black flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-smart-white border-4 border-smart-green p-12 rounded-[40px] shadow-[20px_20px_0px_0px_rgba(49,216,137,1)] text-center animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-2 mb-10 justify-center">
            <div className="bg-smart-black w-12 h-12 rounded-sm flex items-center justify-center text-smart-green font-black text-3xl">S</div>
            <span className="text-4xl font-black tracking-tighter italic text-smart-black uppercase">SMART</span>
          </div>
          
          <h2 className="text-3xl font-black text-smart-black mb-4 uppercase italic tracking-tighter leading-none">Bem-vindo ao<br/>seu QG Digital.</h2>
          <p className="text-gray-500 font-bold text-sm mb-10 uppercase tracking-tight">O CRM feito para agências que brilham.</p>
          
          {authError && (
            <div className="mb-8 p-4 bg-red-50 border-2 border-red-500 rounded-2xl text-red-600 text-xs font-bold leading-tight animate-in fade-in slide-in-from-top-2">
              ⚠️ {authError}
            </div>
          )}

          <button 
            onClick={handleLogin} 
            className="w-full flex items-center justify-center gap-4 p-5 bg-smart-black text-smart-white border-2 border-smart-black rounded-3xl hover:bg-smart-green hover:text-smart-black transition-all group shadow-[10px_10px_0px_0px_rgba(49,216,137,1)] active:translate-y-1 active:shadow-none"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z" />
            </svg>
            <span className="font-black uppercase italic tracking-tighter text-lg">Entrar com Google</span>
          </button>
          
          <p className="mt-10 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Acesso restrito ao domínio @wearesmart.com.br</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-smart-white">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="pl-64 min-h-screen print:pl-0">
        <header className="h-32 border-b-2 border-smart-black bg-smart-white flex items-center justify-between px-10 sticky top-0 z-10 backdrop-blur-sm bg-white/90 print:hidden">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Smart CRM.</h1>
            <p className="text-[10px] font-black text-smart-green uppercase tracking-widest mt-1">Sua agência, seu controle, seu brilho.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
                <p className="font-black text-sm uppercase tracking-tight">{currentUser.name}</p>
                <button onClick={handleLogout} className="text-[10px] font-black text-red-500 uppercase hover:underline">Sair do Prédio</button>
            </div>
            <div className="relative">
              <img src={currentUser.avatar} className="w-14 h-14 rounded-full border-2 border-smart-black shadow-[4px_4px_0px_0px_rgba(49,216,137,1)]" alt="Profile" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-smart-green rounded-full border-2 border-smart-black"></div>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto print:p-0">
          {activeView === 'dashboard' && <Dashboard contacts={contacts} deals={deals} user={currentUser} />}
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
