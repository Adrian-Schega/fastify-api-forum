# Fastify API Forum

Aplikacja API forum zbudowana z użyciem Fastify z autoryzacją JWT i bazą danych MySQL.

## Funkcjonalności

- 🚀 Szybkie API oparte na Fastify
- 🔐 Autoryzacja JWT z middleware
- 🛡️ System zarządzania rolami użytkowników
- 🗄️ Integracja z bazą danych MySQL za pomocą Knex.js
- 🔒 Hashowanie haseł z bcrypt
- 📋 Migracje bazy danych
- 🍪 Zarządzanie sesjami przez cookies
- 🛠️ Środowisko development i production
- 🌐 Obsługa CORS
- 💬 System forum z kategoriami, forami i postami
- 📁 Hierarchiczna struktura kategorii i forów

## Technologie

- **Fastify** - Szybki i wydajny framework webowy
- **JWT** - JSON Web Tokens do autoryzacji
- **MySQL** - Baza danych
- **Knex.js** - Query builder i migracje
- **bcrypt** - Hashowanie haseł
- **@fastify/cors** - Obsługa CORS
- **@fastify/cookie** - Zarządzanie cookies

## Wymagania

- Node.js (v14 lub nowszy)
- MySQL
- npm lub yarn

## Instalacja

1. Sklonuj repozytorium:
```bash
git clone https://github.com/Adrian-Schega/fastify-api-forum.git
cd fastify-api-forum
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
│   │   ├── auth.controller.js
│   │   ├── categories.controller.js
│   │   ├── forums.controller.js
│   │   └── posts.controller.js
│   ├── database/              # Konfiguracja bazy danych
│   │   └── migrations/        # Migracje
│   │       ├── 20250703034540_create_users_table.js
│   │       ├── 20250710190843_create_categories_table.js
│   │       ├── 20250710190844_create_forum_table.js
│   │       └── 20250710193806_craete_posts_table.js
│   ├── middlewares/           # Middleware
│   │   ├── auth.middleware.js # Autoryzacja JWT
│   │   └── role.middleware.js # Zarządzanie rolami
│   ├── plugins/               # Pluginy Fastify
│   │   ├── bcrypt.js
│   │   ├── database.js
│   │   └── jwt.js
│   └── routes/                # Definicje tras
│       ├── auth.routes.js
│       ├── categories.routes.js
│       ├── forum.routes.js
│       └── posts.routes.js
├── knexfile.js                # Konfiguracja Knex.js
└── package.json
```

## API Endpoints

### Autoryzacja

- `POST /api/auth/register` - Rejestracja użytkownika (publiczna)
- `POST /api/auth/login` - Logowanie użytkownika (publiczna)
- `POST /api/auth/logout` - Wylogowanie użytkownika (chroniona)
- `POST /api/auth/me` - Pobieranie informacji o aktualnie zalogowanym użytkowniku (chroniona)

### Kategorie

- `GET /api/categories` - Pobieranie wszystkich kategorii (publiczna)
- `GET /api/categories/:id` - Pobieranie konkretnej kategorii (publiczna)
- `POST /api/categories` - Tworzenie nowej kategorii (chroniona - admin)
- `PUT /api/categories/:id` - Aktualizowanie kategorii (chroniona - admin)
- `DELETE /api/categories/:id` - Usuwanie kategorii (chroniona - admin)
- `GET /api/categories/:id/forums` - Pobieranie forów z konkretnej kategorii (publiczna)

### Fora

- `GET /api/forums` - Pobieranie wszystkich forów (publiczna)
- `GET /api/forums/:id` - Pobieranie konkretnego forum (publiczna)
- `POST /api/forums` - Tworzenie nowego forum (chroniona - admin)
- `PUT /api/forums/:id` - Aktualizowanie forum (chroniona - admin)
- `DELETE /api/forums/:id` - Usuwanie forum (chroniona - admin)
- `GET /api/forums/:id/posts` - Pobieranie postów z konkretnego forum (publiczna)

### Posty

- `GET /api/posts` - Pobieranie wszystkich postów (publiczna)
- `GET /api/posts/:id` - Pobieranie konkretnego postu (publiczna)
- `POST /api/posts` - Tworzenie nowego postu (chroniona - user)
- `PUT /api/posts/:id` - Aktualizowanie postu (chroniona - user)
- `DELETE /api/posts/:id` - Usuwanie postu (chroniona - admin)

## Przykłady użycia API

### Rejestracja użytkownika
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### Logowanie
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### Tworzenie kategorii (wymaga uprawnień admina)
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -H "Cookie: auth_token=YOUR_JWT_TOKEN" \
  -d '{
    "name": "Programowanie",
    "description": "Wszystko o programowaniu",
    "slug": "programowanie"
  }'
```

### Tworzenie forum
```bash
curl -X POST http://localhost:3000/api/forums \
  -H "Content-Type: application/json" \
  -H "Cookie: auth_token=YOUR_JWT_TOKEN" \
  -d '{
    "name": "JavaScript",
    "description": "Forum o języku JavaScript",
    "slug": "javascript",
    "category_id": 1
  }'
```

### Tworzenie postu
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Cookie: auth_token=YOUR_JWT_TOKEN" \
  -d '{
    "title": "Jak zacząć z React?",
    "content": "Potrzebuję pomocy z rozpoczęciem nauki React..."
  }'
```

### Pobieranie postów z konkretnego forum
```bash
curl -X GET http://localhost:3000/api/forums/1/posts
```

## Middleware

#### Autoryzacja
- **`authMiddleware`** - Sprawdza token JWT w ciasteczku `auth_token`
- **`requireRole(role)`** - Wymaga konkretnej roli użytkownika

#### Przykład użycia middleware:
```javascript
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

// Chroniona trasa tylko dla adminów
fastify.get('/admin-panel', { 
  preHandler: [authMiddleware, requireRole('admin')] 
}, handler);

```

## Baza danych

Projekt wykorzystuje MySQL z migracjami Knex.js. 

### Struktura bazy danych:

- **users** - Użytkownicy systemu
- **categories** - Kategorie forum
- **forums** - Fora (mogą mieć kategorię nadrzędną i podfora)
- **posts** - Posty w forach

### Relacje:

- `forums.category_id` → `categories.id`
- `forums.parent_id` → `forums.id` (hierarchia forów)
- `forums.created_by` → `users.id`
- `posts.created_by` → `users.id`

**Uwaga:** Tabela `posts` w obecnej wersji nie ma pola `forum_id` - posty nie są jeszcze przypisane do konkretnych forów.

### Migracje:

Aby stworzyć nową migrację:

```bash
npx knex migrate:make nazwa_migracji
```

Aby uruchomić migracje:

```bash
npx knex migrate:latest
```

Aby cofnąć migrację:

```bash
npx knex migrate:rollback
```

## Licencja

MIT