let hoteis = [];

function cadastrarHotel() {
  const nome = document.getElementById('nomeHotel').value.trim();
  if (nome === "") return alert("Informe o nome do hotel.");

  if (!hoteis.includes(nome)) {
    hoteis.push(nome);
    atualizarSelectHotel();
    alert("Hotel cadastrado com sucesso!");
  } else {
    alert("Este hotel já está cadastrado.");
  }

  document.getElementById('nomeHotel').value = '';
}

function atualizarSelectHotel() {
  const select = document.getElementById('hotelReferencia');
  if (!select) return;

  select.innerHTML = '';
  hoteis.forEach(hotel => {
    const option = document.createElement('option');
    option.value = hotel;
    option.textContent = hotel;
    select.appendChild(option);
  });
}

function cadastrarRestaurante() {
  const nome = document.getElementById('nomeRestaurante').value.trim();
  const endereco = document.getElementById('enderecoRestaurante').value.trim();
  const distancia = parseFloat(document.getElementById('distanciaRestaurante').value);
  const valor = parseFloat(document.getElementById('valorRestaurante').value);
  const referencia = document.getElementById('hotelReferencia').value;

  if (!nome || !endereco || isNaN(distancia) || isNaN(valor) || !referencia) {
    return alert("Preencha todos os campos corretamente.");
  }

  const restaurante = { nome, endereco, distancia, valor, referencia };

  fetch("http://localhost:3000/restaurantes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(restaurante)
  })
  .then(response => {
    if (!response.ok) throw new Error("Erro ao cadastrar restaurante");
    return response.json();
  })
  .then(() => {
    alert("Restaurante cadastrado com sucesso!");
    // Limpa somente os inputs da seção restaurante
    document.getElementById('nomeRestaurante').value = '';
    document.getElementById('enderecoRestaurante').value = '';
    document.getElementById('distanciaRestaurante').value = '';
    document.getElementById('valorRestaurante').value = '';
  })
  .catch(err => alert(err.message));
}

function buscarRestaurantes() {
  const nomeHotel = document.getElementById('buscaHotel').value.trim().toLowerCase();
  if (!nomeHotel) return alert("Digite o nome do hotel.");

  fetch("http://localhost:3000/restaurantes")
    .then(resp => resp.json())
    .then(data => {
      const container = document.getElementById('resultados');
      container.innerHTML = "<h2>Restaurantes Encontrados</h2>";

      // Ajuste: busca por substring para permitir busca parcial
      const filtrados = data.filter(r => r.referencia.toLowerCase().includes(nomeHotel));

      if (filtrados.length === 0) {
        container.innerHTML += "<p>Nenhum restaurante encontrado.</p>";
        return;
      }

      filtrados.forEach(r => {
        container.innerHTML += `
          <div class="resultado-item">
            <strong>${r.nome}</strong><br>
            Endereço: ${r.endereco}<br>
            Distância: ${r.distancia} km<br>
            Valor Médio: R$ ${r.valor.toFixed(2)}
          </div>
        `;
      });
    })
    .catch(() => {
      alert("Erro ao buscar restaurantes");
    });
}

// Executa ao carregar a página
window.onload = () => {
  // Hotéis iniciais
  hoteis = ['Ouro Minas', 'Mercure BH Lourdes', 'Hotel Fasano', 'Dayrell Hotel'];
  atualizarSelectHotel();

  // Inicializa restaurantes só se a API estiver vazia (você pode ajustar esse trecho conforme a sua API)
  fetch("http://localhost:3000/restaurantes")
    .then(resp => resp.json())
    .then(data => {
      if (data.length === 0) {
        const restaurantesTeste = [
          { nome: 'Pizzaria Napoli', endereco: 'Rua Itália, 45', distancia: 2, valor: 45, referencia: 'Ouro Minas' },
          { nome: 'Bistrô Lourdes', endereco: 'Av. Álvares Cabral, 200', distancia: 1.5, valor: 90, referencia: 'Mercure BH Lourdes' },
          { nome: 'Espetinho Grill', endereco: 'Rua Goiás, 99', distancia: 3, valor: 25, referencia: 'Dayrell Hotel' },
          { nome: 'Sushi House', endereco: 'Av. Contorno, 1234', distancia: 4, valor: 80, referencia: 'Hotel Fasano' }
        ];

        restaurantesTeste.forEach(r => {
          fetch("http://localhost:3000/restaurantes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(r)
          });
        });
      }
    });
};
