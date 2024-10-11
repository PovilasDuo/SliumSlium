DROP TABLE IF EXISTS UserJobOffer;
DROP TABLE IF EXISTS Part;
DROP TABLE IF EXISTS JobOffer;
DROP TABLE IF EXISTS [User];

CREATE TABLE [User]
(
	name varchar (255),
	email varchar (255),
	password varchar (255),
	type int,
	id_User int IDENTITY(1,1),
	PRIMARY KEY(id_User)
);

CREATE TABLE JobOffer
(
	validDate date,
	name varchar (255),
	description varchar (255),
	salary int,
	creationDate date,
	companyName varchar (255),
	location varchar (255),
	workEnvironment int,
	experienceLevel int,
	partTime bit,
	id_JobOffer int IDENTITY(1,1),
	fk_Userid_User int NOT NULL,
	PRIMARY KEY(id_JobOffer),
	CONSTRAINT Creates FOREIGN KEY(fk_Userid_User) REFERENCES [User] (id_User)
);

CREATE TABLE Part
(
	name varchar (255),
	description varchar (255),
	requiresFiles bit,
	id_Part int IDENTITY(1,1),
	fk_JobOfferid_JobOffer int NOT NULL,
	PRIMARY KEY(id_Part),
	CONSTRAINT ConsistsOf FOREIGN KEY(fk_JobOfferid_JobOffer) REFERENCES JobOffer (id_JobOffer)
);

CREATE TABLE UserJobOffer
(
	status varchar (255),
	applicationDate date,
	currentPart int,
	id_UserJobOffer int IDENTITY(1,1),
	fk_JobOfferid_JobOffer int NOT NULL,
	fk_Userid_User int NOT NULL,
	PRIMARY KEY(id_UserJobOffer),
	FOREIGN KEY(fk_JobOfferid_JobOffer) REFERENCES JobOffer (id_JobOffer),
	CONSTRAINT Applies FOREIGN KEY(fk_Userid_User) REFERENCES [User] (id_User)
);

/// Example job offers //// 
INSERT INTO [User] (name, email, password, type)
VALUES 
    ('John Doe', 'john.doe@example.com', 'password123', 1),
    ('Jane Smith', 'jane.smith@example.com', 'password456', 1),
    ('Recruiter Mike', 'mike.recruiter@example.com', 'password789', 1);


INSERT INTO JobOffer (validDate, name, description, salary, creationDate, companyName, location, workEnvironment, experienceLevel, partTime, fk_Userid_User)
VALUES 
    ('2024-12-31', 'Software Developer', 'Looking for a full-stack software developer to join our team.', 70000, '2024-09-30', 'TechCorp', 'New York', 1, 2, 0, 1),
    ('2024-12-15', 'Marketing Manager', 'Seeking a dynamic marketing manager for an international campaign.', 60000, '2024-09-28', 'MarketMinds', 'Chicago', 2, 3, 0, 2),
    ('2024-11-30', 'Data Analyst', 'We need a data analyst to support our data science team.', 55000, '2024-09-27', 'DataGen', 'San Francisco', 3, 2, 1, 3);

INSERT INTO Part (name, description, requiresFiles, fk_JobOfferid_JobOffer)
VALUES 
    ('Upload CV', 'Upload your latest resume.', 1, 1),
    ('Technical Task', 'Complete a coding challenge.', 1, 1),
    ('Phone Interview', 'Participate in a phone interview with the technical team.', 0, 1),
    ('Final Interview', 'Attend an on-site or video interview.', 0, 1);

INSERT INTO Part (name, description, requiresFiles, fk_JobOfferid_JobOffer)
VALUES 
    ('Upload Portfolio', 'Submit your marketing portfolio.', 1, 2),
    ('Creative Task', 'Complete a marketing case study.', 1, 2),
    ('Phone Interview', 'Phone interview with the hiring manager.', 0, 2),
    ('Panel Interview', 'Attend a panel interview.', 0, 2);

INSERT INTO Part (name, description, requiresFiles, fk_JobOfferid_JobOffer)
VALUES 
    ('Upload CV', 'Upload your resume.', 1, 3),
    ('Data Analysis Task', 'Complete a data analysis task using provided data.', 1, 3),
    ('Phone Interview', 'Phone interview with the data science team.', 0, 3),
    ('Final Interview', 'On-site interview with the senior management.', 0, 3);
