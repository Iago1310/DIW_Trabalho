function gerarResultados() {
    const acomodacao = $('#acomodacao').val().trim();
    const distanciaMax = parseFloat($('#distancia').val());
    const valorMax = parseFloat($('#valor').val());
  
    $('#resultados').html('<h3>Restaurantes Encontrados</h3>');
  
    $.get('http://localhost:3000/restaurantes', (data) => {
      const filtrados = data.filter(r =>
        r.referencia.toLowerCase() === acomodacao.toLowerCase() &&
        r.distancia <= distanciaMax &&
        r.valor <= valorMax
      );
  
      if (filtrados.length === 0) {
        $('#resultados').append('<p>Nenhum restaurante encontrado com os filtros selecionados.</p>');
        return;
      }
  
      filtrados.forEach(r => {
        $('#resultados').append(`
          <div class="resultado-item">
            <strong>${r.nome}</strong><br>
            Endereço: ${r.endereco}<br>
            Distância: ${r.distancia} km<br>
            Valor Médio: R$ ${r.valor}
          </div>
        `);
      });
    });
  }
  