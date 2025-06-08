import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    
    case 'GET':
      const { data: entradas, error } = await supabase.from('entradas').select('*');
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(entradas);

    case 'POST':
      const { nome, categoria, preco, data_venc, data_pag, user_ref } = req.body;
      const { data, error: insertError } = await supabase
        .from('entradas')
        .insert([{ nome, categoria, preco, data_venc, data_pag, user_ref }]);
      if (insertError) return res.status(500).json({ error: insertError.message });
      return res.status(201).json(data);

    case 'PUT':
      const { id, ...updateFields } = req.body;
      const { data: updated, error: updateError } = await supabase
        .from('entradas')
        .update(updateFields)
        .eq('id', id);
      if (updateError) return res.status(500).json({ error: updateError.message });
      return res.status(200).json(updated);

    case 'DELETE':
      const { deleteId } = req.body;
      const { error: deleteError } = await supabase.from('entradas').delete().eq('id', deleteId);
      if (deleteError) return res.status(500).json({ error: deleteError.message });
      return res.status(204).end();

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}