const tabelaBody = document.querySelector('#tabela-veiculos tbody');
const API_URL = 'http://localhost:8080/veiculos';
const usuario = JSON.parse(localStorage.getItem("usuario"));
const usuarioDiv = document.getElementById("usuario-logado");
const btnLogout = document.getElementById("btn-logout");

// Exibe o usuário logado
if (usuarioDiv) {
    usuarioDiv.innerHTML = usuario && usuario.nome ? 
        `Usuário: <strong>${usuario.nome}</strong>` :
        `Usuário: <strong>Visitante</strong>`;
}

// Logout
if (btnLogout) {
    btnLogout.addEventListener("click", () => {
        localStorage.removeItem("usuario");
        window.location.href = "../Login/HTML/login.html";
    });
}

// Função para mostrar mensagens
function mostrarMensagem(texto, tipo = "sucesso") {
  const msg = document.getElementById("mensagem");
  msg.textContent = texto;
  msg.className = "mensagem";
  if (tipo === "erro") msg.classList.add("erro");

  msg.style.display = "block";
  msg.style.opacity = "1";

  setTimeout(() => {
    msg.style.opacity = "0";
    setTimeout(() => {
      msg.style.display = "none";
    }, 500);
  }, 4000);
}

// Carrega veículos sem saída
async function carregarVeiculosSemSaida() {
  try {
    const response = await fetch(`${API_URL}/sem-saida`);
    if (!response.ok) throw new Error("Erro ao buscar veículos sem saída");

    const veiculos = await response.json();
    tabelaBody.innerHTML = "";

    veiculos.forEach(veiculo => {
      const linha = document.createElement("tr");

      linha.innerHTML = `
        <td>${veiculo.placa}</td>
        <td>${veiculo.modelo}</td>
        <td>${veiculo.cor}</td>
        <td>${veiculo.entrada ? new Date(veiculo.entrada).toLocaleString("pt-BR") : "Sem entrada"}</td>
        <td><button class="btn-saida">Registrar Saída</button></td>
      `;

      const botaoSaida = linha.querySelector(".btn-saida");

      botaoSaida.addEventListener("click", () => {
        if (!veiculo.entrada) {
          mostrarMensagem("Não é possível registrar saída sem entrada.", "erro");
          return;
        }

        botaoSaida.style.display = "none";

        // Cria input e botão de confirmar
        const inputData = document.createElement("input");
        inputData.type = "datetime-local";
        inputData.className = "input-saida";

        const botaoConfirmar = document.createElement("button");
        botaoConfirmar.textContent = "Confirmar Saída";
        botaoConfirmar.className = "btn-confirmar";

        linha.children[4].appendChild(inputData);
        linha.children[4].appendChild(botaoConfirmar);

        inputData.focus();

        // Confirmar saída
        botaoConfirmar.addEventListener("click", () => {
          const dataEscolhida = inputData.value;
          if (!dataEscolhida) {
            mostrarMensagem("Escolha uma data e hora para registrar a saída.", "erro");
            return;
          }
          registrarSaidaComData(veiculo.placa, dataEscolhida);
        });

        // Se clicar fora, volta ao estado original
        function removerInput() {
          inputData.remove();
          botaoConfirmar.remove();
          botaoSaida.style.display = "inline-block";
        }

        inputData.addEventListener("focusout", () => {
          setTimeout(() => {
            if (document.activeElement !== botaoConfirmar) {
              removerInput();
            }
          }, 100);
        });

        botaoConfirmar.addEventListener("focusout", () => {
          setTimeout(() => {
            if (document.activeElement !== inputData) {
              removerInput();
            }
          }, 100);
        });
      });

      tabelaBody.appendChild(linha);
    });
  } catch (error) {
    console.error(error);
    mostrarMensagem("Erro ao carregar veículos sem saída.", "erro");
  }
}

// Registrar saída com data
async function registrarSaidaComData(placa, dataEscolhida) {
  try {
    const saidaDTO = { placa, saida: dataEscolhida };

    const response = await fetch(`${API_URL}/saida/${placa}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(saidaDTO)
    });

    if (response.ok) {
      mostrarMensagem(`Saída registrada para o veículo ${placa}`);
      carregarVeiculosSemSaida();
    } else {
      const erro = await response.text();
      mostrarMensagem(erro, "erro");
    }
  } catch (error) {
    console.error(error);
    mostrarMensagem("Erro ao registrar saída.", "erro");
  }
}

// Executa ao carregar a página
document.addEventListener("DOMContentLoaded", carregarVeiculosSemSaida);
