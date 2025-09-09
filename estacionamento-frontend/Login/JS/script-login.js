// Captura o formulário
const form = document.querySelector("form");
const linkCadastro = document.getElementById("link-cadastro");
const msgCadastro = document.getElementById("msg-cadastro");

linkCadastro.addEventListener("click", (e) => {
    e.preventDefault(); // evita navegação

    msgCadastro.textContent = "Para criar uma conta, entre em contato com o administrador.";
    msgCadastro.style.display = "block";
    msgCadastro.style.opacity = "1";

    // Fade out automático após 4 segundos
    setTimeout(() => {
        msgCadastro.style.opacity = "0";
        setTimeout(() => {
            msgCadastro.style.display = "none";
        }, 500); // duração do fade
    }, 3000);
});


form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    if (response.ok) {
      const data = await response.json(); // <-- lê o JSON retornado pelo backend

      // Salva no localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "usuario",
        JSON.stringify({
          nome: data.nome,
          email: data.email
        })
      );

      // Redireciona para a página principal
      window.location.href = "../../HTML/index.html";
    } else {
      const erro = await response.text();
      alert(erro);
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao conectar com o backend");
  }
});