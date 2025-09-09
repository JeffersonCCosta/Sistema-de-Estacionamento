const tabelaBody = document.querySelector('#tabela-veiculos tbody');
const API_URL = 'http://localhost:8080/veiculos';
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

// Carrega veículos sem entrada
async function carregarVeiculosSemEntrada() {
  try {
    const response = await fetch(`${API_URL}/sem-entrada`);
    if (!response.ok) throw new Error("Erro ao buscar veículos");

    const veiculos = await response.json();
    tabelaBody.innerHTML = "";

    veiculos.forEach(veiculo => {
      const linha = document.createElement("tr");

      linha.innerHTML = `
        <td>${veiculo.placa}</td>
        <td>${veiculo.modelo}</td>
        <td>${veiculo.cor}</td>
        <td>
          ${veiculo.entrada ? new Date(veiculo.entrada).toLocaleString("pt-BR") : ""}
          <button class="btn-entrada">Registrar Entrada</button>
        </td>
      `;

      const botaoEntrada = linha.querySelector(".btn-entrada");

      botaoEntrada.addEventListener("click", () => {
        botaoEntrada.style.display = "none";

        // Cria input de data/hora
        const inputData = document.createElement("input");
        inputData.type = "datetime-local";
        inputData.className = "input-entrada";

        // Botão de confirmar
        const botaoConfirmar = document.createElement("button");
        botaoConfirmar.textContent = "Confirmar Entrada";
        botaoConfirmar.className = "btn-confirmar";

        linha.children[3].appendChild(inputData);
        linha.children[3].appendChild(botaoConfirmar);

        inputData.focus();

        // Confirmar entrada
        botaoConfirmar.addEventListener("click", () => {
          const dataEscolhida = inputData.value;
          if (!dataEscolhida) {
            mostrarMensagem("Escolha uma data e hora para registrar a entrada.", "erro");
            return;
          }
          registrarEntradaComData(veiculo.placa, dataEscolhida);
        });

        // Volta ao estado original se clicar fora
        function removerInput() {
          inputData.remove();
          botaoConfirmar.remove();
          botaoEntrada.style.display = "inline-block";
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
    mostrarMensagem("Erro ao carregar veículos.", "erro");
  }
}

// Registrar entrada com data
async function registrarEntradaComData(placa, dataEscolhida) {
  try {
    const entradaDTO = { placa, entrada: dataEscolhida };

    const response = await fetch(`${API_URL}/entrada`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entradaDTO)
    });

    if (response.ok) {
      mostrarMensagem(`Entrada registrada para o veículo ${placa}`);
      carregarVeiculosSemEntrada();
    } else {
      const erro = await response.text();
      mostrarMensagem(erro, "erro");
    }
  } catch (error) {
    console.error(error);
    mostrarMensagem("Erro ao registrar entrada.", "erro");
  }
}

// Executa ao carregar a página
document.addEventListener("DOMContentLoaded", carregarVeiculosSemEntrada);
