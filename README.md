# Fastify API

Aplikacja API zbudowana z użyciem Fastify z autoryzacją JWT i bazą danych MySQL.

## Funkcjonalności

- 🚀 Szybkie API oparte na Fastify
- 🔐 Autoryzacja JWT
- 🗄️ Integracja z bazą danych MySQL za pomocą Knex.js
- 🔒 Hashowanie haseł z bcrypt
- 📋 Migracje bazy danych
- 🛠️ Środowisko development i production

## Technologie

- **Fastify** - Szybki i wydajny framework webowy
- **JWT** - JSON Web Tokens do autoryzacji
- **MySQL** - Baza danych
- **Knex.js** - Query builder i migracje
- **bcrypt** - Hashowanie haseł

## Wymagania

- Node.js (v14 lub nowszy)
- MySQL
- npm lub yarn

## Instalacja

1. Sklonuj repozytorium:
```bash
git clone https://github.com/Adrian-Schega/fastify-api.git
cd fastify-api
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Skonfiguruj zmienne środowiskowe:
```bash
cp .env.example .env
```

4. Uruchom migracje bazy danych:
```bash
npx knex migrate:latest
```

## Konfiguracja

Utwórz plik `.env` z następującymi zmiennymi:

```env
JWT_TOKEN_SECRET=your_jwt_secret_key
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=api
```

## Uruchomienie

### Tryb development:
```bash
npm run dev
```

### Tryb production:
```bash
npm start
```

## Struktura projektu

```
├── src/
│   ├── server.js              # Główny plik serwera
│   ├── controllers/           # Kontrolery
│   │   └── auth.controller.js
│   ├── database/              # Konfiguracja bazy danych
│   │   └── migrations/        # Migracje
│   ├── plugins/               # Pluginy Fastify
│   │   ├── bcrypt.js
│   │   ├── database.js
│   │   └── jwt.js
│   └── routes/                # Definicje tras
│       └── auth.routes.js
├── knexfile.js                # Konfiguracja Knex.js
└── package.json
```

## API Endpoints

### Autoryzacja

- `POST /api/auth/register` - Rejestracja użytkownika
- `POST /api/auth/login` - Logowanie użytkownika
- `POST /api/auth/logout` - Wylogowanie użytkownika
- `POST /api/auth/me` - Pobieranie informacji o aktualnie zalogowanym użytkowniku

## Baza danych

Projekt wykorzystuje MySQL z migracjami Knex.js. Aby stworzyć nową migrację:

```bash
npx knex migrate:make nazwa_migracji
```

Aby uruchomić migracje:

```bash
npx knex migrate:latest
```

## Licencja

MIT