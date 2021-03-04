/*
 * INCOMPLETE
 * This is the stats database control module, it only has database-related
 * functions. 
*/

const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
    storage: '../db/stats.sqlite',
});

const command = sequelize.define('command',{
    command : Sequelize.STRING,
    count : Sequelize.INTEGER,
    },
    {
        freezeTableName : true,
        timestamps : false,
    }
);

const model = sequelize.define('stats',{
    user : Sequelize.STRING,
},
{
    freezeTableName : true,
    timestamps : false,
})

model.hasMany(command,{foreignKey : 'username'});
command.belongsTo(model);
module.exports = class Stats {
    //!This is a one to many, act like that

    create = async (uname) =>
        await this.model.create({user : uname});

    increment = async (uname,command) => {
        try {
            const table = await model.findOne({where : {user : uname}});
            const cc = table.getDataValue('command_count');
            console.log(cc);
        }
        catch (e) {
            console.log("Exception in increment: ",e);
        }

    }
}