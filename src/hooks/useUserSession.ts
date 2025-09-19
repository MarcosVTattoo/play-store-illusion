import { useState, useEffect } from 'react';

// Hook para gerenciar a sessão do usuário baseada no dispositivo
export const useUserSession = () => {
  const [userSessionId, setUserSessionId] = useState<string>('');

  useEffect(() => {
    // Gerar ou recuperar ID de sessão único por dispositivo
    let sessionId = localStorage.getItem('user_session_id');
    
    if (!sessionId) {
      // Gerar um ID único baseado em timestamp e random
      sessionId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('user_session_id', sessionId);
    }
    
    setUserSessionId(sessionId);
  }, []);

  return userSessionId;
};