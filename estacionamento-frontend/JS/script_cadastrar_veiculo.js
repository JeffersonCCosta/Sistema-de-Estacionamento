const form = document.getElementById('form-veiculo');
const tabelaBody = document.querySelector('#tabela-veiculos tbody');
const botaoEntrada = document.getElementById('botao_entrada');
const entradaContainer = document.getElementById('entrada-container');
const tabelaEntradas = document.querySelector('#tabela-entradas tbody');



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


//Função para mostrar mensagem na tela (Adicionado ou erro)
function mostrarMensagem(texto, tipo = "sucesso") {
  const msg = document.getElementById("mensagem");
  msg.textContent = texto;
  msg.className = "mensagem"; // Reseta as classes
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

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const placa = document.getElementById('placa').value;
  const modelo = document.getElementById('modelo').value;
  const cor = document.getElementById('cor').value;

  const veiculo = { placa, modelo, cor };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(veiculo),
    });

    if (response.ok) {
      mostrarMensagem('Veículo cadastrado com sucesso!');
      form.reset();
      tabelaBody.innerHTML = '';
      const linha = `
        <tr>
          <td>${veiculo.placa}</td>
          <td>${veiculo.modelo}</td>
          <td>${veiculo.cor}</td>
        </tr>`;
      tabelaBody.innerHTML = linha;

    } else if (response.status === 500) {
      mostrarMensagem('Erro: já existe um veículo com essa placa no sistema.', 'erro');
    } else {
      mostrarMensagem('Erro ao cadastrar veículo.', 'erro');
    }
  } catch (err) {
    mostrarMensagem('Erro ao conectar com o backend.', 'erro');
    console.error(err);
  }
});

botaoEntrada.addEventListener('click', async (e) => {
  e.preventDefault();

  // Pegando os dados do carro cadastrado
  const linhaTabela = tabelaBody.querySelector('tr');
  if (!linhaTabela) {
    mostrarMensagem('Nenhum veículo cadastrado para dar entrada.', 'erro');
    return;
  }

  const placa = linhaTabela.children[0].textContent;
  const modelo = linhaTabela.children[1].textContent;
  const cor = linhaTabela.children[2].textContent;

  const veiculoEntrada = {
    placa,
    entrada: new Date().toISOString() // horário atual no formato ISO
  };

  try {
    // Envia para o backend
    const response = await fetch(`${API_URL}/entrada`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(veiculoEntrada)
    });

    if (response.ok) {
      mostrarMensagem('Entrada registrada com sucesso!');

      // Mostra a tabela se estiver escondida
      entradaContainer.style.display = 'block';

      // Formata horário para exibição
      const horarioFormatado = new Date().toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short'
      });

      // Adiciona a linha na tabela
      const carroInfo = `Carro: ${modelo} ${cor} <br>Placa: ${placa}`;
      tabelaEntradas.innerHTML += `
        <tr>
          <td>${carroInfo}</td>
          <td>${horarioFormatado}</td>
        </tr>
      `;
    } else {
      mostrarMensagem('Erro ao registrar entrada. Placa já cadastrada.', 'erro');
    }
  } catch (error) {
    console.error(error);
    mostrarMensagem('Erro ao conectar com o backend.', 'erro');
  }
});

carregarVeiculos();