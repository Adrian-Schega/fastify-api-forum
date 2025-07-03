// Middleware do sprawdzenia konkretnej roli użytkownika
export const requireRole = (requiredRole) => {
  return async (request, reply) => {
    // Sprawdzenie czy użytkownik jest uwierzytelniony
    if (!request.user) {
      return reply.status(401).send({success: false, message: 'Brak autoryzacji', data: null});
    }

    // Sprawdzenie czy użytkownik ma wymaganą rolę
    if (request.user.role !== requiredRole) {
      return reply.status(403).send({success: false, message: 'Brak uprawnień do wykonania tej operacji', data: null});
    }

    // Jeśli wszystko ok, przechodzimy dalej
    return;
  };
};