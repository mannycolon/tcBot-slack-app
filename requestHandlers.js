const MY_SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';
const slack = require('slack-notify')(MY_SLACK_WEBHOOK_URL);
// request handler functions

/**
 * @description
 * @param {object} req - request object.
 * @param {object} res - response object.
 * @param {object} db - mongodb database access.
 */
function handleOpenedPR(req, res, db) {
  let originator = req.body.sender.login
  let taskURL = req.body.pull_request.url
  let taskNumber = req.body.pull_request.number
  let timestamp = Date.now()
  let assignees = req.body.pull_request.assignees
  let repoName = req.body.pull_request.head.repo.name
  // Set collection
  let collection = db.get('usercollection')

  assignees.forEach(function(assignee) {
    let userName = assignee.login;
    //finding to see if there is a document in the collection with the userName.
    collection.find({ username: userName}).then((docFound) => {
      if (docFound.length === 0) {
        // Submit to the DB
        collection.insert({
          "username": userName,
          "task": [
            {
              "taskURL": taskURL,
              "taskNumber": taskNumber,
              "repoName": repoName
            }
          ],
          "timestamp": timestamp
        }, (err, doc) => {
          if (err) {
            // If it failed, return error
            console.log(err);
          } else {
            // sending slack notification
            slack.alert({
              text: "Successful Pull Request Assignment:",
              attachments: [
                {
                  text: "@" + originator + " created a new pull request.",
                  color: "#36a64f",
                  title: repoName,
                  fields: [
                    {
                      title: "Assigned to",
                      value: userName,
                      short: true
                    },
                    {
                      title: "Pull Request Number",
                      value: "#" + taskNumber,
                      short: true
                    },
                    {
                      title: "Pull Request URL",
                      value: taskURL,
                      short: false
                    }
                  ]
                }
              ]
            });
          }
        })
      } else {
        console.log(docFound)
      }
    })
  }, this);
}
/**
 * @description
 * @param {object} req - request object.
 * @param {object} res - response object.
 * @param {object} db - mongodb database access.
 */
function handleClosedPR(req, res, db) {
  console.log(req.body.action)
  console.log(req.body.sender.login)
  console.log(req.body.pull_request.number)
  console.log(req.body.pull_request.url)
  console.log(req.body.pull_request.assignees)
  console.log(req.bodypull_request.head.repo.name)
}
/**
 * @description
 * @param {object} req - request object.
 * @param {object} res - response object.
 * @param {object} db - mongodb database access.
 */
function handleAssignedPR(req, res, db) {
  console.log(req.body.sender.login)
  console.log(req.body.assignee.login)
  console.log(req.body.pull_request.number)
  console.log(req.body.pull_request.url)
  console.log(req.bodypull_request.head.repo.name)
}
/**
 * @description
 * @param {object} req - request object.
 * @param {object} res - response object.
 * @param {object} db - mongodb database access.
 */
function handleUnassignedPR(req, res, db) {
  console.log(req.body.sender.login)
  console.log(req.body.assignee.login)
  console.log(req.body.pull_request.number)
  console.log(req.body.pull_request.url)
  console.log(req.bodypull_request.head.repo.name)
}

module.exports = {
  handleOpenedPR,
  handleClosedPR,
  handleAssignedPR,
  handleUnassignedPR
}

//opened / closed / reopened / first pr creation/open (req.body.action)
    // req.body.action
    // req.body.sender.login
    // req.body.pull_request.number)
    // req.body.pull_request.url
    // req.body.pull_request.assignees (array)

    // assigned / unassigned (req.body.action)
    // pr requester
    // req.body.sender.login
    // reviewer assignee
    // req.body.assignee.login
    // req.body.pull_request.number
    // req.body.pull_request.url
    
    //review_request_removed (req.body.action)
    //review_requested (req.body.action)
    // pr requester
    // req.body.sender.login
    //req.body.pull_request.number
    //req.body.pull_request.url
    //req.body.requested_reviewer.login

    // merge and closed seem to be the same.

    // note: when you first open a pr and dont assign it to anyone then
    // req.body.action = opened
    // and req.body.pull_request.assignees = []
    /****
     * however when you first open/create a pr and do asign it to someone
     * then req.body.action = assigned and req.body.pull_request.assignees = ['userobject', 'userobject']
     */


    // pull_request.head.repo.name
