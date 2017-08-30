'use strict';
module.exports = function(sequelize, DataTypes) {
  var settings = sequelize.define('settings', {
    app_id: {
      type: DataTypes.STRING
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return settings;
};