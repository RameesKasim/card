create database CardDB;

create table CardTable(
    card_id serial primary key,
    name text unique ,
    designation text,
    phone text unique,
    phonetwo text,
    email text unique,
    linkedin text unique,
    profileImage text
);