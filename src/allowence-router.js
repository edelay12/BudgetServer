// Define expense model
class allowence extends Model {}
allowence.init(
  {
    amount: DataTypes.NUMBER,

    //add more fields as needed
  },
  { sequelize, modelName: "allowence" }
);
