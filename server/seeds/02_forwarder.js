// seeds/02_forwarder.js

export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('forwarder').del();

  // Inserts seed entries
  await knex('forwarder').insert([
    { name: 'UCMCANADA' },
    { name: 'UCMXM' },
    { name: 'UCMQD' },
    { name: 'UCMLAX' },
    { name: 'UCMSH' }
  ]);
}
