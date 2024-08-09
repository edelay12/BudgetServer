const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");
const { Sequelize, Model, DataTypes } = require("sequelize");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//setup sequilize
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

// Define User model
class Todo extends Model {}
Todo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  },
  { sequelize, modelName: "todo" }
);

/* 
 id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      todo: {
        type: DataTypes.STRING,
        unique: true,
      },
      completed: {
          type: DataTypes.BOOLEAN,
      }
*/

// Sync models with database
sequelize.sync();

// Middleware for parsing request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CRUD routes for todo model
app.get("/todos", async (req, res) => {
  const todos = await Todo.findAll();
  res.json(todos);
});

app.get("/todos/:id", async (req, res) => {
  const todo = await Todo.findByPk(req.params.id);
  res.json(todo);
});

app.post("/todos", async (req, res) => {
  Todo.create(req.body);
  const todos = await Todo.findAll();
  res.json(todos);
});

app.put("/todos/:id", async (req, res) => {
  const todo = await Todo.findByPk(req.params.id);
  if (todo) {
    await todo.update(req.body);
    res.json(todo);
  } else {
    res.status(404).json({ message: "Todo not found" });
  }
});

app.delete("/todos/:id", async (req, res) => {
  const todo = await Todo.findByPk(req.params.id);
  if (todo) {
    await todo.destroy();
    res.json({ message: "Todo deleted" });
  } else {
    res.status(404).json({ message: "Todo not found" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
