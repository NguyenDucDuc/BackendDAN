'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User,Group}) {
      this.belongsTo(User,{foreignKey: 'user_id'})
      this.belongsTo(Group, {foreignKey: 'group_id'})
    }
  }
  Message.init({
    user_id: DataTypes.INTEGER,
    group_id: DataTypes.INTEGER,
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};