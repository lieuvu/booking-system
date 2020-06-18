--booking_system (up)
CREATE TABLE IF NOT EXISTS building_address
(
    id              serial PRIMARY KEY,
    street          text NOT NULL,
    number          text,
    block_number    text,
    postal_code     text NOT NULL,
    city            text NOT NULL,
    created_at      timestamp NOT NULL DEFAULT NOW(),
    updated_at      timestamp NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "user"
(
    id                  serial PRIMARY KEY,
    first_name          text NOT NULL,
    last_name           text NOT NULL,
    hash_password       text NOT NULL,
    salt                text NOT NULL,
    email               text UNIQUE NOT NULL,
    role                text NOT NULL,
    created_at          timestamp NOT NULL DEFAULT NOW(),
    updated_at          timestamp NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_address
(
    id                      serial PRIMARY KEY,
    user_id                 integer NOT NULL,
    building_id             integer NOT NULL,
    apartment_number        text NOT NULL,
    created_at              timestamp NOT NULL DEFAULT NOW(),
    updated_at              timestamp NOT NULL DEFAULT NOW(),

    FOREIGN KEY (user_id) REFERENCES "user" (id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (building_id) REFERENCES building_address (id) ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS machine_type
(
    id              serial PRIMARY KEY,
    type            text UNIQUE NOT NULL,
    created_at      timestamp NOT NULL DEFAULT NOW(),
    updated_at      timestamp NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS machine
(
    id              serial PRIMARY KEY,
    machine_type_id integer NOT NULL,
    brand           text NOT NULL,
    model           text NOT NULL,
    description     text,
    created_at      timestamp NOT NULL DEFAULT NOW(),
    updated_at      timestamp NOT NULL DEFAULT NOW(),

    FOREIGN KEY (machine_type_id) REFERENCES machine_type (id) ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS machine_location
(
    id              serial PRIMARY KEY,
    machine_id      integer NOT NULL,
    building_id     integer NOT NULL,
    number          smallint,
    status          text NOT NULL,
    created_at      timestamp NOT NULL DEFAULT NOW(),
    updated_at      timestamp NOT NULL DEFAULT NOW(),

    FOREIGN KEY (machine_id) REFERENCES machine (id) ON UPDATE CASCADE,
    FOREIGN KEY (building_id) REFERENCES building_address (id) ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS booking
(
    id              serial PRIMARY KEY,
    user_id         integer NOT NULL,
    machine_id      integer NOT NULL,
    start_time      timestamp NOT NULL DEFAULT NOW(),
    end_time        timestamp NOT NULL DEFAULT NOW(),
    status          text NOT NULL DEFAULT 'active',
    created_at      timestamp NOT NULL DEFAULT NOW(),
    updated_at      timestamp NOT NULL DEFAULT NOW(),

    FOREIGN KEY (user_id) REFERENCES "user" (id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (machine_id) REFERENCES machine (id) ON UPDATE CASCADE
);
