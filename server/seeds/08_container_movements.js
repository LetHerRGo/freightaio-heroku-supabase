// seeds/08_container_movements.js

export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('container_movements').del();

  // Inserts seed entries
  await knex('container_movements').insert([
    {
      container_id: 1,
      status: 'In Transit',
      location: 'Vancouver',
      event_description: 'Departed Port',
      event_time: '2025-05-15 10:00:00',
      customs_status: 'In Bond',
      destination: 'Montreal',
      eta: '2025-05-20 08:00:00',
      storage_last_free_day: '2025-05-24'
    },
    {
      container_id: 2,
      status: 'Arrived',
      location: 'Toronto',
      event_description: 'Discharged',
      event_time: '2025-05-16 12:30:00',
      customs_status: 'Cleared',
      destination: 'Toronto',
      eta: '2025-05-16 12:00:00',
      storage_last_free_day: '2025-05-25'
    },
    {
      container_id: 3,
      status: 'Delayed',
      location: 'Montreal',
      event_description: 'Hold for Docs',
      event_time: '2025-05-17 09:15:00',
      customs_status: 'Pending',
      destination: 'Montreal',
      eta: '2025-05-22 14:00:00',
      storage_last_free_day: null
    },
    {
      container_id: 4,
      status: 'Executing',
      location: 'Halifax',
      event_description: 'Loaded on Truck',
      event_time: '2025-05-18 07:45:00',
      customs_status: 'Cleared',
      destination: 'Vancouver',
      eta: '2025-05-19 10:00:00',
      storage_last_free_day: '2025-05-27'
    },
    {
      container_id: 5,
      status: 'In Transit',
      location: 'Calgary',
      event_description: 'On Rail',
      event_time: '2025-05-19 16:20:00',
      customs_status: 'In Bond',
      destination: 'Montreal',
      eta: '2025-05-23 18:00:00',
      storage_last_free_day: null
    },
    {
      container_id: 6,
      status: 'In Transit',
      location: 'Calgary',
      event_description: 'On Rail',
      event_time: '2025-05-19 16:20:00',
      customs_status: 'In Bond',
      destination: 'Toronto',
      eta: '2025-06-02 18:00:00',
      storage_last_free_day: null
    },
    {
      container_id: 7,
      status: 'In Transit',
      location: 'Toronto',
      event_description: 'On Rail',
      event_time: '2025-05-19 16:20:00',
      customs_status: 'In Bond',
      destination: 'Montreal',
      eta: '2025-06-03 18:00:00',
      storage_last_free_day: null
    }
  ]);
}
