// Recupera token salvo no login
const token = localStorage.getItem("token");

// Se não tiver token → manda pro login
if (!token) {
    alert("Sem Token! Faça login novamente.");
    window.location.href = "../Login/HTML/login.html";
} else {
  // Faz chamada ao backend com token
  fetch("http://localhost:8080/api/protegido", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => {
      if (res.status === 401) {
        alert("Sessão expirada! Faça login novamente.");
        localStorage.removeItem("token");
        window.location.href = "../Login/HTML/login.html";
      }
      return res.text(); // ou .json() se backend devolver JSON
    })
    .then((data) => {
      // Exibe mensagem de boas-vindas na tela
      document.getElementById("msg").innerText = data;
    })
    .catch((err) => {
      console.error("Erro:", err);
    });
}

const usuario = JSON.parse(localStorage.getItem("usuario"));
const usuarioDiv = document.getElementById("usuario-logado");
const btnLogout = document.getElementById("btn-logout");

if (usuarioDiv) {
    usuarioDiv.innerHTML = usuario && usuario.nome ? 
        `Usuário: <strong>${usuario.nome}</strong>` :
        `Usuário: <strong>Visitante</strong>`;
}

if (btnLogout) {
    btnLogout.addEventListener("click", () => {
        localStorage.removeItem("usuario");
        window.location.href = "../Login/HTML/login.html";
    });
}
