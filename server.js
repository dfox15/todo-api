var express = require("express");
var bodyParser = require('body-parser');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Todo API Root");
});

// GET /todos
app.get("/todos", (req, res) => {
  // Alternative to avoid using JSON.stringify() or JSON.parse().
  // This takes the parameter we want sent back to the caller (client/browser).
  // The conversion to JSON is implicit
  res.json(todos);
});

// GET /todos/:id
app.get("/todos/:id", (req, res) => {
  var todoId = parseInt(req.params.id, 10);

  var matchedTodo;

  todos.forEach((todo) => {
    if (todoId === todo.id) {
      matchedTodo = todo;
    }
  });

  if (matchedTodo) {
    res.json(matchedTodo);
  } else {
    res.status(404).send();
  }
});

// POST /todos
app.post('/todos', (req, res) => {
    var body = req.body;

    // add id field
    body.id =  todoNextId++;

    // push body into array
    todos.push(body);

    res.json(body);
});

app.listen(PORT, () => {
  console.log("Express listening on port " + PORT + "!");
});
