// the server of the chat implementation.

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var LanguageTranslatorV2 = require('watson-developer-cloud/language-translator/v2');

var language_translator = new LanguageTranslatorV2({
        "url": "https://gateway.watsonplatform.net/language-translation/api",
        "password": "",
        "username": ""
});

function jsFriendlyJSONStringify (s) {
        return JSON.stringify(s).
        replace(/\u2028/g, '\\u2028').
        replace(/\u2029/g, '\\u2029');
}

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.broadcast.emit('user-connected');
    socket.on('disconnect', function(){
        console.log('a user disconnected');
    });

    socket.on('name-sent', function(name){
        console.log(name + " given as a name");
        io.emit('name-sent', name);
    });
    socket.on('chat message', function(name, msg, language){
       console.log('message from ' + name + ': ' + msg);
       io.emit('chat message', name, msg, language);
    });

    socket.on('require-translation', function(text, src, tar, name){
        language_translator.translate({
        text: text, source : src, target: tar },
        function (err, translation) {
            if (err)
                console.log('error:', err);
            else{
                translationjsobj = eval('(' + jsFriendlyJSONStringify(translation) + ')');
                console.log(translationjsobj );
                translationmsg = translationjsobj["translations"][0]["translation"];
                console.log(translationmsg);
                io.emit("translation-done", name, translationmsg);
            }
        });
    });
});

http.listen(8080, function(){
    console.log('listening on port 8080');    
});
