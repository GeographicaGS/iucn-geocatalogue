-- DROP TABLE data."user";
-- DROP TABLE data.profile;
-- DROP TABLE data.layer_keyword;
-- DROP TABLE data.layer;
-- DROP SCHEMA data;

CREATE SCHEMA data;

CREATE TABLE data.profile
(
  id serial NOT NULL,
  name character varying(128),
  CONSTRAINT profile_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

CREATE TABLE data."user"
(
  id serial NOT NULL,
  id_profile integer NOT NULL,
  name character varying(255),
  surname character varying(255),
  password character varying(64),
  email character varying(255),
  CONSTRAINT user_pkey PRIMARY KEY (id),
  CONSTRAINT user_id_profile_fkey FOREIGN KEY (id_profile)
      REFERENCES data.profile (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT user_unique_email UNIQUE (email)
)
WITH (
  OIDS=FALSE
);

CREATE TABLE data.layer
(
  id serial NOT NULL,
  id_code_num character varying(255),
  department character varying(100) NOT NULL,
  theme character varying(100) NOT NULL,
  subtheme character varying(100),
  family character varying(100),
  name character varying(255) NOT NULL,
  filetype character varying(100) NOT NULL,
  crs character varying(50) NOT NULL,
  extension character varying(100) NOT NULL,
  scale character varying(10),
  review_date date NOT NULL,
  edition_date date NOT NULL,
  summary text NOT NULL,
  project_name character varying(255) NOT NULL,
  source text NOT NULL,
  publication text,
  link text NOT NULL,
  bounding_box character varying(100),
  data_responsible character varying(255) NOT NULL,
  metadata_responsible character varying(255) NOT NULL,
  language character varying(50) NOT NULL,
  access_limitation text NOT NULL,
  other_info text,
  CONSTRAINT "LAYER_PK" PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

CREATE TABLE data.layer_keyword
(
  id bigserial NOT NULL,
  id_layer integer,
  keyword character varying(100),
  CONSTRAINT "PK_LAYER_KEYWORD" PRIMARY KEY (id),
  CONSTRAINT "FK_LAYER_KEYWORD_LAYER" FOREIGN KEY (id_layer)
      REFERENCES data.layer (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);

INSERT INTO data.profile(id, name)
  VALUES (1, 'Lector');
INSERT INTO data.profile(id, name)
  VALUES (3, 'Administador');
