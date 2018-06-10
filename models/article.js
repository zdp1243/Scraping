//NPM Package Requirements
var mongoose = require("mongoose");

// Save Reference to Schema Constructor
var Schema = mongoose.Schema;

// Create New UserSchema Object
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },

  link: {
    type: String,
    required: true
  },

  summary: {
    type: String,
    required: true
  },

  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});
var Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;
