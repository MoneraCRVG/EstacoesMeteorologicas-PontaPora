var map;
function gerarMapa(){
    map = L.map('map').setView([-22.526, -55.7227], 13); // setView([latitude, longitude], zoom)

        // Add a tile layer (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

    fetch('estacoes.json')
            .then(response => response.json())
            .then(data => {
                // Iterate through each object in the JSON array
                data.forEach(item => {
                    // Extract data
                    var usuario = item.usuario;
                    var posicao = item.posicao.split(',').map(Number); // Split and convert to numbers
                    var elevacao = item.elevacao;

                    // Create marker
                    var marker = L.marker(posicao).addTo(map)
                        .bindPopup(`<div id="estacao-${usuario}"><br>Elevação: ${elevacao} m</br></div>`)
                        .on('popupopen', function() {
                             carregarEstacoes(usuario);
                            })
                });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
}
function carregarEstacoes(usuario) {
    var estacao = document.getElementById(`estacao-${usuario}`);
    const feeds = {
        'temperatura': 'Temperatura',
        'umidade': 'Umidade',
        'uv': 'UV',
        'pressao': 'Pressão'
    }
    Object.entries(feeds).forEach(([feed, alias]) => {
        fetch(`https://io.adafruit.com/api/v2/${usuario}/feeds/${feed}`)
            .then(response => response.json())
            .then(data => {
                var newElement = document.createElement('span');
                newElement.className = feed; // Use `feed` as class name
                newElement.innerHTML = `${alias}: ${data.last_value}<br>`; // Use `alias` for display name
                estacao.appendChild(newElement);
            })
            .catch(error => console.error('Error fetching data:', error));
    });

}