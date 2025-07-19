export default async (to) => {
  const token = localStorage.getItem("token");

  // Redireciona para o home se estiver logado e tentar acessar a página de login
  if (to.name === "login" && token) {
    return { name: "Dashboard" }; // Redireciona para a página de admin se já estiver logado
  }

  // Verifica se a rota exige autenticação
  if (to.meta.requiresAuth) {
    if (!token) {
      return { name: "login" }; // Redireciona para login se não estiver autenticado
    }
    
    return true;
  }

  return true; // Permite navegação para rotas que não exigem autenticação
};