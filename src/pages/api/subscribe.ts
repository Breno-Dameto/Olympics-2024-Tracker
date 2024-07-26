// src/pages/api/subscribe.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

type Data = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    const { data, error } = await supabase
      .from('subscribers')
      .insert([{ email }]);

    if (error) {
      console.error('Error:', error.message);
      return res.status(500).json({ message: 'Error subscribing' });
    }

    res.status(201).json({ message: 'Subscription successful' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
