const express = require("express");
const { Sequelize, Model, DataTypes } = require("sequelize");

const billsRouter = express.Router();
const bodyParser = require("body-parser");

const app = express();

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "../database.sqlite",
});

// Define bill model
class Bill extends Model {}
Bill.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    bill: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    //add more fields as needed
  },
  { sequelize, modelName: "bill" }
);

// Sync models with database
sequelize.sync();

// Middleware for parsing request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CRUD routes for bill model
billsRouter.get("/bills", async (req, res) => {
  const bills = await Bill.findAll();
  res.json(bills);
});

billsRouter.get("/bills/:id", async (req, res) => {
  const bill = await Bill.findByPk(req.params.id);
  res.json(bill);
});

billsRouter.post("/bills", async (req, res) => {
  const bill = await Bill.create(req.body);
  res.json(bill);
});

module.exports = billsRouter;
