// Define subscription model
class subscription extends Model {}
subscription.init(
  {
    amount: DataTypes.NUMBER,
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    category: DataTypes.STRING,
    date: DataTypes.DATE,
    //add more fields as needed
  },
  { sequelize, modelName: "subscription" }
);
