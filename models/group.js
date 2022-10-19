'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User,BelongTo,SpendingGroup,Message}) {
      this.belongsTo(User,{foreignKey:'user_id'})
      this.hasMany(BelongTo,{foreignKey:'group_id'})
      this.hasMany(SpendingGroup,{foreignKey:'group_id'})
      this.hasMany(Message,{foreignKey:'group_id'})
    }
  }
  Group.init({
    groupname: DataTypes.STRING,
    purpose: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};