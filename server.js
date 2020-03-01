var express = require("express");
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [
  {
    id: 1,
    description: "Clean room",
    completed: false
  },
  {
    id: 2,
    description: "Go to market",
    completed: false
  },
  {
    id: 3,
    description: "Pick-up DJ from daycare",
    completed: true
  }
];

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
  console.log('Todo id: ' + todoId + ' typeof: ' + (typeof todoId));

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

app.listen(PORT, () => {
  console.log("Express listening on port " + PORT + "!");
});
