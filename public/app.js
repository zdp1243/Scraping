// Grab the articles as a json
// $.getJSON("/", function(data) {
//   // For each one
//   for (var i = 0; i < data.length; i++) {
//     // Display the apropos information on the page
//     $("#articles").append(
//       "<p data-id='" +
//         data[i]._id +
//         "'>" +
//         data[i].title +
//         "<br />" +
//         data[i].summary +
//         "<br/>" +
//         data[i].link +
//         "</p>"
//     );
//   }
// });

// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append(
        "<button data-id='" + data._id + "' id='savenote'>Save Note</button>"
      );
      $("#notes").append(
        "<button data-id='" +
          data._id +
          "' id='deletenote'>Delete Note</button>"
      );

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
        // Place the summary of the note in the body text area
        $("#summaryinput").val(data.note.summary);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from summary
      summary: $("#summaryinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
  $("#summaryinput").val("");
});
//Note:  The article gets scraped and the id, title and summaries will appear.  If you click on any part of the article, the note form will appear.  The save and delete buttons don't work yet, and I did not attempt to deploy to Heroku without it working properly.  If I can get it working, then I will attempt Heroku.  I know the file structure isn't quite how I would have liked it to be, but I had issues when I made folders and I eventually just jettisoned them so it would work again...
