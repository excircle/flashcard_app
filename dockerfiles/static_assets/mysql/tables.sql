CREATE TABLE `domains` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `domain` VARCHAR(75) NOT NULL,
    `description` TEXT,
    PRIMARY KEY(`id`),
    KEY(`domain`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci ROW_FORMAT COMPRESSED;

CREATE TABLE `questions` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `question` TEXT NOT NULL,
    `answer` TEXT NOT NULL,
    `description` TEXT,
    `domain_id` INT NOT NULL,
    PRIMARY KEY(`id`),
    FOREIGN KEY (`domain_id`)
        REFERENCES domains(`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci ROW_FORMAT COMPRESSED;