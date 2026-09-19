import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {

  firstName: {
    type: String,
    required: true
  },


  lastName: String,

  username: {
    type: String,
    unique: true,
    required: true
  },

  email:  {
    type: String,
    unique: true,
    required: true
  },

  phone: {
    type: String,
    unique: true,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  gender:{
    type:String,
    required:true
  },
  dateOfBirth: {
    type: Date,
    default: Date.now
  },

  role: {
    type: String,
    enum: ["admin","employee","consumer"],
    default: "consumer"
  },

  status: {
    type: String,
    default: "active"
  },

  profileCompleted: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const users=mongoose.model("User", userSchema);
export default users;