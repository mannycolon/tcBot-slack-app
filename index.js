'use strict'
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const monk = require('monk')
const db = monk('mongodb://heroku_1rfb6cx7:csft257r52q2mqtq41fdpt2dg6@ds129641.mlab.com:29641/heroku_1rfb6cx7')
// request handler functions
const requestHandlers = require('./requestHandlers')
const infoActions = require('./infoActions')

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
    res.status(200).send({ "Content-Type": "application/json" });
    switch (req.body.action.toLowerCase()) {
      case "opened":
      case "reopened":
      case "assigned":
        requestHandlers.handleTaskAssignment(req, res, db)
        break
      case "unassigned":
      case "closed":
        requestHandlers.handleTaskRemoval(req, res, db)
        break
      default:
        // Do nothing
        break
    }
  })

  .post('/tcbot', function (req, res) {
    // set internal DB variable
    let db = req.db
    if(query.text) {
      switch (req.body.text.toLowerCase()) {
        case "help":
          infoActions.showHelpInfo(res)
          break
        case "my prs":
          infoActions.showAllPrs(req, res, db)
          break
        case "all prs":
          infoActions.showUserPrs(req, res, db)
          break
        default:
          infoActions.showHelpInfo(res)
          // Do nothing else
          break
      }
    } else {
      // no text string written after /tcbot command
      infoActions.showHelpInfo(res)
    }
  })

  .listen(process.env.PORT || 5000, () => {
    console.log('Expresss server listening on port ' + process.env.PORT || 5000)
  });
