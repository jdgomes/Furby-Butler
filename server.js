const express = require('express');
const bodyParser = require('body-parser');
const { dialogflow } = require('actions-on-google');
const prettyjson = require('prettyjson');
const request = require('request');

const app = dialogflow({debug:true});

app.intent('List GoT Aliases', (conv, params) => {
    return getGoTAlias(conv,params);
});

app.intent('Drink Suggestions',(conv,params)=>{
  if(params.ingredient != undefined && params.ingredient != null)
    return randomDrinkWithIngredient(conv,params);
  else
    return randomDrink(conv,params);
});

//How is AWS
  //http://awsdisabilityresourcefinder-dev.azurewebsites.net
  //Return Good if up
  //Tap into AppInsights for more info

//Is AWS ontrack this week?
  //Check sprint velocity compare to goal/average

//How much Vacation do I (John Gomes) have?
    //Determine Identity through phone?
  //Hit api that returns static values for now

//Have I entered all my (John Gomes) time this week?
    //Determine Identity through phone?
  //Hit api that returns static values for now

//Is The Coffee Ready?
  //IOT based on weight of Coffee thermus?

//Is (Rob) at his desk? (Slack)(Outlook Calendar)
  //Check if slack is green
  //Check if Skype is green
  //Check if in meeting

//Does anybody need my attention (slack)(Outlook Calendar)
  //Check for direct messages
  //Inform there are new Unread messages
  //Inform of meetings

//Who was the last person to check into Aptera

//Is the Aptera Alarm on?

//Are the lights on?

express().use(bodyParser.json(), app).listen(3000);

function getGoTAlias(conv,params){
  let requestURL = 'http://www.anapioficeandfire.com/api/characters?name=' + encodeURIComponent(params.character)
   return new Promise( function( resolve, reject ){ request(requestURL, function(err, response) {
      if (err) {
        console.log(err)
        reject( err );
      } else { 
        let body = JSON.parse(response.body);
        //logObject('GoT API call response: ', body);
        let aliases = body[0]['aliases'];
        conv.close(params.character + ' is also know as ' + aliases);
        resolve();
      }
    });
  });
}
      
function randomDrink(conv,params){
  let requestURL = 'https://www.thecocktaildb.com/api/json/v1/1/random.php'
    return new Promise( function( resolve, reject ){ request(requestURL, function(err, response) {
        if (err) {
          console.log(err)
          reject( err );
        } else { 
          let body = JSON.parse(response.body);
          let drink = body.drinks[0];
          conv.ask('Try this drink: ' + drink['strDrink']);

          var ingredients="";
          for(var i = 1; i <=15; i++){
            var list = drink["strMeasure"+i] + " " + drink["strIngredient"+i] +", ";
            if(list.length > 4)
              ingredients = ingredients + list;
          }

          conv.close(ingredients);
          resolve();
        }
      });
    });
}

function randomDrinkWithIngredient(conv,params){
 let requestURL = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i='+ encodeURIComponent(params.ingredient)
    return new Promise( function( resolve1, reject1 ){ request(requestURL, function(err, response) {
        if (err) {
          console.log(err)
          reject1( err );
        } else { 
          let body = JSON.parse(response.body);
          
          var randomDrinkIndex = Math.floor((Math.random() * body.drinks.length - 1) + 0);
          var drinkName = body.drinks[randomDrinkIndex]['strDrink'];
          return getDrinkByName(drinkName, resolve1, conv)
        }
      });
    });
}

function getDrinkByName(drinkName, resolve1, conv){
  let requestURL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s='+ encodeURIComponent(drinkName);
           return new Promise( function( resolve2, reject2 ){ request(requestURL, function(err, response) {
              if (err) {
                console.log(err)
                reject2( err );
              } else { 
                let body = JSON.parse(response.body);
                let drink = body.drinks[0];
                conv.ask('Try this drink: ' + drink['strDrink']);

                var ingredients="";
                for(var i = 1; i <=15; i++){
                  var list = drink["strMeasure"+i] + " " + drink["strIngredient"+i] +", ";
                  if(list.length > 4)
                    ingredients = ingredients + list;
                }

                conv.close(ingredients);
                resolve1();
                resolve2();
              }
          });});
}
      
// Pretty print objects for logging.
function logObject(message, object, options) {
  console.log(message);
  console.log(prettyjson.render(object, options));
}

//Links to Look Into
  //Visual Conversations Example https://github.com/actions-on-google/dialogflow-conversation-components-nodejs
  //Azure Function API Example https://css-tricks.com/create-your-own-serverless-api/

//IOT Apis
  //https://www.programmableweb.com/api/adafruit-io
  //https://www.programmableweb.com/api/allthingstalk
  //https://www.programmableweb.com/api/helium
  //https://www.programmableweb.com/api/microsoft-azure-iot-hub
  //https://www.programmableweb.com/api/thethingsio

//Ideas from Glitch
  //https://glitch.com/search?q=more+ideas
  //https://glitch.com/tools-for-work
  //https://glitch.com/handy-bots
  //https://glitch.com/hardware