create database CardDB;

create table CardTable(
    card_id serial primary key,
    name text unique,
    designation text,
    phone text unique,
    whatsapp text unique,
    email text unique,
    linkedin text unique,
    profileImage text
);