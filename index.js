'use strict'
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const monk = require('monk')
const db = monk('mongodb://heroku_1rfb6cx7:csft257r52q2mqtq41fdpt2dg6@ds129641.mlab.com:29641/heroku_1rfb6cx7')
// request handler functions
const requestHandlers = require('./requestHandlers')

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
    res.status(200).send({ "Content-Type": "text/plain" });
    switch (req.body.action) {
      case "opened":
      case "reopened":
        requestHandlers.handleOpenedPR(req, res, db)
        break
      case "assigned":
        requestHandlers.handleAssignedPR(req, res, db)
        break
      case "unassigned":
        requestHandlers.handleUnassignedPR(req, res, db)
        break
      case "closed":
        requestHandlers.handleClosedPR(req, res, db)
      default:
        // Do nothing
        break
    }
  })

  .listen(process.env.PORT || 5000, () => {
    console.log('Expresss server listening on port ' + process.env.PORT || 5000)
  });
