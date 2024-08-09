const express = require("express");
const bodyParser = require("body-parser");
const { Sequelize, Model, DataTypes } = require("sequelize");
// const billsRouter = require("./src/bills-router");

const app = express();
const port = 3000;
// app.use("/bills", billsRouter);

let maxAllowence = 1367;
// check date if first of month, update max allowance, erase expenses
//have app setting the clears all expenses for new month

// Create Sequelize instance
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

// Define expense model
class Expense extends Model {}
Expense.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
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
      defaultValue: "expense",
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    //add more fields as needed
  },
  { sequelize, modelName: "expense" }
);

class Bill extends Model {}
Bill.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
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
      defaultValue: "bill",
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    //add more fields as needed
  },
  { sequelize, modelName: "bill" }
);

class Subscription extends Model {}
Subscription.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
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
      defaultValue: "subscription",
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    //add more fields as needed
  },
  { sequelize, modelName: "subscription" }
);

// Define allowence model
class Allowence extends Model {}
Allowence.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: maxAllowence,
    },

    //add more fields as needed
  },
  { sequelize, modelName: "allowence" }
);
//connecting app to routers
// Sync models with database
sequelize.sync();

// Middleware for parsing request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CRUD routes for expense model
app.get("/expenses", async (req, res) => {
  const expenses = await Expense.findAll();
  res.json(expenses);
});

app.get("/expenses/:id", async (req, res) => {
  const expense = await Expense.findByPk(req.params.id);
  res.json(expense);
});

app.post("/expenses", async (req, res) => {
  const expense = await Expense.create(req.body);
  res.json(expense);
});

app.put("/expenses/:id", async (req, res) => {
  const expense = await Expense.findByPk(req.params.id);
  if (expense) {
    await expense.update(req.body);
    res.json(expense);
  } else {
    res.status(404).json({ message: "expense not found" });
  }
});

app.delete("/expenses/:id", async (req, res) => {
  const expense = await Expense.findByPk(req.params.id);
  if (expense) {
    await expense.destroy();
    console.log("expense deleted");
    const expenses = await Expense.findAll();
    res.json(expenses);
  } else {
    res.status(404).json({ message: "expense not found" });
  }
});

//reset month
app.delete("/expenses/reset", async (req, res) => {
  const expenses = await Expense.findAll();
  // const bills = await Bill.findAll();
  //const subscriptions = await Subscription.findAll();

  if (expenses) {
    await expenses.forEach((expense) => expense.destroy());
    if (expenses.length === 0) {
      res.json({ message: "All expenses cleared" });
    }
  } else {
    res.status(404).json({ message: "No expenses found" });
  }
  /*if (bills) {
    await bills.forEach((bill) => bill.destroy());
  }
  if (subscriptions) {
    await subscriptions.forEach((subscription) => subscription.destroy());
  } */
});
//bills router
app.get("/bills", async (req, res) => {
  const bills = await Bill.findAll();
  res.json(bills);
});
app.post("/bills", async (req, res) => {
  const bill = await Bill.create(req.body);
  res.json(bill);
});

app.delete("/bills/:id", async (req, res) => {
  const bill = await Bill.findByPk(req.params.id);
  if (bill) {
    await bill.destroy();
    console.log("bill deleted");
    const bills = await Bill.findAll();
    res.json(bills);
  } else {
    res.status(404).json({ message: "bill not found" });
  }
});
app.get("/subscriptions", async (req, res) => {
  const subscriptions = await Subscription.findAll();
  res.json(subscriptions);
});
app.post("/subscriptions", async (req, res) => {
  const subscription = await Subscription.create(req.body);
  res.json(subscription);
});

app.delete("/subscriptions/:id", async (req, res) => {
  const subscription = await Subscription.findByPk(req.params.id);
  if (subscription) {
    await subscription.destroy();
    console.log("subscription deleted");
    const subscriptions = await Subscription.findAll();
    res.json(subscriptions);
  } else {
    res.status(404).json({ message: "subscription not found" });
  }
});

