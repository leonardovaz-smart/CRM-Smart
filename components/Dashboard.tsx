
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Contact, Deal, DealStage, DealTemperature, SaleType } from '../types';
import { STAGES_LABELS } from '../constants';

interface DashboardProps {
  contacts: Contact[];
  deals: Deal[];
}

const Dashboard: React.FC<DashboardProps> = ({ contacts, deals }) => {
  // 1. Valor por Estágio
  const valueByStage = Object.keys(STAGES_LABELS).map(stageKey => {
    const total = deals
      .filter(d => d.stage === stageKey)
      .reduce((sum, d) => sum + d.value, 0);
    return { name: STAGES_LABELS[stageKey], value: total };
  });

  // 2. Valor por Temperatura (Quente e Morno)
  const hotValue = deals.filter(d => d.temperature === 'hot').reduce((sum, d) => sum + d.value, 0);
  const warmValue = deals.filter(d => d.temperature === 'warm').reduce((sum, d) => sum + d.value, 0);

  // 3. Valor por Tipo de Venda
  const saleTypeData = [
    { name: 'Nova Venda', value: deals.filter(d => d.saleType === 'normal').reduce((sum, d) => sum + d.value, 0) },
    { name: 'Upsell', value: deals.filter(d => d.saleType === 'upsell').reduce((sum, d) => sum + d.value, 0) },
    { name: 'Cross Sell', value: deals.filter(d => d.saleType === 'cross_sell').reduce((sum, d) => sum + d.value, 0) },
  ];

  // 4. Receita por Produto
  const productRevenue: Record<string, number> = {};
  deals.forEach(deal => {
    deal.products.forEach(product => {
      productRevenue[product] = (productRevenue[product] || 0) + deal.value;
    });
  });
  const productData = Object.entries(productRevenue)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const formatCurrency = (val: number) => `R$ ${val.toLocaleString('pt-BR')}`;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* KPIs Térmicos e Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-smart-green p-6 border-2 border-smart-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-[10px] font-black uppercase text-smart-black tracking-widest">Pipeline Total</p>
          <p className="text-2xl font-black mt-1">{formatCurrency(deals.reduce((acc, d) => acc + d.value, 0))}</p>
        </div>
        <div className="bg-smart-black text-smart-white p-6 border-2 border-smart-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(49,216,137,1)]">
          <p className="text-[10px] font-black uppercase text-smart-green tracking-widest">Negócios Quentes 🔥</p>
          <p className="text-2xl font-black mt-1 text-smart-green">{formatCurrency(hotValue)}</p>
        </div>
        <div className="bg-smart-white p-6 border-2 border-smart-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Mornos (No café) ☕</p>
          <p className="text-2xl font-black mt-1">{formatCurrency(warmValue)}</p>
        </div>
        <div className="bg-smart-white p-6 border-2 border-smart-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Contratos Fechados</p>
          <p className="text-2xl font-black mt-1">
            {deals.filter(d => d.stage === 'closed_won').length} / {deals.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico 1: Valor por Estágio */}
        <div className="bg-smart-white p-8 rounded-2xl border-2 border-smart-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-xl font-black mb-6 uppercase italic tracking-tighter">Dinheiro no Funil por Estágio</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={valueByStage} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#EEE" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #31D889', color: '#FFF' }} 
                />
                <Bar dataKey="value" fill="#31D889" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Mix de Vendas (Upsell vs Cross vs Normal) */}
        <div className="bg-smart-black text-smart-white p-8 rounded-2xl border-2 border-smart-black">
          <h3 className="text-xl font-black mb-6 uppercase italic tracking-tighter">Mix de Vendas (Receita)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={saleTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#31D889" />
                  <Cell fill="#FFF" />
                  <Cell fill="#555" />
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {saleTypeData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-smart-green' : i === 1 ? 'bg-white' : 'bg-gray-600'}`}></div>
                <span className="text-[10px] font-bold uppercase">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabela de Produtos que Mais Brilham */}
      <div className="bg-smart-white p-8 rounded-2xl border-2 border-smart-black shadow-[10px_10px_0px_0px_rgba(49,216,137,1)]">
        <h3 className="text-2xl font-black mb-8 uppercase italic tracking-tighter flex items-center gap-2">
          Rank de Produtos
          <span className="text-xs bg-smart-green px-2 py-1 rounded text-smart-black not-italic">Onde está o Brilho?</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productData.map((prod, i) => (
            <div key={i} className="flex items-center justify-between p-4 border-b-2 border-smart-gray last:border-0 hover:bg-smart-gray transition-colors rounded-lg">
              <div>
                <span className="text-[10px] font-black text-gray-400 block uppercase">#{i + 1}</span>
                <p className="font-black text-lg">{prod.name}</p>
              </div>
              <p className="font-black text-smart-green">{formatCurrency(prod.value)}</p>
            </div>
          ))}
          {productData.length === 0 && <p className="text-gray-400 font-bold italic">Nenhum produto cadastrado ainda...</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
