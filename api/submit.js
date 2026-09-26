import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://ntvcgqbenpxfxvejxkoy.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_UxiIkEbCXmYA10M0f_PIoA_1j52p3gB';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Método não permitido' });
  }

  try {
    const body = req.body;

    const { data, error } = await supabase
      .from('comandas')
      .insert([
        {
          data: body.data,
          paciente: body.paciente || body.cliente,
          vendedor: body.vendedor,
          categoria: body.categoria,
          indicacao: body.indicacao,
          proximo_atendimento: body.proximo_atendimento,
          itens: body.itens,
          pagamentos: body.pagamentos,
          total: body.total,
          total_liquido: body.totalLiquido,
          status: body.status || 'Lançado pela Cabine'
        }
      ])
      .select();

    if (error) {
      console.error('Erro Supabase:', error);
      return res.status(500).json({ ok: false, error: error.message });
    }

    return res.status(200).json({ ok: true, data });
  } catch (err) {
    console.error('Erro Servidor:', err);
    return res.status(500).json({ ok: false, error: 'Erro interno no servidor' });
  }
}
