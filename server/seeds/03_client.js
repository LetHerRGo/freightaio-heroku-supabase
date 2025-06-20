
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('client').del();

  // Inserts seed entries
  await knex('client').insert([
    { name: 'UAP Cambridge' },
    { name: 'UAP Montreal' },
    { name: 'UAP Calgary' },
    { name: 'UAP Edmonton' },
    { name: 'Other' }
  ]);
}
