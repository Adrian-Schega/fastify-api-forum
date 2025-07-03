import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'

import database from './plugins/database.js'
import jwt from './plugins/jwt.js'
import bcrypt from './plugins/bcrypt.js'

import AuthRoutes from './routes/auth.routes.js'

const fastify = Fastify({
  logger: process.env.NODE_ENV !== 'production' // Enable logging in development mode
})

fastify.register(cors, {
  origin: 'http://localhost', // Allow requests from this origin
  credentials: true // Allow credentials (cookies, authorization headers, etc.)
})

// Register database plugin // tworzenie połączenia z bazą danych, sprawdzanie połączenia
fastify.register(database)

// Register bcrypt plugin // szyfrowanie haseł
fastify.register(bcrypt)

// Register jwt plugin // tworzenie tokena, ustawianie cookie, weryfikacja tokena z cookie
fastify.register(jwt);

// Auth routes // rejestracja routów autoryzacji
fastify.register(AuthRoutes, { prefix: '/api/auth' })

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})