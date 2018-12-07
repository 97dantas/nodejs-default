
module.exports = (sequelize, DataType) => {
    const Users = sequelize.define('User', {

        name: {
            type: DataType.STRING,
            allowNull: true,
            validate: {
                notEmpty: false
            }
        },

        token: {
            type: DataType.TEXT
        },

        forgot: {
            type: DataType.TEXT
        },

        active: {
            type: DataType.TEXT
        },

        phone: {
            type: DataType.STRING,
            allowNull: true,
            validate: {
                notEmpty: false
            }
        },

        email: {
            type: DataType.STRING,
            unique: {
                args: true,
                msg: 'Este e-mail já está sendo usado...'
            },
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        avatar: {
            type: DataType.STRING
        },

        password: {
            type: DataType.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        first: {
            type: DataType.BOOLEAN,
            defaultValue: true
        },

        steps: {
            type: DataType.INTEGER,
            defaultValue: 1
        },

        status: {
            type: DataType.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

        block: {
            type: DataType.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    })

    Users.associate = (models) => {
        Users.belongsTo(models.TypeUser, { foreignKey: { allowNull: false } })
    }

    return Users
}
