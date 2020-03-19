"use strict";

/* ============================================
 *  Thinker server
 *
 *  Author: BARDON Nathan <nbardon@lazyfox.fr>
 *  Date: March 2020
 * ============================================
 *
 * NGinx configuration :

server {
    listen 80;
    listen [::]:80;

    server_name localhost;
        
    root /websiteRoot;

    location /api/ {
        proxy_pass http://localhost:44293;
    }
}

 */

const http 			= require("http");
const MongoClient 	= require('mongodb').MongoClient;

// ----------------------------------------------------------------
// Config
var srv = {
	addr : "localhost",
	port : 44293,
	uriPrefix : "/api"
};

var db = {
	user : "thinker",
	pass :"FLFE7MMaJ2NSfQdf21Qu9NqCYobLug2zAZ2jqFG4",
	db   : "thinker",
	addr : "127.0.0.1",

	collProjects: 	"projects",
	collIdeas: 		"ideas"
};

// ----------------------------------------------------------------
// Web server
srv.server = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/json');


	// ================== GET METHOD ==================
	if (req.method == "GET") {
		console.log(`[${new Date()}] Received GET ${req.url}`)
		
		// ########## GET PROJECTS ##########
		if (req.url == `${srv.uriPrefix}/projects/`) {
			db.cProjects.find({}).toArray((err, arr) => {
				if (err != null) {
					console.error(err);
					res.end('{"error":"Error while listing projects."}');
					return;
				}

				res.end(JSON.stringify(arr));
			});

			return;
		}

		// ########## GET IDEAS ##########
		else if (req.url.startsWith(`${srv.uriPrefix}/ideas/`)) {
			let args = req.url.split("/");
			if (args.length <= 4) {
				res.statusCode = 400;
				res.end('{"error":"Bad request"}');
				return;
			}

			db.cIdeas.find({project: args[3], category: args[4]})
				.sort([["urgency", -1], ["important", -1]])
				.toArray((err, arr) => {
				if (err != null) {
					console.error(err);
					res.end('{"error":"Error while listing ideas."}');
					return;
				}

				res.end(JSON.stringify(arr));
			});
			
			return;
		}
		res.statusCode = 404;
		res.end('{"error":"Unknown collection"}');
		console.log(req.url);
	}
	// ================== POST METHOD ==================
});




// ----------------------------------------------------------------
// Main, Database connection and server.listen()
(() => {

	console.log("Connecting to database...");
	const mongoC = new MongoClient("mongodb://"+db.user+":"+db.pass + "@" + db.addr + "/" + db.db + "?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
	mongoC.connect(err => {
		if (err != null) {
			console.error('Unable to connect to database : "' + err + '"');
			return;
		}

		db.cProjects =  mongoC.db(db.db).collection(db.collProjects);
		db.cIdeas    =  mongoC.db(db.db).collection(db.collIdeas);
		console.log("Database connected");


		srv.server.listen(srv.port, srv.addr, () => {
			console.log(`Server running at http://${srv.addr}:${srv.port}/`);
		});
	});

})();


