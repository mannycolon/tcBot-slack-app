'use strict'
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

var url = 'mongodb://heroku_1rfb6cx7:csft257r52q2mqtq41fdpt2dg6@ds129641.mlab.com:29641/heroku_1rfb6cx7'

// Mongoose Schema definition
var Schema = new mongoose.Schema({
  user     : String,
  task     : String,
  timestamp: String
});

var Users = mongoose.model('Users', Schema);

mongoose.connect(url, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});

express()
  .use(bodyParser.json()) // support json encoded bodies
  .use(bodyParser.urlencoded({ extended: true })) // support encoded bodies

  .post('/', function (req, res) {
    var todo = new Users( req.body );

    let user = req.body.text.split(' ').filter((element) => {
      return element.includes('@')
    })

    let task = req.body.text.split(' ').filter((element) => {
      return element.includes('#')
    })

    todo.id = todo._id;
    todo.user = user;
    todo.task = task;
    todo.timestamp = Date.now();
    todo.available = false;
    let data = {
      response_type: 'in_channel', // private message (only visible by user).
      text: 'How to use /httpstatus command:',
      attachments:[
        {
          text: todo.user + " was assigned to " + todo.task
        }
      ]
    };
    todo.save(function (err) {
      res.json(data);
    });
    console.log(todo)
  })
  // .get('/', (req, res) => {
  //   handleQueries(req.query, res);
  // })

  // .post('/', (req, res) => {
  //   handleQueries(req.body, res);
  // })

  .listen(process.env.PORT || 5000, () => {
    console.log('Expresss server listening on port ' + process.env.PORT || 5000)
  });


