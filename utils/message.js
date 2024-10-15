const moment = require("moment");

function formMessage(username, text) {
  return {
    username: username,
    text: text,
    time: moment().format(' h:mm a')
  }
}
module.exports = formMessage;