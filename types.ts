
export type DealStage = 'prospecting' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
export type DealTemperature = 'hot' | 'warm' | 'cold';
export type SaleType = 'normal' | 'upsell' | 'cross_sell';
export type EngagementModel = 'job' | 'fee';

export type JobLevel = 'C-Level' | 'Diretor' | 'Gerente' | 'Coordenador' | 'Supervisor' | 'Especialista' | 'Analista' | 'Consultor' | 'Outro';

export interface Contact {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  lastContact: string;
  jobLevel: JobLevel;
  status: 'active' | 'lead' | 'inactive';
}

export interface Deal {
  id: string;
  title: string;
  contactId: string;
  responsibleId: string;
  value: number;
  stage: DealStage;
  expectedCloseDate: string;
  products: string[];
  temperature: DealTemperature;
  saleType: SaleType;
  engagementModel: EngagementModel;
  description?: string;
}

export interface PriceListItem {
  id: string;
  description: string;
  size: 'P' | 'M' | 'G' | 'GG';
  value: number;
}

export interface ProposalItem {
  id: string;
  priceItemId: string;
  description: string;
  quantity: number;
  unitValue: number;
}

export interface Proposal {
  id: string;
  dealId: string;
  date: string;
  items: ProposalItem[];
  totalValue: number;
  status: 'draft' | 'sent' | 'accepted';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  assignedTo: string;
}

export interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
}

// Added missing TEAM_MEMBERS constant
export const TEAM_MEMBERS: User[] = [
  { 
    id: '1', 
    name: 'Estrategista Smart', 
    role: 'Líder de Negócios', 
    avatar: 'https://ui-avatars.com/api/?name=Estrategista+Smart&background=31D889&color=000', 
    email: 'estrategista@wearesmart.com.br' 
  }
];
