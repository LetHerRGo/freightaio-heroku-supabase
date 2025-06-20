// seeds/01_agent.js

export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('agent').del();

  // Inserts seed entries
  await knex('agent').insert([
    { name: 'ONQG' },
    { name: 'SSSG' },
    { name: 'FISG' },
    { name: 'SISG' },
    { name: 'ETSG' }
  ]);
}
