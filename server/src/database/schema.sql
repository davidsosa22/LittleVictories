drop database if exists little_victories;
create database little_victories;
use little_victories;

grant all on *.* to 'root'@'localhost' with grant option;

create table Users (
  id varchar(36) primary key,
  username varchar(25) not null,
  hash text not null,
  createdAt datetime not null,
  updatedAt datetime not null,
  points int not null default 0,
  level int not null default 0,
  readable_font bool not null default false
);

create table Habits (
	id int primary key auto_increment,
  user_id varchar(36) not null,
  description varchar(50) not null,
  frequency enum('daily', 'weekly', 'monthly') not null,
  days_of_week varchar(11),
  calendar_date int,
  is_complete bool not null default false,
  createdAt datetime not null,
  updatedAt datetime not null,
  foreign key (user_id) references Users(id)
);

create table Lists (
	id int primary key auto_increment,
  name varchar(15),
  createdAt datetime not null,
  updatedAt datetime not null
);

create table Tasks (
	id int primary key auto_increment,
  user_id varchar(36) not null,
	description varchar(150) not null,
  due_date date,
  minutes_to_complete int not null,
  is_important bool not null,
  is_complete bool,
  completed_at date,
  is_public bool not null default false,
  list_id int,
  createdAt datetime not null,
  updatedAt datetime not null,
  foreign key (list_id) references Lists(id),
  foreign key (user_id) references Users(id)
);

create Table Likes (
  id int primary key auto_increment,
  user_id varchar(36) not null,
  task_id int not null,
  createdAt datetime not null,
  updatedAt datetime not null,
  foreign key (user_id) references Users(id),
  foreign key (task_id) references Tasks(id)
);

create table Comments (
	id int primary key auto_increment,
  user_id varchar(36) not null,
	task_id int not null,
  content varchar(50) not null,
  createdAt datetime not null,
  updatedAt datetime not null,
  foreign key (user_id) references Users(id),
  foreign key (task_id) references Tasks(id)
);

create table JournalEntries (
	id int primary key auto_increment,
	user_id varchar(36) not null,
  createdAt datetime not null default now(),
  updatedAt datetime,
  content text not null,
  date varchar(10) not null,
  foreign key (user_id) references Users(id)
);

create table UserStats (
	id int primary key auto_increment,
	user_id varchar(36) not null,
  createdAt datetime not null default now(),
  updatedAt datetime,
  sleep_hours int,
  eaten_well bool,
  exercised bool,
  notes varchar(150),
  date varchar(10) not null,
  mood enum('great', 'good', 'ok', 'bad', 'terrible'),
  foreign key (user_id) references Users(id)
);

create table Friends (
	id int primary key auto_increment,
	user_id varchar(36) not null,
  friend_id varchar(36) not null,
  createdAt datetime not null default now(),
  updatedAt datetime not null default now(),
  foreign key (user_id) references Users(id),
  foreign key (friend_id) references Users(id)
);


/* run from project root
/* mysql -u root < server/src/database/schema.sql
