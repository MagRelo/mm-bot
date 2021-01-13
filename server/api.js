var express = require('express');
var router = express.Router();

const { announce } = require('./integrations/discord');
const { sendUserUpdate, sendGameUpdate } = require('./sockets');
const { handleClap, getGameState } = require('./controllers/game');
const { hitBeachBall } = require('./controllers/beachball');

router.post('/clap', async (req, res) => {
  try {
    // update user & target
    const user = await handleClap(req.body);
    announce(buildClapMessage(user.username, req.body.amount));

    // update game
    const updatedGame = await getGameState();
    sendGameUpdate({ game: updatedGame, user: user });

    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.post('/hitball', async (req, res) => {
  try {
    // find beachball, update user & ball
    const user = await hitBeachBall({ discordId: req.body.discordId });

    // update client
    await sendUserUpdate(user);

    // announce in channel
    announce(`${user.username} hit the beachball +10 💸 `);

    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get('*', async (req, res) => {
  res.status(404).send();
});

module.exports = router;

function buildClapMessage(username, amount) {
  let clapEmoji = ':clap:';

  if (amount === 1) {
    return `${username} ${clapEmoji}`;
  } else {
    return `${username} ${clapEmoji.repeat(amount)}`;
  }
}
