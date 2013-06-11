CREATE TABLE records (
	id				BIGINT(20)		NOT NULL	AUTO_INCREMENT,
	name			VARCHAR(63)		NOT NULL,
	type			VARCHAR(5)		NOT NULL,
	data			BLOB 			NOT NULL,

	PRIMARY KEY( id ),
	UNIQUE KEY( name, type )
);

CREATE TABLE users (
	id				BIGINT(20)		NOT NULL	AUTO_INCREMENT,
	username		VARCHAR(50)		NOT NULL,
	password		VARCHAR(32)		NOT NULL,
	PRIMARY KEY( id )
);

CREATE TABLE user_records (
	user_id			BIGINT(20)		NOT NULL,
	record_id		BIGINT(20)		NOT NULL,
	PRIMARY KEY( user_id ),
	UNIQUE KEY( user_id, record_id )
);