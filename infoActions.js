const userHandles = require('./userHandles')

function showHelpInfo(res) {
  let data = {
    response_type: 'ephemeral', // private message (only visible by user).
    text: 'How to use the /tcbot command:',
    attachments:[
      {
        text: "To get the PRs assigned to you, use `/tcbot my prs`.\nTo get all PRs assigments, use `/tcbot all prs`.\n To say hello to tcBot, use `/tcbot hello`.\n You’ve already learned how to get help with `/tcbot help`.",
        mrkdwn_in: ["text", "pretext"],
        color: "#c3105a"
      }
    ]
  }
  res.json(data)
}

function greetings(res) {
  let data = {
    response_type: 'in_channel', // public to the channel
    text: "Hello team, How are you today? \n My name is *tcBot* and I'm here to help.\n `FUN FACT:`\n According to my friend captcha I am a human.",
    attachments: [
      {
        image_url: 'https://media.giphy.com/media/QN8TP7wz2TroY/giphy.gif'
      }
    ]
  }
  res.json(data)
}

function showAllPrs(req, res, db) {
  // Set collection
  let collection = db.get('usercollection')

  collection.find().then((docsFound) => {
    let fields = []
    let message = ""
    let color = "#36a64f"

    if (docsFound.length !== 0) {
      docsFound.forEach((element) => {
        let userName = element.username
        let tasks = ""

        element.task.forEach((task, index) => {
          let number = index + 1
          tasks += "\n" + number + ". <" + task.taskURL + "|" + task.repoName
                + " #" + task.taskNumber + ">" + "  " + "<https://reviewable.io/reviews/"
                + task.fullRepoName + "/" + task.taskNumber + "|Review Now>"
        })
        fields.push({
          title: userName,
          value: tasks,
          short: false
        })
      }, this);
    } else {
      message = "Hurrah! No PR review assignment was found." + "\n" + "I guess more time to code."
      color = "#cc3300"
    }

    let data = {
      response_type: 'in_channel', // public
      text: "Pull Request Assignments:",
      attachments: [
        {
          text: message,
          mrkdwn_in: ["text", "pretext"],
          color: color,
          fields: fields
        }
      ]
    }
    res.json(data)
  })
}

/**
 * 
 */

function showUserPrs(req, res, db) {
  // Set collection
  let collection = db.get('usercollection')
  let userName = userHandles[req.body.user_name]

  collection.find({username: userName}).then((docsFound) => {
    let fields = []
    let message = ""
    let color = "#36a64f"

    if (docsFound.length !== 0) {
      docsFound.forEach((element) => {
        let userName = element.username
        let tasks = ""

        element.task.forEach((task, index) => {
          let number = index + 1
          tasks += "\n" + number + ". <" + task.taskURL + "|" + task.repoName
                + " #" + task.taskNumber + ">" + "  " + "<https://reviewable.io/reviews/"
                + task.fullRepoName + "/" + task.taskNumber + "|Review Now>"
        })
        fields.push({
          title: userName,
          value: tasks,
          short: false
        })
      }, this);
    } else {
      message = "You have no PR review assignments."
      color = "#cc3300"
    }

    let data = {
      response_type: 'ephemeral', // private message (only visible by user).
      text: "Your Pull Request Assignments:",
      attachments: [
        {
          text: message,
          mrkdwn_in: ["text", "pretext"],
          color: color,
          fields: fields
        }
      ]
    }
    res.json(data)
  })
}

module.exports = {
  showHelpInfo,
  greetings,
  showAllPrs,
  showUserPrs
}