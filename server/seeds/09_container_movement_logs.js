// seeds/09_container_movement_logs.js

export async function seed(knex) {
  await knex('container_movement_logs')
    .whereIn('container_id', [1, 2, 3, 4, 5, 6, 7])
    .del();

  const logEntries = [
    {
      container_id: 1,
      location: 'Vancouver',
      event_description: 'Departed Port',
      event_time: '2025-05-15 10:00:00',
      customs_status: 'In Bond',
      destination: 'Montreal',
      ETA: '2025-05-20 08:00:00',
      storage_last_free_day: '2025-05-24',
      updated_at: '2025-05-18 16:30:00'
    },
    {
      container_id: 2,
      location: 'Toronto',
      event_description: 'Discharged',
      event_time: '2025-05-16 12:30:00',
      customs_status: 'Cleared',
      destination: 'Toronto',
      ETA: '2025-05-16 12:00:00',
      storage_last_free_day: '2025-05-25',
      updated_at: '2025-05-16 10:00:00'
    },
    {
      container_id: 3,
      location: 'Montreal',
      event_description: 'Hold for Docs',
      event_time: '2025-05-17 09:15:00',
      customs_status: 'Pending',
      destination: 'Montreal',
      ETA: '2025-05-22 14:00:00',
      storage_last_free_day: null,
      updated_at: '2025-05-20 09:00:00'
    },
    {
      container_id: 4,
      location: 'Halifax',
      event_description: 'Loaded on Truck',
      event_time: '2025-05-18 07:45:00',
      customs_status: 'Cleared',
      destination: 'Vancouver',
      ETA: '2025-05-19 10:00:00',
      storage_last_free_day: '2025-05-27',
      updated_at: '2025-05-18 15:30:00'
    },
    {
      container_id: 5,
      location: 'Calgary',
      event_description: 'On Rail',
      event_time: '2025-05-19 16:20:00',
      customs_status: 'In Bond',
      destination: 'Montreal',
      ETA: '2025-05-23 18:00:00',
      storage_last_free_day: null,
      updated_at: '2025-05-21 11:45:00'
    },
    {
      container_id: 6,
      location: 'Calgary',
      event_description: 'On Rail',
      event_time: '2025-05-19 16:20:00',
      customs_status: 'In Bond',
      destination: 'Toronto',
      ETA: '2025-06-02 18:00:00',
      storage_last_free_day: null,
      updated_at: '2025-05-30 09:20:00'
    },
    {
      container_id: 7,
      location: 'Toronto',
      event_description: 'On Rail',
      event_time: '2025-05-19 16:20:00',
      customs_status: 'In Bond',
      destination: 'Montreal',
      ETA: '2025-06-03 18:00:00',
      storage_last_free_day: null,
      updated_at: '2025-06-02 12:00:00'
    }
  ];

  await knex('container_movement_logs').insert(logEntries);
}
