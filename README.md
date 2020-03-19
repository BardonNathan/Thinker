# Thinker
A small website to note some ideas and save it to a database

## NGinx
	NodeJS needs to be accessible via everybody. To use same port for the NodeJS server and the website, you can use the reverse proxy function. It is also available in Apache HTTPD but it is not seen here.

```
server {
	listen 80;
	listen [::]:80;

	server_name localhost;

	root /websiteRoot;

	location /api/ {
		proxy_pass http://localhost:44293;
	}
}
```

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
	- updated 		(ISODate) [optional]
	- checked		(boolean)
