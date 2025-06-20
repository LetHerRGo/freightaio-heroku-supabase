
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('agent_user').del();

  // Inserts seed entries
  await knex('agent_user').insert([
    {
      username: 'alpha_user',
      email: 'alpha@example.com',
      password: 'pass123',
      agent_id: 1
    },
    {
      username: 'bravo_user',
      email: 'bravo@example.com',
      password: 'pass123',
      agent_id: 2
    },
    {
      username: 'charlie_user',
      email: 'charlie@example.com',
      password: 'pass123',
      agent_id: 3
    },
    {
      username: 'delta_user',
      email: 'delta@example.com',
      password: 'pass123',
      agent_id: 4
    },
    {
      username: 'echo_user',
      email: 'echo@example.com',
      password: 'pass123',
      agent_id: 5
    }
  ]);
}
