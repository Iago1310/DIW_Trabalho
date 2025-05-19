let hoteis = [];

function cadastrarHotel() {
  const nome = document.getElementById('nomeHotel').value.trim();
  if (nome === "") return alert("Informe o nome do hotel.");

  hoteis.push(nome);
  atualizarSelectHotel();
  alert("Hotel cadastrado com sucesso!");
  document.getElementById('nomeHotel').value = '';
}

function atualizarSelectHotel() {
  const select = document.getElementById('hotelReferencia');
  select.innerHTML = '';
  hoteis.forEach(hotel => {
    const option = document.createElement('option');
    option.value = hotel;
    option.textContent = hotel;
    select.appendChild(option);
  });
}

function cadastrarRestaurante() {
  const nome = document.getElementById('nomeRestaurante').value;
  const endereco = document.getElementById('enderecoRestaurante').value;
  const distancia = document.getElementById('distanciaRestaurante').value;
  const valor = document.getElementById('valorRestaurante').value;
  const referencia = document.getElementById('hotelReferencia').value;

  if (!nome || !endereco || !distancia || !valor || !referencia) {
    return alert("Preencha todos os campos.");
  }

  const restaurante = {
    nome,
    endereco,
    distancia: Number(distancia),
    valor: Number(valor),
    referencia
  };

  fetch("http://localhost:3000/restaurantes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(restaurante)
  }).then(() => {
    alert("Restaurante cadastrado!");
    document.querySelectorAll('.form-container input').forEach(i => i.value = '');
  });
}

function buscarRestaurantes() {
  const nomeHotel = document.getElementById('buscaHotel').value.trim();
  if (!nomeHotel) return alert("Digite o nome do hotel.");

  fetch("http://localhost:3000/restaurantes")
    .then(resp => resp.json())
    .then(data => {
      const filtrados = data.filter(r => r.referencia.toLowerCase() === nomeHotel.toLowerCase());
      const container = document.getElementById('resultados');
      container.innerHTML = "<h2>Restaurantes Encontrados</h2>";

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
            Valor Médio: R$ ${r.valor}
          </div>
        `;
      });
    });
}

// Executa ao carregar a página
window.onload = () => {
  // Cadastra hoteis para teste
  hoteis = ['Ouro Minas', 'Mercure BH Lourdes', 'Hotel Fasano', 'Dayrell Hotel'];
  atualizarSelectHotel();

  // Cadastra restaurantes para teste
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
};
