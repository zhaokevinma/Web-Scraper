// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    if (!data[i].saved) {
      // Display the apropos information on the page
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
      $("#articles").append("<button class='savearticle btn-primary' id='" + data[i]._id + "'> Save " + "</button>");
    }
  }
});

// Grab the articles as a json
$.getJSON("/saved", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#saved").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    $("#saved").append("<button class='unsavearticle btn-primary' id='" + data[i]._id + "'> Unsave " + "</button>");
  }
});

// When you click the save button to save an article
$(document).on("click", "#clear", function(event) {
  event.preventDefault();

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "GET",
    url: "/clear"
  })
    // With that done
    .then(function(data) {
      // Log the response
      // Now the response is not logging true in saved but in database it is saved
      //  -- P2 -- BUG 
      // Can revisit if time allowed
      console.log(data);
    });

  // Also, remove the values entered in the input and textarea for note entry
  $(this).text("Cleared");
  $(this).attr("disabled", true);
  location.reload();
});

// When you click the save button to save an article
$(document).on("click", "#scrape", function(event) {
  event.preventDefault();

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    // With that done
    .then(function(data) {
      // Log the response
      // Now the response is not logging true in saved but in database it is saved
      //  -- P2 -- BUG 
      // Can revisit if time allowed
      console.log(data);
      location.reload();
    });
});

// When you click the save button to save an article
$(document).on("click", ".savearticle", function(event) {
  event.preventDefault();
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/saved/" + thisId
  })
    // With that done
    .then(function(data) {
      // Log the response
      // Now the response is not logging true in saved but in database it is saved
      //  -- P2 -- BUG 
      // Can revisit if time allowed
      console.log(data);
    });

  // Also, remove the values entered in the input and textarea for note entry
  $(this).text("Saved");
  $(this).attr("disabled", true);
  location.reload();
});

// When you click the save button to save an article
$(document).on("click", ".unsavearticle", function(event) {
  event.preventDefault();
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/unsaved/" + thisId
  })
    // With that done
    .then(function(data) {
      // Log the response
      // Now the response is not logging true in saved but in database it is saved
      //  -- P2 -- BUG 
      // Can revisit if time allowed
      console.log(data);
    });

  // Also, remove the values entered in the input and textarea for note entry
  $(this).text("Saved");
  $(this).attr("disabled", true);
  location.reload();
});


// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

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
      $("#notes").append("<button data-id='" + data._id + "' id='savenote' class='btn-primary'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
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
});
