var express = require('express');
var bodyParser = require('body-parser'); //mache Node package "Bodyparser" verfügbar
var sessions = require('express-session');
var mysql = require ('mysql');

var path = require('path');
var fs = require ('fs');

//Datenbankverbindung
var connection = mysql.createPool({

	connectionLimit: 50,
	////properties...
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'schmal'
	//host: '213.238.59.191'
	//user: 'studi'
	//password: 'jeiGh+o6'
	//database: 'schmal'

});

var session;

var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.locals.points = "818218";


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/cssFiles', express.static(__dirname +'/assets'));

app.use(sessions({
	secret: '&(§$%+',
	resave: false,
	saveUninitialized: true
}))

app.get('/login', function(req, resp) {
	session = req.session;
		if(session.uniqueID) {
		resp.redirect('redirects');
	}
	resp.sendFile('./files/login.html', {root: __dirname});	
});

app.post('/login', function(req, resp) {
	//resp.end(JSON.stringify(req.body));
	session = req.session;
	if(session.uniqueID) {
		resp.redirect('redirects');
	}
	if(req.body.username == 'admin' && req.body.password == 'admin') { //hier passwortabfrage - später Vgl. aus Datenbank
		session.uniqueID = req.body.username;  //NutzerName aus Form wird in session.uniqueID geschrieben
	}
	resp.redirect('/redirects');
});

app.get('/logout', function(req, resp) {
	req.session.destroy();
	resp.redirect('/login');
});

app.get('/index', function (req, resp) {
	session = req.session;
	if(session.uniqueID != 'admin') {
		
		resp.send('Unauthorisierter Zugriff <a href="/login">Zurück zum Login</a');
	
	} else {

		//resp.send('Du bist angemeldet als Admin. <a href="/logout">Logout</a');
		//resp.sendFile('index.html', {root: path.join(__dirname, './files')});
		resp.render('index');
	
	}
});

app.get('/addApplicant', function (req, resp) {
	session = req.session;
	if(session.uniqueID != 'admin') {
		
		resp.send('Unauthorisierter Zugriff <a href="/login">Zurück zum Login</a');
	
	} else {

		resp.sendFile('addapplicant.html', {root: path.join(__dirname, './files')});
		
		}
});

app.get('/addJob', function (req, resp) {
	session = req.session;
	if(session.uniqueID != 'admin') {
		
		resp.send('Unauthorisierter Zugriff <a href="/login">Zurück zum Login</a');
	
	} else {
		
		resp.sendFile('addJob.html', {root: path.join(__dirname, './files')});
		
		}
});

app.get('/getJobs', function (req, resp) {
	session = req.session;
	if(session.uniqueID != 'admin') {
		
		resp.send('Unauthorisierter Zugriff <a href="/login">Zurück zum Login</a');
	
	} else {
		
			//bestimmten Datensatz ausgeben
			//var id = '1; drop table job;'; //bestimmen Datensatz ausgeben
			//var query = connection.query('select * from job where job_id = ?', id, function(err, result) {
  			//console.log(result);
			//});
			//alle Datensätze ausgeben
				var query = connection.query('select * from job' , function(error, rows, result) {
					//connection.release();
				if (!!error) {

					console.log('Error in the query');

				} else {
					
					resp.json(rows); //zeile wird als json anstatt als objekt (resp.send(rows)) an Browser gesendet
					//console.log(result);
				}
  					
				});
			}
});


app.get('/getApplicants', function (req, resp) {
	session = req.session;
	if(session.uniqueID != 'admin') {
		
		resp.send('Unauthorisierter Zugriff <a href="/login">Zurück zum Login</a');
	
	} else {
		
			//alle Datensätze ausgeben
				var query = connection.query('select * from applicant' , function(error, rows, result) {

				if (!!error) {

					console.log('Error in the query');

				} else {
					
					resp.json(rows); //zeile wird als json anstatt als objekt (resp.send(rows)) an Browser gesendet
					//console.log(result);
				}
  					
				});
			}
});


app.get('/redirects', function(req, resp) {
	session = req.session;
	if(session.uniqueID == 'admin') {
		console.log(session.uniqueID);
		resp.redirect('/index');
	} else {
		resp.send(req.session.uniqueID + ' Anmeldedaten inkorrekt <a href="/logout">Zurück zum Login</a');
	}

});


app.post('/addapplicant', function(req, resp) {
	//resp.end(JSON.stringify(req.body));

	var applicant = {
  		applicant_id: req.body.formApplicant_id,
  		prename: req.body.formPrename,
  		surname: req.body.formSurname,
  		phone: req.body.formPhone,
  		email: req.body.formEmail,
  		location: req.body.formLocation,
  		birth_date: req.body.formBirth_date,
  		job_experience_length: req.body.formJob_experience_length,
  		applicant_level_id: req.body.formApplicant_level_id
		};

	var query = connection.query('insert into applicant set ?', applicant, function (err, result) {
  		if (err) {
    		console.error(err);
    		return;
  			}
  			console.error(result);
		});

});

app.post('/addJob', function(req, resp) {
	//resp.end(JSON.stringify(req.body));

	var job = {
  		job_id: req.body.formJob_id,
  		title: req.body.formTitle,
  		job_status_id: req.body.formJob_status_ID,
  		skill_id: req.body.formSkill_ID,
		};

	var query = connection.query('insert into job set ?', job, function (err, result) {
  		if (err) {
    		console.error(err);
    		return;
  			}
  			console.error(result);
		});

});

app.listen(1337, function() {
	console.log('Listening at Port 1337');
});