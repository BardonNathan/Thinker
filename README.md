# Thinker
A small website to note some ideas and save it to a database

## Structure of MongoDB collections

 - projects
 	- name 			(string)
 	- categories 	(string array)
 	
 - ideas
 	- name 			(string)
 	- project 		(ObjectId string)
 	- category 		(string)
 	- urgency 		(integer)
 	- importancy 	(integer)
 	- author 		(string)
 	- date 			(ISODate)
 	- updated 		(ISODate)