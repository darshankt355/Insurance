import mongoose from "mongoose";

const insuranceSchema = new mongoose.Schema({


  companyName: {
    type: String,
    required: true
  },


  planName: {
    type: String,
    required: true
  },


  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },


  basePremium: {
    type: Number,
    required: true
  },

  premiumType: {
    type: String,
    enum: ["monthly", "yearly"]
  },


  coverageAmount: Number,


  benefits: [String],


  exclusions: [String],




  redirectLink: String,


  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("Insurance", insuranceSchema);