-- Data to building_address table
INSERT INTO building_address (street, number, block_number, postal_code, city)
VALUES
  ('Siltakuja', '2', 'A', '02330', 'Espoo'),
  ('Arentikuja', '1', 'C', '00410', 'Helsinki'),
  ('Juusintie', '5', 'D', '02700', 'Kauniainen'),
  ('Helmikuja', '6', 'H', '01600', 'Vantaa'),
  ('Helmikuja', '6', 'B', '01600', 'Vantaa'),
  ('Pitäjänmäentie', '13', NULL, '00370', 'Helsinki');

-- Data to user table
-- Password John abjh12#%doe
-- Password Lisa lisacondor
-- Password Andrey, Taha and Paullina a3!o2&b
INSERT INTO "user" (first_name, last_name, hash_password, salt, email, role)
VALUES
  ('John', 'Doe',
   'PMuKKiW0KxLKbxvItIpA519bMV2aZ1c5n8QXjaa6nn4MFZXI/xmvfsAbiNw3hMVKVxIXlm4VNLI8yJhx9NxGqg==', 'iLscOZABzEx9CnTbXe',
   'john.doe@test.com', 'test'),
  ('Lisa', 'Condor',
   'GfnAnCK1LPVcUYRfTkZuoCZrmuGcI1jUv3VKLXf70UhXJM+cpcfsOj0UXk5sYDZpqtszLN/xahCbKD+8rBNy6Q==', '9MPoQGJ8RgE2R1gecr',
   'lisa.condor@test.com', 'test'),
  ('Andrey', 'Oleinicov',
   'X1Qx6iaIeMOieegrwcfgz7+6DI7mD5kRIPJUxg9zwT5G54MHmn3B62zf6PuLcuxgPHYa254HfdGtlzhuhQ5d6Q==', '64BMglrHqZEd14W+WV',
   'andrey.oleinicov@test.com', 'test'),
   ('Taha', 'Kachwala',
    'X1Qx6iaIeMOieegrwcfgz7+6DI7mD5kRIPJUxg9zwT5G54MHmn3B62zf6PuLcuxgPHYa254HfdGtlzhuhQ5d6Q==', '64BMglrHqZEd14W+WV',
    'taha.kachwala@test.com', 'test'),
   ('Pauliina', 'Kivimäki',
    'X1Qx6iaIeMOieegrwcfgz7+6DI7mD5kRIPJUxg9zwT5G54MHmn3B62zf6PuLcuxgPHYa254HfdGtlzhuhQ5d6Q==', '64BMglrHqZEd14W+WV',
    'pauliina.kivimäki@test.com', 'test');

-- Data to user_address table
INSERT INTO user_address (user_id, building_id, apartment_number)
VALUES
  (1, 3, '7'),
  (4, 1, '12'),
  (5, 3, '6');

--  Data to machine_type table
INSERT INTO machine_type (type)
VALUES
  ('Washing Machine'),
  ('Dryer'),
  ('Dry Cleaning Machine'),
  ('Unknown');

--  Data to machine table
INSERT INTO machine (machine_type_id, brand, model, description)
VALUES
  (1, 'Taplet', 'T130', 'Taplet washing machine T130'),
  (1, 'Taplet', 'T131', 'Taplet washing machine T131'),
  (2, 'Taplet', 'T320', 'Taplet drying machine T320'),
  (1, 'Electrolux', 'E680', 'Electrolux washing machine E680'),
  (1, 'Electrolux', 'E680', 'Electrolux washing machine E680'),
  (2, 'Bosh', 'B570', 'Bosh drying machine B570'),
  (2, 'Electrolux', 'E850', 'Electrolux drying machine E850'),
  (1, 'Bosh', 'B890', 'Bosh washing machine B890');

--  Data to machine_location table
INSERT INTO machine_location (machine_id, building_id, number, status)
VALUES
  (1, 1, 1, 'active'),
  (2, 1, 2, 'active'),
  (3, 1, 3, 'broken'),
  (4, 2, 1, 'active');
