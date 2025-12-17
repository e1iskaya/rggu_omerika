CREATE TABLE `educationalResources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`description` text,
	`resourceType` varchar(100),
	`content` text,
	`accessLevel` enum('public','registered','expert') NOT NULL DEFAULT 'public',
	`fileUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `educationalResources_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `eliteConnections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eliteId1` int NOT NULL,
	`eliteId2` int NOT NULL,
	`connectionType` varchar(100) NOT NULL,
	`description` text,
	`strength` int DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `eliteConnections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `eliteOrganizations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eliteId` int NOT NULL,
	`organizationId` int NOT NULL,
	`role` varchar(255),
	`startDate` varchar(50),
	`endDate` varchar(50),
	`isCurrent` enum('yes','no') NOT NULL DEFAULT 'yes',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `eliteOrganizations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `elites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`dateOfBirth` varchar(50),
	`education` text,
	`careerPath` text,
	`currentPositions` json,
	`pastPositions` json,
	`politicalOrientation` varchar(100),
	`sphereOfInfluence` varchar(255),
	`netWorth` decimal(15,2),
	`biography` text,
	`publicStatements` text,
	`foreignPolicyPositions` text,
	`imageUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `elites_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`description` text,
	`eventType` varchar(100),
	`startDate` timestamp NOT NULL,
	`endDate` timestamp,
	`location` varchar(255),
	`registrationUrl` varchar(500),
	`recordingUrl` varchar(500),
	`status` enum('upcoming','ongoing','completed') NOT NULL DEFAULT 'upcoming',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `expertAccessRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`affiliation` text,
	`researchInterests` text,
	`justification` text,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`reviewedAt` timestamp,
	`reviewedBy` int,
	CONSTRAINT `expertAccessRequests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `newsletterSubscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255),
	`subscribedAt` timestamp NOT NULL DEFAULT (now()),
	`isActive` enum('yes','no') NOT NULL DEFAULT 'yes',
	CONSTRAINT `newsletterSubscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsletterSubscriptions_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` varchar(100) NOT NULL,
	`description` text,
	`founded` varchar(50),
	`headquarters` varchar(255),
	`marketCap` decimal(15,2),
	`revenue` decimal(15,2),
	`employees` int,
	`lobbyingSpending` decimal(15,2),
	`politicalDonations` decimal(15,2),
	`foreignPolicyPositions` text,
	`logoUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `organizations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `politicalDecisions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`type` varchar(100) NOT NULL,
	`category` varchar(100),
	`description` text,
	`dateEnacted` timestamp,
	`administration` varchar(100),
	`keyPlayers` json,
	`lobbyingInfluence` text,
	`impact` text,
	`documentUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `politicalDecisions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`slug` varchar(500) NOT NULL,
	`excerpt` text,
	`content` text,
	`category` varchar(100),
	`author` varchar(255),
	`publishDate` timestamp NOT NULL,
	`imageUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `publications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`authors` text,
	`publicationType` varchar(100),
	`publicationDate` timestamp,
	`journal` varchar(255),
	`abstract` text,
	`url` varchar(500),
	`pdfUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `publications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`type` varchar(100) NOT NULL,
	`summary` text,
	`content` text,
	`accessLevel` enum('public','registered','expert') NOT NULL DEFAULT 'public',
	`publishDate` timestamp NOT NULL,
	`author` varchar(255),
	`pdfUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('guest','user','expert','admin') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `affiliation` text;--> statement-breakpoint
ALTER TABLE `users` ADD `researchInterests` text;