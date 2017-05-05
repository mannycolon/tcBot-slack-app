'use strict'
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const monk = require('monk')
const db = monk('mongodb://heroku_1rfb6cx7:csft257r52q2mqtq41fdpt2dg6@ds129641.mlab.com:29641/heroku_1rfb6cx7')
//let url = 'mongodb://heroku_1rfb6cx7:csft257r52q2mqtq41fdpt2dg6@ds129641.mlab.com:29641/heroku_1rfb6cx7'

function textParser(text, identifier) {
  return text.split(' ').filter((element) => {
    return element.includes(identifier)
  })[0]
}

let errorMessage = {
  response_type: 'ephemeral', // private message (only visible by user).
  text: 'Error: ',
  attachments:[
    {
      text: "There was a problem adding the information to the database."
    }
  ]
};


express()
  .use(bodyParser.json()) // support json encoded bodies
  .use(bodyParser.urlencoded({ extended: true })) // support encoded bodies

  // Make our db accessible to our router
  .use(function(req, res, next){
    req.db = db;
    next();
  })

  .post('/', function (req, res) {
    // set internal DB variable
    let db = req.db

    let userName = textParser(req.body.text, '@');
    let task = textParser(req.body.text, '#');
    let timestamp = Date.now();
    let available = false;

    // Set collection
    let collection = db.get('usercollection')
    //finding to see if there is a document in the collection with the userName.
    let docFound = collection.find({username: userName}).limit(1)
    console.log(docFound)
    // Submit to the DB
    collection.insert({
      "username": userName,
      "task": task,
      "timestamp": timestamp,
      "available": available
    }, (err, doc) => {
      if (err) {
        // If it failed, return error
        res.json(errorMessage);
      } else {
        // set up response message
        let data = {
          response_type: 'in_channel', // private message (only visible by user).
          text: 'Successful pull request assigntment:',
          attachments:[
            {
              text: "@" + req.body.user_name + " assigned pull request " + task  + " to " + userName 
            }
          ]
        };
        res.json(data);
      }
    })
  })

  .listen(process.env.PORT || 5000, () => {
    console.log('Expresss server listening on port ' + process.env.PORT || 5000)
  });
