-- DDL: базові таблиці
CREATE SCHEMA IF NOT EXISTS library;

SET search_path TO library;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- uuid looks like this: 123e4567-e89b-12d3-a456-426614174000
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL
);
