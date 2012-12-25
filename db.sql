CREATE TABLE IF NOT EXISTS `records` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(63) NOT NULL,
  `type` varchar(5) NOT NULL,
  `data` blob NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`domain`,`name`,`type`)
);