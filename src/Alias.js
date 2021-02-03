const { Sequelize } = require("sequelize");
const path = require('path')

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: path.resolve(__dirname,'../db/aliases.sqlite'),
});

const Alias = sequelize.define('alias', {
    alias : Sequelize.STRING,
    link : Sequelize.STRING,
});

class AliasUtils {

    //i stands for input
    create = async (i_alias,i_link) => 
        await Alias.create({
            alias : i_alias,
            link : i_link,
        });
    
    find = async (i_alias) =>
        await Alias.findOne({where : {alias : i_alias}});

    //you only redefine the link, but i need the alias to find the row
    redefine = async (i_alias,i_link) => {
        const affected_rows = await Alias.update
            ({link : i_link},{where : {alias : i_alias}});

        if (affected_rows <= 0)
            throw Error("Couldn`t find wanted row");
    }

    delete = async (i_alias) => {
        try {
            await Alias.destroy({where : {alias : i_alias}});
        }
        catch (e) {
            throw Error("Alias does not exist");
        }
    }

    all = async () => {
        const db_all = await Alias.findAll();
        const dict = {};

        for (let i = 0; i < db_all.length; i++)
            dict[db_all[i].dataValues.alias] = db_all[i].dataValues.link;

        return dict;
    } 
}

module.exports = {Alias,AliasUtils};