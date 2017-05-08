
function showHelpInfo(res) {
  let data = {
    response_type: 'ephemeral', // private message (only visible by user).
    text: 'How to use /tcbot command:',
    attachments:[
      {
        text: "To get the PRs assigned to you, use `/tcbot my prs`.\nTo get all PRs assigments, use `/tcbot all prs`.\n You’ve already learned how to get help with `/tcbot help`."
      }
    ]
  }
  res.json(data)
}

function showAllPrs(req, res, db) {

}

function showUserPrs(req, res, db) {

}

module.exports = {
  showWrongCommandMsg,
  showHelpInfo,
  showAllPrs,
  showUserPrs
}