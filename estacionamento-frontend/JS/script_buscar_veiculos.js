/*
document.addEventListener("DOMContentLoaded", () => {
  const tabela = document.querySelector("#tabela-veiculos tbody");

  async function carregarVeiculos() {
    try {
      const response = await fetch("http://localhost:8080/veiculos");
      if (!response.ok) throw new Error("Erro ao buscar veículos");

      const veiculos = await response.json();

      veiculos.forEach(veiculo => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${veiculo.placa}</td>
          <td>${veiculo.modelo}</td>
          <td>${veiculo.cor}</td>
          <td>${veiculo.entrada ? new Date(veiculo.entrada).toLocaleString("pt-BR") : "Veículo sem Data de Entrada"}</td>
          <td>${veiculo.saida ? new Date(veiculo.saida).toLocaleString("pt-BR") : "Veículo sem Data de Saída"}</td>
        `;

        tabela.appendChild(row);
      });
    } catch (error) {
      console.error("Erro ao carregar veículos:", error);
      tabela.innerHTML = `<tr><td colspan="5">Erro ao carregar dados.</td></tr>
      <tr><td colspan="5">Verifique a conexão com o Back-End e/ou Banco de Dados.</td></tr>`;
    }
  }

  carregarVeiculos();
});

*/

document.addEventListener("DOMContentLoaded", () => {
  const tabela = document.querySelector("#tabela-veiculos tbody");
  const buscarInput = document.getElementById("buscarPlaca");
  const btnBuscar = document.getElementById("btnBuscar");
  const btnLimpar = document.getElementById("btnLimpar");

  let todosVeiculos = []; // Guardar todos os veículos carregados

  async function carregarVeiculos() {
    try {
      const response = await fetch("http://localhost:8080/veiculos");
      if (!response.ok) throw new Error("Erro ao buscar veículos");

      todosVeiculos = await response.json();
      preencherTabela(todosVeiculos);
    } catch (error) {
      console.error("Erro ao carregar veículos:", error);
      tabela.innerHTML = `
        <tr><td colspan="5">Erro ao carregar dados.</td></tr>
        <tr><td colspan="5">Verifique a conexão com o Back-End e/ou Banco de Dados.</td></tr>`;
    }
  }

  function preencherTabela(lista) {
    tabela.innerHTML = ""; // Limpa a tabela
    if (lista.length === 0) {
      tabela.innerHTML = `<tr><td colspan="5">Nenhum veículo encontrado.</td></tr>`;
      return;
    }

    lista.forEach(veiculo => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${veiculo.placa}</td>
        <td>${veiculo.modelo}</td>
        <td>${veiculo.cor}</td>
        <td>${veiculo.entrada ? new Date(veiculo.entrada).toLocaleString("pt-BR") : "Veículo sem Data de Entrada"}</td>
        <td>${veiculo.saida ? new Date(veiculo.saida).toLocaleString("pt-BR") : "Veículo sem Data de Saída"}</td>
      `;
      tabela.appendChild(row);
    });
  }

  // Filtrar veículos ao clicar no botão
  btnBuscar.addEventListener("click", () => {
    const placa = buscarInput.value.trim().toLowerCase();
    if (!placa) {
      preencherTabela(todosVeiculos);
      return;
    }

    const filtrados = todosVeiculos.filter(v =>
      v.placa.toLowerCase().includes(placa)
    );
    preencherTabela(filtrados);
  });

  // Limpar busca
  btnLimpar.addEventListener("click", () => {
    buscarInput.value = "";
    preencherTabela(todosVeiculos);
  });

  carregarVeiculos();
});
