create database CardDB;

create table CardTable(
    card_id serial primary key,
    username text,
    designation text,
    phone text unique,
    phonetwo text,
    email text unique,
    linedin text unique,
    profileImage text
)