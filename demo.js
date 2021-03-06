//demo.js -- the server of the chat implementation.
var appmetrics = require('appmetrics');
var monitoring = appmetrics.monitor();
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
/*var LanguageTranslatorV2 = require('watson-developer-cloud/language-translator/v2');
var language_translator = new LanguageTranslatorV2({
        "url": "https://gateway.watsonplatform.net/language-translation/api",
        "password": "",
        "username": ""
});*/

function jsFriendlyJSONStringify (s) {
        return JSON.stringify(s).
        replace(/\u2028/g, '\\u2028').
        replace(/\u2029/g, '\\u2029');
}

app.get('/', function(req, res){
    res.sendFile(__dirname + '/demo.html');
});


//event listener whenever there is a connection
io.on('connection', function(socket){
    console.log('a user connected');
    socket.broadcast.emit('user-connected');
    socket.on('disconnect', function(){
        console.log('a user disconnected');
    });


    //
    socket.on('name-sent', function(name){
        //todo
    });


    //todo: event listener �chat message�

    /*socket.on('require-translation', function(text, src, tar, name){
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
                //todo: trigger client side event listener �translation-done�
            }
        });
    });*/
});
/*
monitoring.on('initialized',function(env){
    env = monitoring.getEnvironment();
    for(var entry in env){
        console.log(entry + ':' + env[entry]);
    };
});

monitoring.on('cpu', function(cpu){
    console.log('['+ new Date(cpu.time) + '] CPU: ' + cpu.process);
});
*/
http.listen(8080, function(){
    console.log('listening on port 8080');    
});
