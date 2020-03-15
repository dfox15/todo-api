var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var Sequelize = require('sequelize');
const Op = Sequelize.Op;

var app = express();
var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Todo API Root');
});

// GET /todos?completed=true
app.get('/todos', (req, res) => {
    var query = req.query;
    var where = {};

    if (query.hasOwnProperty('completed') && query.completed === 'true') {
        where.completed = true;
    } else if (
        query.hasOwnProperty('completed') && query.completed === 'false') {
        where.completed = false;
    }

    if (query.hasOwnProperty('q') && query.q.length > 0) {
        where.description = {
            [Op.like]: '%' + query.q + '%'
        };
    }

    db.todo.findAll({ 
            where: where 
        }).then(
        todos => {
            res.json(todos);
        },
        e => {
            res.status(500).json(e);
        }
    );
});

// GET /todos/:id
app.get('/todos/:id', (req, res) => {
    var todoId = parseInt(req.params.id, 10);

    db.todo.findById(todoId).then(
        todo => {
            if (!!todo) {
                res.json(todo.toJSON());
            } else {
                res.status(404).send();
            }
        },
        e => {
            res.status(500).send();
        }
    );
});

// POST /todos
app.post('/todos', (req, res) => {
    var body = _.pick(req.body, 'description', 'completed');

    db.todo.create(body).then(
        todo => {
            res.json(todo.toJSON());
        },
        e => {
            res.status(400).json(e);
        }
    );
});

// DELETE /todos/:id
app.delete('/todos/:id', (req, res) => {
    var todoId = parseInt(req.params.id, 10);
    db.todo
        .destroy({
            where: {
                id: todoId
            }
        })
        .then(
            rowsDeleted => {
                if (rowsDeleted === 0) {
                    res.status(404).json({
                        error: 'No todo with id'
                    });
                } else {
                    res.status(204).send();
                }
            },
            () => {
                res.status(500).send();
            }
        );
});

// PUT /todos/:id
app.put('/todos/:id', (req, res) => {
    var body = _.pick(req.body, 'description', 'completed');
    var todoId = parseInt(req.params.id, 10);
    var attributes = {};

    if (body.hasOwnProperty('completed')) {
        attributes.completed = body.completed;
    }

    if (body.hasOwnProperty('description')) {
        attributes.description = body.description;
    }

    db.todo.findById(todoId).then(
        todo => {
            if (todo) {
                todo.update(attributes).then(
                    todo => {
                        res.json(todo.toJSON());
                    },
                    e => {
                        res.status(400).json(e);
                    }
                );
            } else {
                res.status(404).send();
            }
        },
        () => {
            res.status(500).send();
        }
    );
});

app.post('/users', (req, res) => {
    var body = _.pick(req.body, 'email', 'password');

    db.user.create(body).then(
        user => {
            res.json(user.toJSON());
        },
        e => {
            res.status(400).json(e);
        }
    );
});

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log('Express listening on port ' + PORT + '!');
    });
});
