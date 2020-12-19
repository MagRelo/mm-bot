const mongoose = require('mongoose');
// const nanoid = require('nanoid');

//
// User
//
const UserSchema = new mongoose.Schema(
  {
    discordUser: String,
    username: String,

    mmBalance: {
      type: Number,
      default: 100,
    },
    clap: Number,
    encore: Number,

    // displayName: String,
    // caption: String,
    // avatar: String,
    // type: {
    //   type: String,
    //   enum: ['Standard', 'Admin', 'Closed'],
    //   default: 'Standard',
    // },
    // status: {
    //   type: String,
    //   enum: ['Pending', 'NewSubscriber', 'Active', 'Closed'],
    //   default: 'Pending',
    // },

    // needsOnboarding: {
    //   type: Boolean,
    //   default: true,
    // },

    // follows: { type: Array, default: [] },
  },
  { timestamps: true, strict: false }
);

exports.UserModel = mongoose.model('User', UserSchema);
