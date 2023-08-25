DROP TABLE wildfires_sizeG

	create table wildfires_sizeG (
		Fire_ID serial PRIMARY KEY,
		Agency_Type VARCHAR(100) NOT NULL,
		NWCG_Reporting_Agency VARCHAR(100) NOT NULL,
		Reporting_Unit_Name VARCHAR(100) NOT NULL,
		Fire_Name VARCHAR(100) NOT NULL,
		Year INT,
		Fire_Discovery_Date DATE,
		Date_Contained DATE,
		NWCG_Cause_Classification VARCHAR(100) NOT NULL,
		Cause_Description VARCHAR(100) NOT NULL,
		Fire_Size REAL,
		Latitude REAL,
		Longitude REAL,
		Fire_Origin_Land_Owner VARCHAR(100) NOT NULL,
		State VARCHAR(10) NOT NULL,
		County VARCHAR(50) NOT NULL
		);

DELETE FROM wildfires_sizeg WHERE year < 2000;


DELETE FROM wildfires_sizeg WHERE cause_description = 'Missing data not specified undetermined';


UPDATE wildfires_sizeg SET cause_description = REPLACE(cause_description, '/', ' ');


SELECT * FROM wildfires_sizeG;