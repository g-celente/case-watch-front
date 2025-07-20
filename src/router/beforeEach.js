export default async (to) => {
  const token = localStorage.getItem("token");

  // Redireciona para o home se estiver logado e tentar acessar a página de login
  if (to.name === "login" && token) {
    return { name: "dashboard" }; // Alterado para minúsculo
  }

  // Verifica se a rota exige autenticação
  if (to.meta.requiresAuth) {
    if (!token) {
      return { name: "login" };
    }
    
    return true;
  }

  return true;
};