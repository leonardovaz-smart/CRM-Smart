
import React from 'react';
import { PriceListItem } from './types';

export const Icons = {
  Dashboard: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  Contacts: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Deals: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Proposals: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Tasks: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  Add: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
};

export const STAGES_LABELS: Record<string, string> = {
  prospecting: 'Prospecção',
  proposal: 'Proposta Enviada',
  negotiation: 'Em Negociação',
  closed_won: 'Fechado (Uhul!)',
  closed_lost: 'Perdido (Próximo!)'
};

export const SMART_PRICE_LIST: PriceListItem[] = [
  // Novos itens baseados no PDF de Consultoria
  { id: 'c1', description: 'Desk Research e imersão estratégica', size: 'G', value: 30000.00 },
  { id: 'c2', description: 'Pesquisa & Design de EVP (C-Level + Workshops)', size: 'GG', value: 90000.00 },
  { id: 'c3', description: 'Diagnóstico da Jornada (Heatmap de Personas)', size: 'G', value: 45000.00 },
  { id: 'c4', description: 'Employer Branding Playbook (Guia Completo)', size: 'GG', value: 50000.00 },
  
  // Itens clássicos da agência
  { id: '1', description: 'Anúncio impresso', size: 'G', value: 2160.00 },
  { id: '2', description: 'Apresentação PPT - criação de 1 a 4 slides', size: 'M', value: 1080.00 },
  { id: '3', description: 'Cartilha ou Guia – formato PDF, até 20 pgs', size: 'G', value: 8640.00 },
  { id: '4', description: 'GIF animado – alta complexidade', size: 'G', value: 2520.00 },
  { id: '5', description: 'KV – criação de sistema visual estratégico', size: 'GG', value: 8190.00 },
  { id: '6', description: 'Logo ou selo (1 versão)', size: 'G', value: 2340.00 },
  { id: '7', description: 'Post carrossel estático – até 4 telas', size: 'M', value: 1620.00 },
  { id: '8', description: 'Site de baixa complexidade – até 3 pgs', size: 'G', value: 3871.12 },
  { id: '9', description: 'Vídeo de alta complexidade (até 6 min)', size: 'G', value: 9360.00 },
  { id: '10', description: 'Infográfico – alta complexidade', size: 'G', value: 5760.00 }
];

export const PROPOSAL_TERMS = `
Calculamos esta proposta com base no valor dos salários das equipes e na estimativa de horas que serão dedicadas aos projetos aprovados. Com a experiência de mais de 20 anos de operação, gerimos nossos custos e margens para manter uma empresa saudável, capaz de oferecer o melhor para nossos clientes. Pagamos salários e benefícios do mercado, trabalhamos estritamente dentro das leis tributárias. Portanto, os valores dos fees mensais cotados já contemplam a margem de segurança necessária para operar.

- Não estão inclusos nos valores apresentados nesta proposta despesas como viagens, deslocamentos da equipe, produção e acompanhamento de sessões de foto ou vídeo, produção de brindes, manuseio de kits, logística de correio e entregas, cachês, desenvolvimento de sites, blog e plataformas de conteúdo, verba de impulsionamento para posts, gestão de crises, ferramentas de redes sociais e ferramentas de disparo de newsletters.
- As despesas extras aprovadas pela contratante podem ser apresentadas para reembolso por meio de Nota de Débito com os comprovantes anexados ou por NFe de serviços com os devidos tributos calculados.
- No caso de pagamentos de terceiros via Smart, será cobrada a taxa administrativa de 15%.
- As notas fiscais são enviadas até o dia 10 de cada mês, com 30 dias para pagamento.
- Os pagamentos podem ser recebidos por meio de transferência bancária ou por boleto.
`;
