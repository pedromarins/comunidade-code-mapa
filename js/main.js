let listaDeMentorados = []
fetch("./js/mentorados.json")
.then(response => {
    return response.json();
})
.then(arquivoDeMentorados => {
    criarCamadas(arquivoDeMentorados)
    listaDeMentorados = arquivoDeMentorados
});

var map = L.map('map').setView([-13.518, -51.372], 3);


var tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

var markers = L.markerClusterGroup();


// Disparado na hora da busca
const form = document.querySelector("#busca")

form.addEventListener("submit", (event) => {
    event.preventDefault()
    
    // remover todos os layers desenhados no mapa, exceto o próprio mapa
    map.eachLayer(function(layer){
        if(layer._leaflet_id!=26) {
            map.removeLayer(layer)
        }
    });

    // capturar o texto inserido no campo de busca
    const inputBusca = form.querySelector("[name='busca-texto']")
    const valorBuscado = inputBusca.value
    inputBusca.value = ""

    // filtrar os mentorados
    // percorrer a listaDeMentorados, filtrar os dados e rodar a função criarCamadas
    listaDeMentorados.forEach( (elemento) => {
        if(elemento.nome == valorBuscado) {
            criarCamadas([elemento])
        }
    })
})

function criarCamadas(mentorados) {
    markers = L.markerClusterGroup();
    mentorados.forEach(element => {
        let coord = element.coord.split(",")
        markers.addLayer(
            L.marker([coord[0], coord[1]]).bindPopup(
                `Nome: ${element.nome} <br>
                Turma: ${element.turma}`
            )
        )
    });
    map.addLayer(markers);
}