
import React from 'react';
import { Icons } from '../constants';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Icons.Dashboard /> },
    { id: 'contacts', label: 'Contatos', icon: <Icons.Contacts /> },
    { id: 'deals', label: 'Negócios', icon: <Icons.Deals /> },
    { id: 'proposals', label: 'Propostas', icon: <Icons.Proposals /> },
    { id: 'tasks', label: 'Tarefas', icon: <Icons.Tasks /> },
  ];

  return (
    <aside className="w-64 bg-smart-black text-smart-white h-screen fixed left-0 top-0 flex flex-col z-20">
      <div className="p-8">
        <div className="flex items-center gap-2 mb-10">
            <div className="bg-smart-green w-8 h-8 rounded-sm flex items-center justify-center text-smart-black font-black text-xl">S</div>
            <span className="text-2xl font-black tracking-tighter italic">SMART</span>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                activeView === item.id 
                  ? 'bg-smart-green text-smart-black' 
                  : 'hover:bg-smart-darkGray text-gray-400 hover:text-smart-white'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8">
        <div className="p-4 bg-smart-darkGray rounded-xl border border-smart-green/20">
          <p className="text-xs text-smart-green mb-1 font-bold uppercase tracking-widest">Dica Smart</p>
          <p className="text-sm text-gray-300">Cuidado: Cliente com pressa detectado hoje. ☕️</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
