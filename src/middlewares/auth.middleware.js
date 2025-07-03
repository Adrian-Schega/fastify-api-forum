export const authMiddleware = async (request, reply) => {
  try {
    // Sprawdzenie czy token istnieje w ciasteczku
    const token = request.cookies.auth_token;
    
    if (!token) {
      return reply.status(401).send({ success: false, message: 'Brak tokena autoryzacji', data: null });
    }

    // Weryfikacja tokena
    const decoded = await request.server.jwt.verify(token);
    
    // Dodanie informacji o użytkowniku do request
    request.user = decoded;
    
    return;
  } catch (error) {
    // Token jest nieprawidłowy lub wygasł
    return reply.status(401).send({success: false, message: 'Token nieprawidłowy lub wygasł', data: null});
  }
}