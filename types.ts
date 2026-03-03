
export type Status = 'Crítico' | 'Atención' | 'Vigente' | 'Pendiente' | 'Validado' | 'En Curso' | 'Atrasado';

export interface KPIData {
  title: string;
  icon: string;
  val: string;
  sub: string;
  color: 'green' | 'red' | 'orange' | 'purple' | 'blue' | 'yellow';
  desc?: string;
  special?: boolean;
}

export interface Permit {
  id: string;
  name: string;
  dept: string;
  date: string;
  status: Status;
  color: string;
}

export interface Commitment {
  id: string;
  description: string;
  source: string;
  responsible: string;
  deadline: string;
  status: Status;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
