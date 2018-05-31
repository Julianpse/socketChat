var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  noCache: true
});

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

//User in Chat
var users = {
  userName: "name",
  id: "ID"
};


function uuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  var uniqueID =  s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  return uniqueID;
}

// TODO - Finish username validation Function
// function validateName(nameInput){
//   var usernameRegex = /^[a-zA-Z0-9]+$/;
//   var validfirstUsername = nameInput.match(usernameRegex);
//   if(validfirstUsername == null){
//     alert("Your username is not valid. Only characters A-Z, a-z and '-' are  acceptable.");
//     document.frm.firstName.focus();
//     return false;
//   }
// }

app.get('/', function (req, res) {
  res.render('login.html');
});

app.post('/chat', function(req, res) {
    var data = req.body;
    var userId = uuid();


    users[userId] = data.name;
    // TODO: validate that the name is valid here
    // should be limited to regex [a-zA-Z0-9] (or similar)
    // validateName(data);

    // if (nameIsValid(data.name)) {
    //   theUser = data.name
    // } else {
    //   // TODO: throw some error here
    // }

    theUser = data.name;

    res.redirect('/chat');
});

app.get('/chat', function (req, res) {
  // TODO: set the name here
  res.render('index.html', {name: theUser});
});

io.on('connection', function(socket){
  console.log(users);
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});


http.listen(3000, function() {
  console.log('litening on *:3000');
});
