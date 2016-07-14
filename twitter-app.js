/*

BETA v0.0.1

This NodeJS application is just an example of how to use (prompt), (twit), (fs) & how to export/import vars btw different JS files

[#]- Prompt: https://www.npmjs.com/package/prompt
[#]- Twit: https://github.com/ttezel/twit
[#]- fs: comes with node js by default

Get Started
- just make sure to change the config.js vars according to yours <https://apps.twitter.com>

if you have any question, dont hesitate to contact me on instagram or gmail developerbahraini@gmail.com

Developed by @developerbh (@androidworldbh).

*/
var Twit = require('twit');
var prompt = require('prompt');
var fs = require("fs");
var setting = require('./config');

var client = new Twit({
  consumer_key: setting.consumer_key,
  consumer_secret: setting.consumer_secret,
  access_token: setting.access_token,
  access_token_secret: setting.access_token_secret,
  timeout_ms: setting.timeout_ms
});

prompt.start();

console.log('Choose Function [NUMBER]:'+'\r\n'
+'1- Search And Save In TXT File (ability to live search for anything you want on twitter and save the tweet in tweet/username.json as a JSON Object )'+'\r\n'
+'\r\n'+'Example: Android NOT #Android'+'\r\n'+'\r\n'+'2- Automation Tweet From File (this method will grab a random sentence from AutoTweetFile.txt and tweet it every 10min = 600000ms)'+'\r\n'+'\r\n');

prompt.get(['funNumber'], function (err, result) {
  if (err) { return onErr(err); }
  var fnumber = result.funNumber;

  switch(fnumber) {
    case "1":
      prompt.get(['hashtagKey'], function (err, result) {
        if (err) { return onErr(err); }
        var sk = result.hashtagKey;

        var dir = 'tweets';

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        var stream = client.stream('statuses/filter', { track: sk });

        stream.on('tweet', function (data) {
          console.log("via: "+data.user.screen_name+"/"+"Tweet: "+data.text+'\r\n'+'\r\n');
          /*
          var dataTosave = "{"+"\r"+
          "Text: "+data.text+","+"\r\n"+
          "Time: "+data.created_at+","+"\r\n"+
          "Source: "+data.source+","+
          "\r"+"}";
          
          basically you can use these variables if you dont want to save the whole JSON
          
          username: data.user.screen_name
          created_at: data.created_at
          location: data.user.location
          etc ....
          */
          fs.writeFile('tweets/'+data.user.screen_name+'.json',JSON.stringify(data, null, 4),function (err) {
            if (err) throw err;
          });

        });

        function onErr(err) {
          console.log(err);
          return 1;
        }

      });
      break;
      case "2":
      function makingtweets (callback){

        fs.readFile('AutoTweetFile.txt', function(err, data) {
            if(err) throw err;
            var grabbedSentence = data.toString().split("\n");
            var gbsen = grabbedSentence[Math.floor(Math.random() * grabbedSentence.length)];
            
            if(gbsen.length > 140){
              console.log("tweet is too long, it has "+ gbsen.length + " character");
              return 1;
            } else{
             client.post('statuses/update', { status: gbsen }, function(err, data, response) {
                
                console.log('posted tweet is:'+gbsen+'\r\n');
                
              });

            }

        });
         callback();
      }

      function wait10min(){
          setTimeout(function(){
              makingtweets(wait10min);
          }, 600000);
      }

      makingtweets(wait10min);
      // auto tweet ends here

      break;
      default:
        text = "invalid function number ...";
        console.log(text);
        break;

}

  function onErr(err) {
    console.log(err);
    return 1;
  }

});