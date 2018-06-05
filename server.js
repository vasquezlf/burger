// Dependencies
var connection = require("./config/connection.js");

var express = require("express");
var bodyParser = require("body-parser");

var app = express();

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 8088;

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// ********* Routes
// View JSON
app.get("/api", (req, res) => {
  let dbQuery = "SELECT * FROM burger";

  connection.query(dbQuery, function(err, result) {
    if (err) {
      return res.status(500).end();
    };

    res.json(result);
  });
})

// View main page and load table
app.get("/", (req, res) => {
  let dbQuery = "SELECT * FROM burger;";

  connection.query(dbQuery, function(err, result) {
    if (err) {
      return res.status(500).end();
    };
    // res.json(result);
    res.render("index", {burgers: result});

  });
})

// POST burgers to db
app.post("/api", function(req, res) {
  let dbQuery = "INSERT INTO burger (name) VALUES (?)"

  console.log("POST request: ", req.body.name);

  connection.query(dbQuery, [req.body.name], (err, result) => {
    if (err) {
      return res.status(500).end();
    }

    // Send back ID of the new burger
    // render to UI
    res.json({id: result.insertId})
    // log to terminal
    console.log({id: result.insertId});
  });
});

// Displays a single character, or returns false
// app.get("/api/list/:id", function(req, res) {
//   var chosen = req.params.id;
//
//   console.log(chosen);
//
//   for (var i = 0; i < result.length; i++) {
//     if (chosen === result[i].routeName) {
//       return res.json(result[i]);
//     }
//   }
//
//   return res.json(false);
// });


// Update a burger order. When "Eat Me!" button is clicked, eaten boolean is marked true
app.put("/api/:id", (req, res) => {

  console.log(req.body);
  connection.query("UPDATE burger SET eaten = 1 WHERE id = ?", [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).end();
    }

    else if (result.changedRows === 0) {
      // If no rows were changed, then ID must not exist, so 404
      return res.status(404).end();
    }

    // res.json({id: result.insertId})
    // console.log("this.sql: ", this.sql);
    res.status(200).end();
  });
});


// DELETE a burger order
app.delete("/api/:id", (req, res) => {
  connection.query("DELETE FROM burger WHERE id = ?", [req.params.id], (err, result) => {
    if(err) {
      return res.status(500).end();
    }
    else if (result.changedRows === 0) {
          // If no rows were changed, then ID must not exist, so 404
      return res.status(404).end();
    }
    res.status(200).end();

  });
});
// ******** ROUTES END

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});
