const usersArray = require('./fashionshow_users.json');

usersArray.map((user) => {
  return console.log(user.username + ' (' + user.mmBalance['$numberInt'] + ')');
});
