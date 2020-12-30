var express = require('express');
var router = express.Router();

const { announce } = require('./controllers/listener');
const { sendUserUpdate } = require('./sockets');

// Middleware
// const { authenticate, adminOnly } = require('./controllers/magic-auth');
// const UserModel = require('./models').UserModel;
// const { getSubstackContent } = require('./integrations/substack');

//
// CONTENT
//
const { hitBeachBall } = require('./controllers/game');
router.get('/hitball', async (req, res) => {
  // console.log('hit api');
  try {
    const user = await hitBeachBall({ discordId: req.query.discordId });

    // update client
    await sendUserUpdate(user);

    // announce in channel
    announce(`${user.username} hit the beachball +10 💸 `);

    res.status(200).send(user);
  } catch (error) {
    console.log(error);

    // announce(`${error.username} dropped the beachball`);

    res.status(400).send();
  }
});

router.get('*', async (req, res) => {
  res.status(404).send();
});

module.exports = router;
