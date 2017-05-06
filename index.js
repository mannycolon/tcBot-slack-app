'use strict'
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const monk = require('monk')
const db = monk('mongodb://heroku_1rfb6cx7:csft257r52q2mqtq41fdpt2dg6@ds129641.mlab.com:29641/heroku_1rfb6cx7')

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
    console.log("1 " + req.body.action)
    //console.log("2 " + req.body.user.login)
    console.log("3 " + req.body.sender.login)
    console.log("4 " + req.body.pull_request.user.login)
    console.log("5 " + req.body.pull_request.body)
    
    //console.log("5 " + JSON.stringify(req.body.pull_request.assignee))
    // https://hooks.slack.com/commands/T0TH52
  })

  .listen(process.env.PORT || 5000, () => {
    console.log('Expresss server listening on port ' + process.env.PORT || 5000)
  });
