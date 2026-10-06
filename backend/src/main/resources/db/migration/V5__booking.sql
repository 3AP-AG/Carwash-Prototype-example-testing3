-- Wash appointments booked by customers.
create table booking (
  id                uuid primary key,
  wash_programme    text not null check (wash_programme in ('BASIC', 'COMFORT', 'PREMIUM')),
  appointment_date  date not null,
  appointment_time  time not null,
  customer_name     text not null,
  licence_plate     text not null,
  created_at        timestamptz not null default now()
);

create index booking_appointment_ix on booking (appointment_date, appointment_time);
