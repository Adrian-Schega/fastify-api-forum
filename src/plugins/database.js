import fp from 'fastify-plugin';
import Knex from 'knex';
import knexConfig from '../../knexfile.js';

async function database(fastify, options) {
  
  const knex = Knex(knexConfig['development']);

  try {
    await knex.raw('SELECT 1');
    fastify.log.info('Połączenie z MySQL udane.');
  } catch (err) {
    fastify.log.error('Błąd połączenia z MySQL:', err);
    throw err;
  }

  fastify.decorate('db', knex);

  fastify.addHook('onClose', async (instance, done) => {
    await knex.destroy();
    done();
  });
}

export default fp(database);