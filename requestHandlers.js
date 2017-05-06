 
// request handler functions

/**
 * @description
 * @param {object} req - request object.
 * @param {object} res - response object.
 * @param {object} db - mongodb database access.
 */
function handleOpenedPR(req, res, db) {
  console.log(req.body.action)
  console.log(req.body.sender.login)
  console.log(req.body.pull_request.number)
  console.log(req.body.pull_request.url)
  console.log(req.body.pull_request.assignees)
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
