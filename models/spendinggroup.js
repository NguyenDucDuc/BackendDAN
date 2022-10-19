'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpendingGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User,Group}) {
      this.belongsTo(User, {foreignKey: 'user_id'})
      this.belongsTo(Group, {foreignKey: 'group_id'})
    }
  }
  SpendingGroup.init({
    user_id: DataTypes.INTEGER,
    group_id: DataTypes.INTEGER,
    money: DataTypes.DECIMAL,
    purpose: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SpendingGroup',
  });
  return SpendingGroup;
};