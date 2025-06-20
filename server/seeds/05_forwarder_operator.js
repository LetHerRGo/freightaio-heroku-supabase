// seeds/05_forwarder_operator.js

export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('forwarder_operator').del();

  // Inserts seed entries
  await knex('forwarder_operator').insert([
    {
      username: 'admin',
      email: 'admin@example.com',
      password: '123456',
      forwarder_id: 1
    },
    {
      username: 'fwd_op2',
      email: 'fwd2@example.com',
      password: 'pass123',
      forwarder_id: 2
    },
    {
      username: 'fwd_op3',
      email: 'fwd3@example.com',
      password: 'pass123',
      forwarder_id: 3
    },
    {
      username: 'fwd_op4',
      email: 'fwd4@example.com',
      password: 'pass123',
      forwarder_id: 4
    },
    {
      username: 'fwd_op5',
      email: 'fwd5@example.com',
      password: 'pass123',
      forwarder_id: 5
    }
  ]);
}
