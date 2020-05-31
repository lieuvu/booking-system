--booking_system (up)
CREATE TABLE IF NOT EXISTS building_address
(
    id          serial PRIMARY KEY,
    street      text NOT NULL,
    number      text,
    city        text NOT NULL,
    postal_code text NOT NULL,
    created_at  timestamp NOT NULL DEFAULT NOW(),
    updated_at  timestamp NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "user"
(
    id                  serial PRIMARY KEY,
    username            text NOT NULL,
    hashed_password     text NOT NULL,
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
    building_block_number   text,
    appartment_number       text,
    created_at              timestamp NOT NULL DEFAULT NOW(),
    updated_at              timestamp NOT NULL DEFAULT NOW(),

    FOREIGN KEY (user_id) REFERENCES "user" (id) ON UPDATE CASCADE,
    FOREIGN KEY (building_id) REFERENCES building_address (id) ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS machine
(
    id              serial PRIMARY KEY,
    building_id     integer,
    brand           text NOT NULL,
    model           text NOT NULL,
    description     text,
    number          smallint,
    type            text NOT NULL,
    created_at      timestamp NOT NULL DEFAULT NOW(),
    updated_at      timestamp NOT NULL DEFAULT NOW(),

    FOREIGN KEY (building_id) REFERENCES building_address (id) ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS booking
(
    id              serial PRIMARY KEY,
    user_id         integer NOT NULL,
    machine_id      integer NOT NULL,
    start_time      timestamp NOT NULL DEFAULT NOW(),
    end_time        timestamp NOT NULL DEFAULT NOW(),
    created_at      timestamp NOT NULL DEFAULT NOW(),
    updated_at      timestamp NOT NULL DEFAULT NOW(),

    FOREIGN KEY (user_id) REFERENCES "user" (id) ON UPDATE CASCADE,
    FOREIGN KEY (machine_id) REFERENCES machine (id) ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS quota
(
    id              serial PRIMARY KEY,
    user_id         integer NOT NULL,
    quota           smallint NOT NULL,
    valid_from      timestamp NOT NULL DEFAULT NOW(),
    valid_until     timestamp NOT NULL DEFAULT NOW(),
    created_at      timestamp NOT NULL DEFAULT NOW(),
    updated_at      timestamp NOT NULL DEFAULT NOW(),

    FOREIGN KEY (user_id) REFERENCES "user" (id) ON UPDATE CASCADE
);
