const userHandles = require('./userHandles')
const slackAlerts = require('./slackAlerts')

/**
 * @description
 * @param {object} req - request object.
 * @param {object} res - response object.
 * @param {object} db - mongodb database access.
 */
function handleTaskAssignment(req, res, db) {
  let originator = userHandles[req.body.sender.login]
  let taskURL = req.body.pull_request.html_url
  let taskNumber = req.body.pull_request.number
  let timestamp = Date.now()
  let assignees = req.body.pull_request.assignees
  let repoName = req.body.pull_request.head.repo.name
  let fullRepoName = req.body.pull_request.head.repo.full_name // ex. translationCoreApps/translationHelps
  // Set collection
  let collection = db.get('usercollection')

  assignees.forEach(function(assignee) {
    let userName = userHandles[assignee.login]
    //finding to see if there is a document in the collection with the userName.
    if (userName) {
      collection.find({ username: userName}).then((docFound) => {
        if (docFound.length === 0) {
          // Submit to the DB
          collection.insert({
            "username": userName,
            "task": [
              {
                "taskURL": taskURL,
                "taskNumber": taskNumber,
                "repoName": repoName,
                "fullRepoName": fullRepoName
              }
            ],
            "timestamp": timestamp
          }, (err, doc) => {
            if (err) {
              // If it failed, return error
              console.log(err);
            } else {
              // sending slack notification
              slackAlerts.taskAssignmentSlackAlert(originator, userName, repoName, taskURL, taskNumber, fullRepoName)
            }
          })
        } else {
          let newTask = {
            taskURL: taskURL,
            taskNumber: taskNumber,
            repoName: repoName,
            fullRepoName: fullRepoName
          }

          console.log(!docFound[0].task.includes(newTask))
          if (!docFound[0].task.includes(newTask)) {
            docFound[0].task.push(newTask)

            collection.update({
              username: userName
            }, {
              $set: {
                task: docFound[0].task,
                timestamp: timestamp
              }
            }, (err, data) => {
              if (err) console.log(err)
              slackAlerts.taskAssignmentSlackAlert(originator, userName, repoName, taskURL, taskNumber, fullRepoName)
            })
          }
        }
      })
    } else {
      console.log("username is undefined")
    }
  }, this);
}
/**
 * @description
 * @param {object} req - request object.
 * @param {object} res - response object.
 * @param {object} db - mongodb database access.
 */
function handleTaskRemoval(req, res, db) {
  let originator = userHandles[req.body.sender.login]
  let taskURL = req.body.pull_request.html_url
  let taskNumber = req.body.pull_request.number
  let timestamp = Date.now()
  let assignees = req.body.pull_request.assignees
  let repoName = req.body.pull_request.head.repo.name
  let fullRepoName = req.body.pull_request.head.repo.full_name // ex. translationCoreApps/translationHelps
  // Set collection
  let collection = db.get('usercollection')

  assignees.forEach(function(assignee) {
    let userName = userHandles[assignee.login];
    //finding to see if there is a document in the collection with the userName.
    collection.find({
      username: userName
    },
    {task:
      {$elemMatch:{
          taskURL: taskURL,
          taskNumber: taskNumber,
          repoName: repoName,
          fullRepoName: fullRepoName
        }
      }
    }).then((docFound) => {
      if (docFound[0].task.length === 1) {
        // Submit to the DB
        collection.remove({
          username: userName
        },
        {task:
          {$elemMatch:{
              taskURL: taskURL,
              taskNumber: taskNumber,
              repoName: repoName,
              fullRepoName: fullRepoName
            }
          }
        }, (err, doc) => {
          if (err) {
            // If it failed, return error
            console.log(err);
          } else {
            // sending slack notification
            slackAlerts.taskUnassignmentSlackAlert(originator, userName, repoName, taskURL, taskNumber)
          }
        })
      } else {
        let taskRemoved = {
          taskURL: taskURL,
          taskNumber: taskNumber,
          repoName: repoName,
          fullRepoName: fullRepoName
        }

        let filteredTasks = docFound[0].task.filter(task => {
          return task.taskURL !== taskRemoved.taskURL
        })

        collection.update({
          username: userName
        }, {
          $set: {
            task: filteredTasks,
            timestamp: timestamp
          }
        }, (err, data) => {
          if (err) console.log(err)
          slackAlerts.taskUnassignmentSlackAlert(originator, userName, repoName, taskURL, taskNumber)
        })
      }
    })

    .catch((err) => {
      console.log(err);
    });
  }, this);
}

module.exports = {
  handleTaskAssignment,
  handleTaskRemoval,
}
