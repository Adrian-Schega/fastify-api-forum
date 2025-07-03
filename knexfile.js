import 'dotenv/config'

export default {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'my_database',
    },
    migrations: {
      directory: './src/database/migrations',
      extension: 'js'
    },
    seeds: {
      directory: './src/database/seeds'
    }
  }
};