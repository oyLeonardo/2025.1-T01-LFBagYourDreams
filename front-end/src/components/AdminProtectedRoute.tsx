import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 


interface DecodedToken {
  is_staff: boolean;
  exp: number; // 'exp' é o timestamp de expiração padrão do JWT
}

const AdminProtectedRoute: React.FC = () => {
  // 1. Pega o token do localStorage
  const token = localStorage.getItem('accessToken');

  // 2. Se não houver token, redireciona para a página de entrada
  if (!token) {
    return <Navigate to="/inserir-token" replace />;
  }

  try {
    // 3. Tenta decodificar o token. Se não for um JWT válido, vai dar erro e cair no 'catch'
    const decodedToken = jwtDecode<DecodedToken>(token);

    // 4. Verifica se o usuário é um admin (is_staff)
    const isAdmin = decodedToken.is_staff;

    // 5. Verifica se o token expirou
    const isTokenExpired = decodedToken.exp * 1000 < Date.now();

    if (isTokenExpired) {
      console.log("Token expirado.");
      localStorage.clear(); // Limpa o localStorage se o token estiver expirado
      return <Navigate to="/inserir-token" replace />;
    }

    // 6. Se não for admin, redireciona para a página inicial
    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }

    // 7. Se passou por todas as verificações, permite o acesso
    return <Outlet />;

  } catch (error) {
    // Se o 'token' for um texto qualquer (ex: "qualquercoisa"), jwtDecode vai falhar.
    // Isso nos protege de tokens inválidos.
    console.error("Token inválido ou malformado:", error);
    localStorage.clear(); // Limpa o lixo do localStorage
    return <Navigate to="/inserir-token" replace />;
  }
};

export default AdminProtectedRoute;