const MY_SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';
const slack = require('slack-notify')(MY_SLACK_WEBHOOK_URL);

function taskAssignmentSlackAlert(originator, userName, repoName, taskURL, taskNumber, fullRepoName) {
  slack.alert({
    text: "Successful Pull Request Assignment:",
    attachments: [
      {
        text: originator + " created a new *Pull Request.*",
        mrkdwn_in: ["text", "pretext"],
        color: "#36a64f",
        title: repoName,
        title_link: taskURL,
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
            value: taskURL + "\n\n\n <https://reviewable.io/reviews/"
                    + fullRepoName + "/" + taskNumber + "|Review Now>",
            short: false
          }
        ]
      }
    ]
  });
}

function taskUnassignmentSlackAlert(originator, userName, repoName, taskURL, taskNumber) {
  slack.alert({
    text: "Successful Pull Request Unassignment:",
    attachments: [
      {
        text: originator + " *merged or closed* pull request #" + taskNumber + "\n"
        + userName + " was *unassigned* from #" + taskNumber + "\n" + taskURL,
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
}
