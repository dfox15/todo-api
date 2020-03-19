module.exports = (sequelize, DataTypes) => {
    return sequelize.define('todo', {
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 250],
                isString: (value) => {
                    if(typeof value !== 'string') {
                        throw new Error('Description must be a string');
                    }
                }
            }
        },
        completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            validate: {
                isBoolean: (value) => {
                    if(typeof value !== 'boolean') {
                        throw new Error('Completed must be a boolean');
                    }
                }
            }
        }
    });
};
