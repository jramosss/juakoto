const { Sequelize } = require("sequelize");
const path = require('path')

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
    storage: path.resolve(__dirname,'../db/queues.sqlite'),
});

module.exports = class Queues {

    model = sequelize.define('queues',{
        name : Sequelize.STRING,
        songs : Sequelize.ARRAY(Sequelize.TEXT),
    },
    {
        freezeTableName : true,
        timestamps : false,
        tableName : 'queues',
    });

    create = async (i_name,i_songs) =>
        await this.model.create({
            name : i_name,
            songs : i_songs,
        });

    find = async (i_name) => {
        try {
            const search = await this.model.findOne({where : {name : i_name}})
            return search.getDataValue('songs');
        }
        catch (e) {
            console.log("Couln`t find table ",i_name);
            throw new Error('Couldnt find table');
        }
    }
    
    delete = async(i_name) => {
        try {
            await this.model.destroy({where : {name : i_name}});
        }
        catch (e) {
            console.log("Couldnt find table: ",i_name);
            throw new Error('Couldnt find table');
        }
    }

    all = async () => await this.model.findAll();

    sync = async () => await this.model.sync();
}