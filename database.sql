
CREATE TABLE users (
  user_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_email VARCHAR(255) UNIQUE NOT NULL,
  user_password VARCHAR(255) NOT NULL,
  created_at DATE DEFAULT current_date
);
CREATE TABLE guests (
  guest_id SERIAL,
  guest_name VARCHAR(255) NOT NULL,
  guest_number INT NOT NULL, 
  address VARCHAR(500),
  rsvp_status BOOLEAN DEFAULT false, 
  invite_sent BOOLEAN DEFAULT false,
  std_sent BOOLEAN DEFAULT false,
  user_id UUID,
  PRIMARY KEY (guest_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);