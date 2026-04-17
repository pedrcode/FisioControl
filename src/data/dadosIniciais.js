// src/data/dadosIniciais.js

export const PACIENTES_INICIAIS = []

export const ATENDIMENTOS_INICIAIS = []

export const TIPOS_TRATAMENTO = [
  // Ortopédica / Traumato-funcional
  'Cinesioterapia',
  'Terapia Manual',
  'Mobilização Articular',
  'Manipulação Articular',
  'Alongamento Terapêutico',
  'Fortalecimento Muscular',
  'RPG',
  'Pilates Clínico',
  'Treinamento Funcional',
  'Liberação Miofascial',

  // Eletrotermofototerapia
  'TENS',
  'FES',
  'Ultrassom Terapêutico',
  'Laserterapia',
  'Ondas Curtas',
  'Micro-ondas',
  'Corrente Russa',
  'Corrente Interferencial',
  'Crioterapia',
  'Termoterapia',

  // Neurológica
  'Bobath',
  'Kabat (FNP)',
  'Rood',
  'Integração Sensorial',
  'Treino de Marcha',
  'Reabilitação Neuromuscular',

  // Respiratória
  'Drenagem Postural',
  'Percussão Torácica',
  'Vibração Torácica',
  'Exercícios Respiratórios',
  'Espirometria de Incentivo',
  'Higiene Brônquica',

  // Desportiva
  'Prevenção de Lesões',
  'Reabilitação Esportiva',
  'Treinamento Proprioceptivo',

  // Dermatofuncional
  'Drenagem Linfática',
  'Massagem Modeladora',
  'Radiofrequência',
  'Endermoterapia',
  'Ultracavitação',

  // Pélvica
  'Treinamento do Assoalho Pélvico',
  'Biofeedback',
  'Eletroestimulação Pélvica',

  // Geriátrica
  'Treino de Equilíbrio',
  'Treino de Marcha (Geriátrico)',
  'Prevenção de Quedas',

  // Outras abordagens
  'Acupuntura',
  'Dry Needling',
  'Hidroterapia',
  'Equoterapia',
  'Bandagem Funcional',
  'Kinesiotaping',

  // Extras comuns em sistema
  'Avaliação Inicial',
  'Outro',
];

// Formata data: '2024-04-01' → '01/04/2024'
export function formatarData(dateStr) {
  if (!dateStr) return '';
  const [ano, mes, dia] = dateStr.split('-');
  return `${dia}/${mes}/${ano}`;
}

// Retorna hoje no formato 'AAAA-MM-DD'
export function hojeISO() {
  return new Date().toISOString().split('T')[0];
}