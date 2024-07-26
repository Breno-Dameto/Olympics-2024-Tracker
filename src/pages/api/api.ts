import { ScheduleItem } from '@/types/apiTypes'; // Ajuste o caminho conforme necessário

export async function fetchSchedule(noc: string): Promise<ScheduleItem[]> {
  // Construa a URL com o código NOC fornecido
  const url = `https://sph-s-api.olympics.com/summer/schedules/api/ENG/schedule/noc/${noc}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  
  // Verifique a estrutura dos dados retornados
  console.log('API Response:', data);

  // Ajuste se necessário, baseado na estrutura real dos dados
  return data.units; // ou data.groups, dependendo de onde os dados estão
}
