'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({IncomeSpending,Group,BelongTo,SpendingGroup,Warning,Message}) {
      this.hasMany(IncomeSpending, {foreignKey: 'user_id'})
      this.hasMany(Group, {foreignKey: 'user_id'})
      this.hasMany(BelongTo, {foreignKey: 'user_id'})
      this.hasMany(SpendingGroup, {foreignKey: 'user_id'})
      this.hasMany(Warning,{foreignKey:'user_id'})
      this.hasMany(Message,{foreignKey:'user_id'})
    }
  }
  User.init({
    fullname: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    active: DataTypes.INTEGER,
    role: DataTypes.STRING,
    avatar: DataTypes.STRING,
    email: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};