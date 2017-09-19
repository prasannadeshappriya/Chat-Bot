'use strict';
module.exports = function(sequelize, DataTypes) {
  let sesson_user = sequelize.define('sesson_user', {
    session_id: {
      type:DataTypes.STRING(10000),
      allowNull: false,
    },
    session_data: {
      type:DataTypes.STRING(10000),
      allowNull: false,
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return sesson_user;
};