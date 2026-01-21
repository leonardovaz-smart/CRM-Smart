
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { Contact, Deal, User } from '../types';
import { STAGES_LABELS } from '../constants';

interface DashboardProps {
  contacts: Contact[];
  deals: Deal[];
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ contacts, deals, user }) => {
  // Dados do Funil
  const funnelData = Object.keys(STAGES_LABELS).map(stageKey => {
    const total = deals
      .filter(d => d.stage === stageKey)
      .reduce((sum, d) => sum + d.value, 0);
    return { name: STAGES_LABELS[stageKey], value: total };
  });

  // KPIs
  const pipelineTotal = deals.reduce((acc, d) => acc + d.value, 0);
  const hotValue = deals.filter(d => d.temperature === 'hot').reduce((sum, d) => sum + d.value, 0);
  const conversionRate = deals.length > 0 
    ? Math.round((deals.filter(d => d.stage === 'closed_won').length / deals.length) * 100) 
    : 0;
  const avgTicket = deals.length > 0 ? pipelineTotal / deals.length : 0;

  // Distribuição por Produto
  const productRevenue: Record<string, number> = {};
  deals.forEach(deal => {
    deal.products.forEach(product => {
      productRevenue[product] = (productRevenue[product] || 0) + (deal.value / deal.products.length);
    });
  });
  const productData = Object.entries(productRevenue)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const formatCurrency = (val: number) => `R$ ${val.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`;

  const COLORS = ['#31D889', '#000000', '#F4F4F4', '#555555', '#31D889AA'];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Saudação de Impacto */}
      <div>
        <h2 className="text-6xl font-black italic tracking-tighter uppercase leading-none">
          E aí, {user.name.split(' ')[0]}!
        </h2>
        <div className="flex items-center gap-3 mt-4">
          <p className="text-xl font-bold text-gray-500">Pronto para fazer a Smart brilhar hoje?</p>
          <span className="animate-bounce">✨</span>
        </div>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-smart-green p-8 border-4 border-smart-black rounded-[32px] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
          <p className="text-[10px] font-black uppercase text-smart-black tracking-widest mb-1 opacity-60">Pipeline Total</p>
          <p className="text-4xl font-black italic leading-none">{formatCurrency(pipelineTotal)}</p>
        </div>
        
        <div className="bg-smart-black text-smart-white p-8 border-4 border-smart-black rounded-[32px] shadow-[10px_10px_0px_0px_rgba(49,216,137,1)] hover:-translate-y-1 transition-transform">
          <p className="text-[10px] font-black uppercase text-smart-green tracking-widest mb-1">Negócios Quentes 🔥</p>
          <p className="text-4xl font-black italic leading-none text-smart-green">{formatCurrency(hotValue)}</p>
        </div>

        <div className="bg-white p-8 border-4 border-smart-black rounded-[32px] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Conversão</p>
          <p className="text-4xl font-black italic leading-none">{conversionRate}%</p>
        </div>

        <div className="bg-smart-gray p-8 border-4 border-smart-black rounded-[32px] shadow-[10px_10px_0px_0px_rgba(49,216,137,0.4)] hover:-translate-y-1 transition-transform">
          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Ticket Médio</p>
          <p className="text-4xl font-black italic leading-none">{formatCurrency(avgTicket)}</p>
        </div>
      </div>

      {/* Gráficos Detalhados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gráfico de Barras: Funil */}
        <div className="bg-white p-10 rounded-[48px] border-4 border-smart-black shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-2xl font-black mb-8 uppercase italic tracking-tighter border-b-4 border-smart-green inline-block">Funil de Vendas</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E5E5" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={140} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#000' }} 
                  axisLine={false} 
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: '#31D88922' }} 
                  contentStyle={{ borderRadius: '16px', border: '2px solid black', fontWeight: 'bold' }}
                  formatter={(value: number) => [formatCurrency(value), 'Valor']}
                />
                <Bar dataKey="value" radius={[0, 10, 10, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === funnelData.length - 2 ? '#31D889' : '#000000'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Pizza: Produtos */}
        <div className="bg-white p-10 rounded-[48px] border-4 border-smart-black shadow-[15px_15px_0px_0px_rgba(49,216,137,1)]">
          <h3 className="text-2xl font-black mb-8 uppercase italic tracking-tighter border-b-4 border-smart-black inline-block">Foco de Brilho (Produtos)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {productData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={2} stroke="#000" />
                  ))}
                </Pie>
                <Tooltip 
                   formatter={(value: number) => [formatCurrency(value), 'Receita']}
                   contentStyle={{ borderRadius: '16px', border: '2px solid black', fontWeight: 'bold' }}
                />
                <Legend 
                  layout="vertical" 
                  align="right" 
                  verticalAlign="middle" 
                  iconType="rect"
                  formatter={(value) => <span className="text-[10px] font-black uppercase text-smart-black">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tira de Destaque Final */}
      <div className="bg-smart-black p-6 rounded-[32px] border-4 border-smart-green flex items-center justify-between text-smart-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-smart-green text-smart-black flex items-center justify-center font-black text-xl">!</div>
          <p className="font-black uppercase italic tracking-tight">Dica do dia: Se o lead esfriar, aqueça com uma apresentação impecável. ☕️</p>
        </div>
        <div className="text-[10px] font-black text-smart-green uppercase tracking-widest opacity-50">#WeAreSmart</div>
      </div>
    </div>
  );
};

export default Dashboard;
