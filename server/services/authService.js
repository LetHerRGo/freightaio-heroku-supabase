import supabase from './supabase.js'
import jwt from "jsonwebtoken";
import "dotenv/config";

// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const authenticateUser = async (username, password) => {
  let user = null;
  let role = null;

  // Try agent_user
  let { data, error } = await supabase
    .from('agent_user')
    .select('*')
    .eq('username', username)
    .single();

  if (data) {
    user = data;
    role = 'agent';
  } else {
    ({ data, error } = await supabase
      .from('client_user')
      .select('*')
      .eq('username', username)
      .single());

    if (data) {
      user = data;
      role = 'client';
    } else {
      ({ data, error } = await supabase
        .from('forwarder_operator')
        .select('*')
        .eq('username', username)
        .single());

      if (data) {
        user = data;
        role = 'operator';
      }
    }
  }

  if (!user) {
    throw new Error('User not found');
  }

  if (user.password !== password) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role,
    },
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: '12h' }
  );

  return token;
};

export default authenticateUser;
