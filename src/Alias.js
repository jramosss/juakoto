const { Sequelize } = require("sequelize");
const path = require('path')

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
    storage: path.resolve(__dirname,'../db/aliases.sqlite'),
});

module.exports = class AliasUtils {

    model = sequelize.define('alias',{
        name : Sequelize.STRING,
        link : Sequelize.STRING,
    },
    {
        freezeTableName : true,
        timestamps : false,
        underscored : true,
        tableName : 'alias',
    })

    //i stands for input
    create = async (i_name,i_link) => 
        await this.model.create({
            name : i_name,
            link : i_link,
        });
    
    find = async (i_name) =>
        await this.model.findOne({where : {name : i_name}});

    //you only redefine the link, but i need the this.model to find the row
    redefine = async (i_name,i_link) => {
        const affected_rows = await this.model.update
            ({link : i_link},{where : {name : i_name}});

        if (affected_rows <= 0)
            throw Error("Couldn`t find wanted row");
    }

    delete = async (i_name) => {
        try {
            await this.model.destroy({where : {name : i_name}});
        }
        catch (e) {
            throw Error("this.model does not exist");
        }
    }

    all = async () => {
        const db_all = await this.model.findAll();
        const dict = {};

        for (let i = 0; i < db_all.length; i++)
            dict[db_all[i].dataValues.name] = db_all[i].dataValues.link;

        return dict;
    } 

    sync = async () => await this.model.sync(); 
}
