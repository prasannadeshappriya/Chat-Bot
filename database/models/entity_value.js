'use strict';
module.exports = function(sequelize, DataTypes) {
  var entity_value = sequelize.define('entity_value', {
    entity_id: {
      type:DataTypes.INTEGER,
      allowNull: false,
    },
    value: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    data: {
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
  return entity_value;
};