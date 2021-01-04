var express = require('express');
var router = express.Router();

const { announce } = require('./controllers/listener');
const { sendUserUpdate, sendGameUpdate } = require('./sockets');

const { hitBeachBall, handleClap } = require('./controllers/game');

router.post('/clap', async (req, res) => {
  
  try {
    // update user & target
    const user = await handleClap(data);
    announce(buildClapMessage(user.username, data.amount));

    // update game
    const updatedGame = await getGameState();
    sendGameUpdate({game: updatedGame, user: user})

    res.status(200).send(user);
  } catch (error) {
    console.log(error);

    // announce(`${error.username} dropped the beachball`);

    res.status(400).send();
  }
});

router.post('/hitball', async (req, res) => {
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
