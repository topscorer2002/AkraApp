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
	//host: 'localhost',
	//user: 'root',
	//password: '',
	//database: 'schmal'
	host: '213.238.59.191',
	user: 'studi',
	password: 'jeiGh+o6',
	database: 'schmal',
	port: '3306'

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


app.get('/addSkill', function (req, resp) {
	session = req.session;
	if(session.uniqueID != 'admin') {
		
		resp.send('Unauthorisierter Zugriff <a href="/login">Zurück zum Login</a');
	
	} else {
		resp.sendFile('addSkill.html', {root: path.join(__dirname, './files')});
		
		}
});

app.get('/addJobStatus', function (req, resp) {
	session = req.session;
	if(session.uniqueID != 'admin') {
		
		resp.send('Unauthorisierter Zugriff <a href="/login">Zurück zum Login</a');
	
	} else {
		resp.sendFile('addJobStatus.html', {root: path.join(__dirname, './files')});
		
		}
});


app.get('/addApplicantLevel', function (req, resp) {
	session = req.session;
	if(session.uniqueID != 'admin') {
		
		resp.send('Unauthorisierter Zugriff <a href="/login">Zurück zum Login</a');
	
	} else {
		resp.sendFile('addApplicantLevel.html', {root: path.join(__dirname, './files')});
		
		}
});

///////////Datenbank-Listen ausgeben
//Jobs abholen
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


//Applicants abholen
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

///Skills ausgeben
app.get('/getSkills', function (req, resp) {
	session = req.session;
	if(session.uniqueID != 'admin') {
		
		resp.send('Unauthorisierter Zugriff <a href="/login">Zurück zum Login</a');
	} else {
			//alle Datensätze ausgeben
				var query = connection.query('select * from skill' , function(error, rows, result) {

					if (!!error) {
						console.log('Error in the query');
					} else {
						resp.json(rows); //zeile wird als json anstatt als objekt (resp.send(rows)) an Browser gesendet
					//console.log(result);
					}	
				});
			}
});

//alle job status ausgeben
app.get('/getJobStatus', function (req, resp) {
	session = req.session;
	if(session.uniqueID != 'admin') {
		
		resp.send('Unauthorisierter Zugriff <a href="/login">Zurück zum Login</a');
	} else {
			//alle Datensätze ausgeben
				var query = connection.query('select * from job_status' , function(error, rows, result) {

					if (!!error) {
						console.log('Error in the query');
					} else {
						resp.json(rows); //zeile wird als json anstatt als objekt (resp.send(rows)) an Browser gesendet
					//console.log(result);
					}	
				});
			}
});

//alle applicant level ausgeben
app.get('/getApplicantLevels', function (req, resp) {
	session = req.session;
	if(session.uniqueID != 'admin') {
		
		resp.send('Unauthorisierter Zugriff <a href="/login">Zurück zum Login</a');
	} else {
			//alle Datensätze ausgeben
				var query = connection.query('select * from applicant_level' , function(error, rows, result) {

					if (!!error) {
						console.log('Error in the query');
					} else {
						resp.json(rows); //zeile wird als json anstatt als objekt (resp.send(rows)) an Browser gesendet
					//console.log(result);
					}	
				});
			}
});

////////////////Standard Redirect Page
app.get('/redirects', function(req, resp) {
	session = req.session;
	if(session.uniqueID == 'admin') {
		console.log(session.uniqueID);
		resp.redirect('/index');
	} else {
		resp.send(req.session.uniqueID + ' Anmeldedaten inkorrekt <a href="/logout">Zurück zum Login</a');
	}

});


//////////////////////POST METHODS//////////////////////

//LOGIN
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


//add applicant
app.post('/addapplicant', function(req, resp) {
	//resp.end(JSON.stringify(req.body));

	var applicant = {
  		//applicant_id: req.body.formApplicant_id,
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


//add Job
app.post('/addJob', function(req, resp) {
	//resp.end(JSON.stringify(req.body));

	var job = {
  		//job_id: req.body.formJob_id,
  		title: req.body.formTitle,
  		job_status_id: req.body.formJob_status_ID,
  		skill_id: req.body.formSkill_ID
		};

	var query = connection.query('insert into job set ?', job, function (err, result) {
  		if (err) {
    		console.error(err);
    		return;
  			}
  			console.error(result);
		});

});


//add skill
app.post('/addSkill', function(req, resp) {
	//resp.end(JSON.stringify(req.body));
	var skill = {
  		//skill_id: req.body.fromSkill_id,
  		skill: req.body.formSkill
		};

	var query = connection.query('insert into skill set ?', skill, function (err, result) {
  		if (err) {
    		console.error(err);
    		return;
  			}
  			console.error(result);
		});
});

//add Job Status
app.post('/addJobStatus', function(req, resp) {
	//resp.end(JSON.stringify(req.body));
	var job_status = {
  		//job_status_id: req.body.formJob_status_ID,
  		job_status: req.body.formJob_status
		};

	var query = connection.query('insert into job_status set ?', job_status, function (err, result) {
  		if (err) {
    		console.error(err);
    		return;
  			}
  			console.error(result);
		});
});

//add Applicant Level
app.post('/addApplicantLevel', function(req, resp) {
	//resp.end(JSON.stringify(req.body));
	var applicant_level = {
  		//applicant_level_id: req.body.formApplicant_level_ID,
  		applicant_level: req.body.formApplicant_level
		};

	var query = connection.query('insert into applicant_level set ?', applicant_level, function (err, result) {
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