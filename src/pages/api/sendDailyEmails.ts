import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';
import { sendEmail } from '@/lib/mail';
import { ScheduleItem } from '@/types/apiTypes';
import { format, toZonedTime } from 'date-fns-tz';

const fetchSchedule = async (): Promise<ScheduleItem[]> => {
  const url = 'https://sph-s-api.olympics.com/summer/schedules/api/ENG/schedule/';
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();

  return data.units; 
};

const getTodayEvents = (events: ScheduleItem[]) => {
  const now = new Date();
  return events.filter(event => {
    const eventDate = new Date(event.startDate);
    return eventDate.toDateString() === now.toDateString(); // Filtra eventos do dia
  });
};

const getSubscribers = async () => {
  const { data, error } = await supabase.from('subscribers').select('email');
  if (error) {
    throw new Error(`Error fetching subscribers: ${error.message}`);
  }
  return data;
};

// Converte a data para o fuso horário local
const convertToTimezone = (date: Date, timezone: string) => {
  const zonedDate = toZonedTime(date, timezone); // Uso correto da função
  return format(zonedDate, 'dd/MM/yyyy HH:mm:ss'); // Remove a propriedade timeZone
};
// Gera uma tabela HTML com os eventos
const generateEmailBody = (events: ScheduleItem[]) => {
  const timezones: { [key: string]: string } = {
    'ENG': 'Europe/London',
    'USA': 'America/New_York',
    'BRA': 'America/Sao_Paulo',
    'JPN': 'Asia/Tokyo',
    'AUS': 'Australia/Sydney'
  };

  let tableHeaders = `<th>Event</th>`;
  Object.keys(timezones).forEach(country => {
    tableHeaders += `<th>${country} Time</th>`;
  });

  let tableRows = events.map(event => {
    const startDate = new Date(event.startDate);
    let row = `<td>${event.eventName}</td>`;
    Object.values(timezones).forEach(timezone => {
      const eventTime = convertToTimezone(startDate, timezone);
      row += `<td>${eventTime}</td>`;
    });

    return `<tr>${row}</tr>`;
  }).join('');

  return `
    <h1>Your Daily Olympic Games Update</h1>
    <p>Here are the games happening today:</p>
    <table border="1" cellpadding="5" cellspacing="0">
      <thead>
        <tr>
          ${tableHeaders}
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  `;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const events = await fetchSchedule(); // Obtém os eventos da API
    const todayEvents = getTodayEvents(events); // Filtra eventos do dia
    
    const subscribers = await getSubscribers(); // Obtém a lista de assinantes
    const emailPromises = subscribers.map(({ email }) => {
      const emailBody = generateEmailBody(todayEvents);

      return sendEmail(
        email,
        'Your Daily Olympic Games Update',
        emailBody
      ).catch(error => {
        console.error(`Error sending email to ${email}:`, error);
      });
    });

    await Promise.all(emailPromises); // Envia todos os e-mails

    res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ message: 'Error sending emails' });
  }
}
