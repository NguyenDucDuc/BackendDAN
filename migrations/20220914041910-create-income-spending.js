'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('IncomeSpendings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      money: {
        type: Sequelize.DECIMAL
      },
      purpose: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING(10)
      },
      jar: {
        type: Sequelize.STRING(10)
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key:'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('IncomeSpendings');
  }
};