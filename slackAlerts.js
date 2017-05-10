const MY_SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';
const slack = require('slack-notify')(MY_SLACK_WEBHOOK_URL);

function taskAssignmentSlackAlert(originator, assigneeAdded, repoName, taskURL, taskNumber, fullRepoName, action) {
  if (action === "assigned") {
    slack.alert({
      text: "Successful Pull Request Assignment:",
      attachments: [
        {
          text: originator + " " + action + " *Pull Request* " + "<" + taskURL + "|" + "#"
                + taskNumber + ">" + " " + " to " + assigneeAdded,
          mrkdwn_in: ["text", "pretext"],
          color: "#439fe0",
          title: repoName,
          title_link: taskURL,
          fields: [
            {
              title: "Pull Request URL",
              value: taskURL + "\n\n\n <https://reviewable.io/reviews/"
                      + fullRepoName + "/" + taskNumber + "|Review Now>",
              short: false
            }
          ]
        }
      ]
    });
  }else {
    slack.alert({
      text: "Successful Pull Request Assignment:",
      attachments: [
        {
          text: originator + " " + action + " *Pull Request* " + "<" + taskURL + "|" + "#"
                + taskNumber + ">" + " and assigned it to " + assigneeAdded,
          mrkdwn_in: ["text", "pretext"],
          color: "#439fe0",
          title: repoName,
          title_link: taskURL,
          fields: [
            {
              title: "Pull Request URL",
              value: taskURL + "\n\n\n <https://reviewable.io/reviews/"
                      + fullRepoName + "/" + taskNumber + "|Review Now>",
              short: false
            }
          ]
        }
      ]
    });
  }
}

function taskUnassignmentSlackAlert(originator, assigneeRemoved, repoName, taskURL, taskNumber) {
  slack.alert({
    text: "Successful Pull Request Unassignment:",
    attachments: [
      {
        text: originator + " *unassigned* " + assigneeRemoved + " from *Pull Request* " + "<" + taskURL + "|" + "#" + taskNumber + ">",
        mrkdwn_in: ["text", "pretext"],
        color: "#439fe0",
        title: repoName,
        title_link: taskURL
      }
    ]
  });
}

function taskClosedSlackAlert(originator, assigneeRemoved, repoName, taskURL, taskNumber) {
  slack.alert({
    text: "Successful Pull Request Unassignment:",
    attachments: [
      {
        text: originator + " *merged or closed* pull request #" + taskNumber + "\n"
        + assigneeRemoved + " was *unassigned* from #" + taskNumber + "\n" + taskURL,
        mrkdwn_in: ["text", "pretext"],
        color: "#439fe0",
        title: repoName,
        title_link: taskURL
      }
    ]
  });
}

module.exports = {
  taskAssignmentSlackAlert,
  taskUnassignmentSlackAlert,
  taskClosedSlackAlert
}
