import type { Context, Next } from 'hono';
import { supabase } from '../../supabase/supabaseClient';

export const authMiddleware = async (c: Context, next: Next) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return c.json({ message: 'Missing authentication token' }, 401);
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return c.json({ message: 'Invalid or expired token' }, 401);
  }

  // Récupération des informations utilisateur dans la base de données
  const { data: userData, error: userError } = await supabase
    .from('utilisateur')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (userError || !userData) {
    return c.json({ message: 'Utilisateur introuvable' }, 401);
  }

  // Vérification si l'utilisateur est un pharmacien
  if (userData.role === 'pharmacien') {
    const { data: pharmacienData, error: pharmacienError } = await supabase
      .from('pharmacien')
      .select('*')
      .eq('utilisateur_id', userData.id)
      .single();

    if (pharmacienError || !pharmacienData) {
      return c.json({ message: 'Les informations du pharmacien sont incomplètes' }, 403);
    }

    // Vérification des champs obligatoires pour un pharmacien
    if (!pharmacienData.cartePro || !pharmacienData.diplome) {
      return c.json({ message: 'Carte professionnelle et diplôme sont obligatoires pour les pharmaciens' }, 403);
    }
  }

  c.set('user', userData);
  await next();
};
