import fastify from "fastify";

export class AuthController {
    /**
     * Rejestracja nowego użytkownika
     */
  static async register(request, reply) {

    // Sprawdzenie, czy treść żądania nie jest pusta
    if (!request.body) {
      return reply.status(400).send({ success:false, message: 'Treść żądania nie może być pusta', data: null });
    }

    const { username, email, password, password_confirm } = request.body;

    // Sprawdzenie, czy wszystkie wymagane pola są obecne
    // Jeśli nie, zwróć błąd 400 z odpowiednim komunikatem
    if (!username || !email || !password || !password_confirm) {
      return reply.status(400).send({ success: false, message: 'Wszystkie pola są wymagane', data: null });
    }

    // Sprawdzenie czy username mieści się w zakresie
    // 3-20 znaków
    // Jeśli nie, zwróć błąd 400 z odpowiednim komunikatem
    if (username.length < 3 || username.length > 20) {
      return reply.status(400).send({ success: false, message: 'Nazwa użytkownika musi mieć od 3 do 20 znaków', data: null });
    }

    // Sprwadzenie czy username zawiera tylko dozwolone znaki
    // Dozwolone znaki to litery, cyfry i podkreślenia
    // Jeśli nie, zwróć błąd 400 z odpowiednim komunikatem
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return reply.status(400).send({ success: false, message: 'Nazwa użytkownika może zawierać tylko litery, cyfry i podkreślenia', data: null });
    }

    // Sprawdzenie, czy email ma prawidłowy format
    // Jeśli nie, zwróć błąd 400 z odpowiednim komunikatem
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return reply.status(400).send({ success: false, message: 'Nieprawidłowy format adresu e-mail', data: null });
    }

    // Sprawdzenie, czy hasło ma od 8 do 50 znaków
    // Jeśli nie, zwróć błąd 400 z odpowiednim komunikatem
    if (password.length < 8 || password.length > 50) {
      return reply.status(400).send({ success: false, message: 'Hasło musi mieć od 8 do 50 znaków', data: null });
    }

    // Sprawdzenie, czy hasło i potwierdzenie hasła są takie same
    // Jeśli nie, zwróć błąd 400 z odpowiednim komunikatem
    if (password !== password_confirm) {
      return reply.status(400).send({ success: false, message: 'Hasło i potwierdzenie hasła muszą być takie same', data: null });
    }

    try {
        // Sprawdzenie, czy użytkownik o podanej nazwie lub adresie e-mail już istnieje
        const existingUser = await request.server.db('users').where({ username }).orWhere({ email }).first();
        
        // Jeśli użytkownik już istnieje, zwróć błąd 400 z odpowiednim komunikatem
        if (existingUser) {
            return reply.status(400).send({ success: false, message: 'Użytkownik o podanej nazwie lub adresie e-mail już istnieje', data: null });
        }

        // Szyfrowanie hasła
        const hashedPassword = await request.server.bcrypt.hash(password, 12);
        
        // Wstawienie nowego użytkownika do bazy danych
        const [userId] = await request.server.db('users').insert({
            username,
            email,
            password: hashedPassword
        });

        // Pobranie danych nowo utworzonego użytkownika
        const user = await request.server.db('users')
            .select('id', 'username', 'email', 'role', 'created_at')
            .where({ id: userId })
            .first();

        // Tworzenie payloadu dla tokena JWT
        const payload = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            created_at: user.created_at
        };

        try {
            // Tworzenie tokena JWT i ustawianie go w odpowiedzi
            // Jeśli wystąpi błąd podczas tworzenia tokena, zwróć błąd 500 z odpowiednim komunikatem
            await request.server.setAuthCookie(reply, payload);
        } catch (error) {
            return reply.status(500).send({ success: false, message: 'Błąd podczas tworzenia tokena JWT', data: null });
        }
        // Zwrócenie odpowiedzi z sukcesem
        return reply.status(201).send({ success: true, message: 'Użytkownik zarejestrowany pomyślnie', data: payload });

    } catch (error) {
        // Jeśli wystąpi błąd podczas rejestracji użytkownika, zwróć błąd 500 z odpowiednim komunikatem
        return reply.status(500).send({ success: false, message: 'Błąd serwera podczas rejestracji użytkownika', data: null });
    }
  }

  static async login(request, reply) {
    // Sprawdzenie, czy treść żądania nie jest pusta
    if (!request.body) {
      return reply.status(400).send({ success: false, message: 'Treść żądania nie może być pusta', data: null });
    }

    const { login, password } = request.body;

    // Sprawdzenie, czy wszystkie wymagane pola są obecne
    // Jeśli nie, zwróć błąd 400 z odpowiednim komunikatem
    if (!login || !password) {
      return reply.status(400).send({ success: false, message: 'Wszystkie pola są wymagane', data: null });
    }

    try {
      // Pobranie użytkownika z bazy danych na podstawie nazwy użytkownika lub emaila
      const user = await request.server.db('users').where({ username: login }).orWhere({ email: login }).first();

      // Jeśli użytkownik nie istnieje, zwróć błąd 404 z odpowiednim komunikatem
      if (!user) {
        return reply.status(401).send({ success: false, message: 'Nieprawidłowy login lub hasło', data: null });
      }

      // Sprawdzenie hasła
      const isPasswordValid = await request.server.bcrypt.compare(password, user.password);

      // Jeśli hasło jest nieprawidłowe, zwróć błąd 401 z odpowiednim komunikatem
      if (!isPasswordValid) {
        return reply.status(401).send({ success: false, message: 'Nieprawidłowy login lub hasło', data: null });
      }

      // Tworzenie payloadu dla tokena JWT
      const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      };

      try {
        // Tworzenie tokena JWT i ustawianie go w odpowiedzi
        await request.server.setAuthCookie(reply, payload);
      } catch (error) {
        return reply.status(500).send({ success: false, message: 'Błąd podczas tworzenia tokena JWT', data: null });
      }

      // Zwrócenie odpowiedzi z sukcesem
      return reply.status(200).send({ success: true, message: 'Zalogowano pomyślnie', data: payload });

    } catch (error) {
      // Jeśli wystąpi błąd podczas logowania, zwróć błąd 500 z odpowiednim komunikatem
      return reply.status(500).send({ success: false, message: 'Błąd serwera podczas logowania', data: null });
    }
  }

  static async logout(request, reply) {
    try {
      // Usunięcie tokena JWT z odpowiedzi
      await request.server.clearAuthCookie(reply);
      
      // Zwrócenie odpowiedzi z sukcesem
      return reply.status(200).send({ success: true, message: 'Wylogowano pomyślnie', data: null });
    
    } catch (error) {
      // Jeśli wystąpi błąd podczas wylogowania, zwróć błąd 500 z odpowiednim komunikatem
      return reply.status(500).send({ success: false, message: 'Błąd serwera podczas wylogowania', data: null });
    }
  }

  static async getMe(request, reply) {
    // Weryfikacja tokena JWT z cookie
    const user = await request.verifyAuth();

    // Jeśli token jest nieprawidłowy lub wygasł, zwróć błąd 401
    if (!user) {
      return reply.status(401).send({ success: false, message: 'Nieautoryzowany', data: null });
    }

    // Zwrócenie danych użytkownika
    return reply.status(200).send({ success: true, message: 'Dane użytkownika', data: user });
  }
}