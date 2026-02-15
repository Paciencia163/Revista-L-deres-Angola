import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Create admin user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@revistalideresangola.com',
      password: '12345678',
      email_confirm: true,
    });

    if (authError && !authError.message.includes('already been registered')) {
      throw authError;
    }

    let userId = authData?.user?.id;

    if (!userId) {
      // User already exists, find them
      const { data: users } = await supabaseAdmin.auth.admin.listUsers();
      const existing = users?.users?.find(u => u.email === 'admin@revistalideresangola.com');
      userId = existing?.id;
    }

    if (userId) {
      // Assign admin role
      const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .upsert({ user_id: userId, role: 'admin' }, { onConflict: 'user_id,role' });

      if (roleError) throw roleError;
    }

    return new Response(JSON.stringify({ success: true, userId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
