'use strict';
module.exports = function(sequelize, DataTypes) {
  var api_info = sequelize.define('api_info', {
    connection_data: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return api_info;
};