/*
 * This is the queues database control module, it only has database-related
 * functions.
 */

/*
import { Sequelize } from 'sequelize';
import path from 'path';

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: path.resolve(__dirname, '../db/queues.sqlite'),
});

export default class Queues {
  model = sequelize.define(
    'queues',
    {
      name: Sequelize.STRING,
      songs: Sequelize.ARRAY(Sequelize.TEXT),
    },
    {
      freezeTableName: true,
      timestamps: false,
      tableName: 'queues',
    }
  );

  create = async (i_name: string, i_songs: string) =>
    await this.model.create({
      name: i_name,
      songs: i_songs,
    });

  find = async (i_name: string) => {
    try {
      const search = await this.model.findOne({ where: { name: i_name } });
      return search.getDataValue('songs');
    } catch (e) {
      console.error('Couln`t find table  ' + i_name + 'in Queues.find');
      throw new Error('Couldnt find table');
    }
  };

  delete = async (i_name: string) => {
    try {
      await this.model.destroy({ where: { name: i_name } });
    } catch (e) {
      console.error('Couldnt find table: ' + i_name + ' in Queues.delete');
      throw new Error('Couldnt find table');
    }
  };

  all = async () => await this.model.findAll();

  sync = async () => await this.model.sync();
}
*/
