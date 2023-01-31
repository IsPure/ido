-- users  table
CREATE TABLE users(
    user_id SERIAL primary key, 
    email VARCHAR(255) UNIQUE not null,
    password VARCHAR(255) not null,
    created_at date default current_date
);
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at date default current_date
);
CREATE TABLE guests (
  id SERIAL,
  guest_or_family_name VARCHAR(255) NOT NULL,
  number_of_guests INT NOT NULL, 
  address VARCHAR(500),
  rsvp_status BOOLEAN DEFAULT false, 
  invite_sent BOOLEAN DEFAULT false,
  std_sent BOOLEAN DEFAULT false,
  user_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);