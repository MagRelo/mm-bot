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

const BeachBallSchema = new mongoose.Schema(
  {
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    expires: Date,
    hitBallTime: Date,
    didHit: Boolean,
  },
  { timestamps: true, strict: false }
);

exports.BeachBallModel = mongoose.model('BeachBall', BeachBallSchema);
