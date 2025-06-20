// seeds/06_client_user.js

export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('client_user').del();

  // Inserts seed entries
  await knex('client_user').insert([
    {
      username: 'client_red_user',
      email: 'red@example.com',
      password: 'pass123',
      client_id: 1
    },
    {
      username: 'client_blue_user',
      email: 'blue@example.com',
      password: 'pass123',
      client_id: 2
    },
    {
      username: 'client_green_user',
      email: 'green@example.com',
      password: 'pass123',
      client_id: 3
    },
    {
      username: 'client_yellow_user',
      email: 'yellow@example.com',
      password: 'pass123',
      client_id: 4
    },
    {
      username: 'client_black_user',
      email: 'black@example.com',
      password: 'pass123',
      client_id: 5
    }
  ]);
}
