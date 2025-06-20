// seeds/07_containers.js

export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('containers').del();

  // Inserts seed entries
  await knex('containers').insert([
    {
      container_number: 'ZCSU4028251',
      agent_id: 1,
      operator_id: 1,
      forwarder_id: 1,
      client_id: 1,
      forwarder_ref: 'REF001'
    },
    {
      container_number: 'MAEU1234567',
      agent_id: 2,
      operator_id: 2,
      forwarder_id: 2,
      client_id: 2,
      forwarder_ref: 'REF002'
    },
    {
      container_number: 'COSU9876543',
      agent_id: 3,
      operator_id: 3,
      forwarder_id: 3,
      client_id: 3,
      forwarder_ref: 'REF003'
    },
    {
      container_number: 'HLCU7654321',
      agent_id: 4,
      operator_id: 4,
      forwarder_id: 4,
      client_id: 4,
      forwarder_ref: 'REF004'
    },
    {
      container_number: 'NYKU5678901',
      agent_id: 5,
      operator_id: 5,
      forwarder_id: 5,
      client_id: 5,
      forwarder_ref: 'REF005'
    },
    {
      container_number: 'ZCSU4028222',
      agent_id: 1,
      operator_id: 1,
      forwarder_id: 1,
      client_id: 1,
      forwarder_ref: 'REF006'
    },
    {
      container_number: 'ZCSU4028233',
      agent_id: 1,
      operator_id: 1,
      forwarder_id: 1,
      client_id: 1,
      forwarder_ref: 'REF007'
    }
  ]);
}
