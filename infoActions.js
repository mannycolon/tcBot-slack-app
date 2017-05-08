
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
  let data = {
    response_type: 'in_channel', // public to the channel
    text: "Hello team, How are you? \n My name is tcBot and I'm here to help.\n According to my frined catcha I am a human,",
    attachments: [
      {
        image_url: 'https://media.giphy.com/media/QN8TP7wz2TroY/giphy.gif'
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
  showHelpInfo,
  greetings,
  showAllPrs,
  showUserPrs
}