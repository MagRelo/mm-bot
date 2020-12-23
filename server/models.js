const mongoose = require('mongoose');

//
// User
//
const UserSchema = new mongoose.Schema(
  {
    discordId: String,
    username: String,
    mmBalance: {
      type: Number,
      default: 100,
    },
    clap: Number,
  },
  { timestamps: true, strict: false }
);

exports.UserModel = mongoose.model('User', UserSchema);

//
// Game
//
const GameSchema = new mongoose.Schema(
  {
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['Pending', 'NewSubscriber', 'Active', 'Closed'],
      default: 'Pending',
    },
  },
  { timestamps: true, strict: false }
);

exports.GameModel = mongoose.model('Game', GameSchema);
