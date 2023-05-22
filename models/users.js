var mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z ]+$/.test(v);
        },
        message: props => `${props.value} is not a valid name!`
      }
    },

    last_name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z ]+$/.test(v);
        },
        message: props => `${props.value} is not a valid name!`
    }
  },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
        },
        message: props => `${props.value} is not a valid email!`
      }
    },

    password: {
      type: String,
      required: true,
      trim: true
    },

    created_at: {
      type: Date,
      default: Date.now
    },

    updated_at: {
      type: Date,
      default: Date.now
    }
  }
);

let users = mongoose.model("users", userSchema);

insertOne = async (query) => {
    try{
        const create = await users(query).save();
        return create;
    }catch (err) {
        return {err: err}
    }
}

findOne = async (query) => {
  try{
      const get = await users.findOne(query);
      return get
  }catch (err) {
      return {err: err}
  }
}

updateOne = async (match, query) => {
  try{
      const set = await  users.updateOne(match, query)
      return set
  }catch (err) {
      return {err: err.message}
  }
}

deleteOne = async (query) => {
  try{
      const set = await  users.deleteOne(query);
      return set
  }catch (err) {
      return {err: err.message}
  }
}


module.exports = {
  insertOne,
  findOne
}