'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class IncomeSpending extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User}) {
      this.belongsTo(User,{foreignKey:'user_id'})
    }
  }
  IncomeSpending.init({
    money: DataTypes.DECIMAL,
    purpose: DataTypes.STRING,
    type: DataTypes.STRING,
    jar: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'IncomeSpending',
  });
  return IncomeSpending;
};