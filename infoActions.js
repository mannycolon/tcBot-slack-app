
function showHelpInfo(res) {
  let data = {
    response_type: 'ephemeral', // private message (only visible by user).
    text: 'How to use the /tcbot command:',
    attachments:[
      {
        text: "To get the PRs assigned to you, use `/tcbot my prs`.\nTo get all PRs assigments, use `/tcbot all prs`.\n You’ve already learned how to get help with `/tcbot help`.",
        mrkdwn_in: ["text", "pretext"],
        color: "#c3105a"
      }
    ]
  }
  res.json(data)
}

function greetings(res) {

}

function showAllPrs(req, res, db) {

}

function showUserPrs(req, res, db) {

}

module.exports = {
  showHelpInfo,
  greetings,
  showAllPrs,
  showUserPrs
}