module.exports = (sequelize, DataType) => {
    const TypeUser = sequelize.define('TypeUser', {
        name: {
            type: DataType.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        alias: {
            type: DataType.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    })

    TypeUser.associate = (models) => {
        TypeUser.hasMany(models.User, { onDelete: 'CASCADE', hooks: true })
    }

    return TypeUser
}
