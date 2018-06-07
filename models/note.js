var mongoose = require("mongoose");

// Save Reference to Schema Constructor
var Schema = mongoose.Schema;

// Create a new NoteSchema object
var NoteSchema = new Schema({
  title: String,
  body: String
});

// Create Model From Above Schema (Mongoose's Model Method)
var Note = mongoose.model("Note", NoteSchema);

// Export Note Model
module.exports = Note;