app.get("/allowence/:id", async (req, res) => {
  const allowence = await Allowence.findAll();

  if (allowence != null && allowence.length > 0) {
    res.json(allowence);
  } else {
    const newAllowence = await Allowence.create({ amount: maxAllowence });
    res.json(newAllowence);
  }
});

app.put("/allowence/:id", async (req, res) => {
  const allowence = await Allowence.findByPk(req.params.id);
  if (allowence) {
    // subtract all expenses from max allowence
    // update allowence in database
    // return allowence
    const expenses = await Expense.findAll();
    const bills = await Bill.findAll();
    const subscriptions = await Subscription.findAll();
    expenses.forEach((expense) => {
      if (expense.type === "Expense") {
        allowence -= expense.amount;
      }
    });
    bills.forEach((bill) => {
      if (bill.type === "Bill") {
        allowence -= bill.amount;
      }
    });
    subscriptions.forEach((subscription) => {
      if (subscription.type === "Subscription") {
        allowence -= subscription.amount;
      }
    });
    const updatedAllowence = await Allowence.update(
      { amount: allowence },
      { where: { id: req.params.id } }
    );
    // await allowence.update(req.body);
    res.json(updatedAllowence);
  } else {
    res.status(404).json({ message: "allowence not found" });
  }
});

/*app.put("/allowence/:id", async (req, res) => {
  const allowence = await Allowence.findByPk(req.params.id);
  if (allowence) {
    await allowence.update(req.body);
    res.json(allowence);
  } else {
    res.status(404).json({ message: "allowence not found" });
  }
});*/
//delete expenses wehn the month ends
app.get("/allowence", async (req, res) => {
  const allowence = await Allowence.findAll();
  if (!allowence.length) {
    console.log("allowence not found, creating new one", allowence);
    const newAllowence = await Allowence.create({ amount: maxAllowence });
    return res.json(newAllowence.amount);
  }
  console.log("update allowence", allowence[0].amount);
  let allowenceNew = allowence[0].amount;
  const expenses = await Expense.findAll();
  const bills = await Bill.findAll();
  const subscriptions = await Subscription.findAll();

  expenses.forEach((expense) => {
    console.log("expense: ", expense.amount);
    // if (expense.type === "Expense") {
    allowenceNew -= expense.amount;
    //}
  });

  if (bills.length > 0) {
    bills.forEach((bill) => {
      //if (bill.type === "Bill") {
      allowenceNew -= bill.amount;
      // }
    });
  }
  if (subscriptions.length > 0) {
    subscriptions.forEach((subscription) => {
      // if (subscription.type === "Subscription") {
      allowenceNew -= subscription.amount;
      //  }
    });
  }
  console.log("allowence after expenses: ", allowenceNew);
  /* const updatedAllowence = await Allowence.update(
    { amount: allowenceNew },
    { where: { id: 1 } }
  ); */
  res.json(allowenceNew);
});

app.get("/piegraph", async (req, res) => {
  const expenses = await Expense.findAll();
  const bills = await Bill.findAll();
  const subscriptions = await Subscription.findAll();

  let pieChartData = {
    labels: ["Expenses", "Bills", "Subscriptions"],
    datasets: [
      {
        data: [
          expenses.reduce((acc, curr) => acc + curr.amount, 0),
          bills.reduce((acc, curr) => acc + curr.amount, 0),
          subscriptions.reduce((acc, curr) => acc + curr.amount, 0),
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 205, 86, 0.2)",
        ],
      },
    ],
  };

  res.json(pieChartData);
});
/*  const expenses = await Expense.findAll();
    if (expenses.length > 0) {
      const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount);
      console.log("Total expenses: ", totalExpenses);
      let newAllowence = allowence - totalExpenses;
      newAllowence > 0 ? res.json(newAllowence) : res.json(0);
    } else {
      const newAllowence = await Allowence.create({ amount: maxAllowence });
      res.json(newAllowence);
    }
  } */

// Subtract all expenses from max allowence
//update allowence in database
//return allowence
//});

/*expenses.forEach((expense) => {
    if (expense.type === "expense") {
      maxAllowence -= expense.amount;
    }
  });
  res.json(expenses);
}); */

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
