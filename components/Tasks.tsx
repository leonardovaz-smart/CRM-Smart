
import React, { useState } from 'react';
import { Task, TEAM_MEMBERS } from '../types';
import Modal from './Modal';

interface TasksProps {
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onToggleTask: (taskId: string) => void;
}

const Tasks: React.FC<TasksProps> = ({ tasks, onAddTask, onToggleTask }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask({
      id: Math.random().toString(36).substr(2, 9),
      title,
      description: 'Tarefa criada via CRM',
      dueDate: 'Hoje',
      priority: 'medium',
      completed: false,
      assignedTo: '1'
    });
    setIsModalOpen(false);
    setTitle('');
  };

  return (
    <div className="bg-smart-white border-2 border-smart-black rounded-2xl p-8 animate-in zoom-in-95 duration-500">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none">To-do list da Brilhância</h2>
          <p className="text-gray-500 font-medium mt-1">Menos reuniões, mais execução.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-smart-black text-smart-white px-6 py-3 rounded-full font-black uppercase text-sm hover:bg-smart-green hover:text-smart-black transition-all"
        >
          Nova Tarefa
        </button>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => {
          const user = TEAM_MEMBERS.find(u => u.id === task.assignedTo);
          return (
            <div 
              key={task.id} 
              className={`flex items-center gap-6 p-5 border-2 rounded-2xl transition-all cursor-pointer ${
                task.completed ? 'bg-smart-gray border-transparent opacity-60' : 'bg-white border-smart-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
              }`}
              onClick={() => onToggleTask(task.id)}
            >
              <div className={`w-6 h-6 rounded border-2 border-smart-black flex items-center justify-center transition-colors ${task.completed ? 'bg-smart-green' : 'bg-white'}`}>
                {task.completed && <span className="text-smart-black text-xs">✓</span>}
              </div>
              <div className="flex-grow">
                <h4 className={`text-lg font-black ${task.completed ? 'line-through' : ''}`}>{task.title}</h4>
                <p className="text-sm text-gray-500 font-medium">{task.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full border border-smart-black" />
                <div className="text-right min-w-[80px]">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight italic">Prazo</p>
                    <p className="text-xs font-black">{task.dueDate}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Missão Inteligente">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase mb-1">O que precisa ser feito?</label>
            <input 
              required
              className="w-full p-4 border-2 border-smart-black rounded-2xl outline-none focus:ring-2 focus:ring-smart-green" 
              placeholder="Ex: Arrasar na apresentação..."
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-smart-black text-smart-white py-4 rounded-xl font-black uppercase hover:bg-smart-green hover:text-smart-black transition-all">
            Adicionar à Lista
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Tasks;
