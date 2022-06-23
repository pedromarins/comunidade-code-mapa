let listaDeMentorados = []

extractGSheet("https://docs.google.com/spreadsheets/d/e/2PACX-1vTGXwHr5zo0T1f_k35JnOPP_BG21v6GxBOgGPcAtSJJX7EKdJUzwHJFR0nacHQydSsXUrOFksN_uDLM/pubhtml?gid=0&single=true")
.then((res) => {
    const lista = res.tables[0].data;
    criarCamadas(lista)
    listaDeMentorados = lista
    gerarListaTimes(lista[lista.length - 1].time)
})
.catch((err) => {
    console.error(err);
});



var map = L.map('map', {
    center: [-13.518, -51.372],
    zoom: 3,
    zoomControl: true
})


var tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
}).addTo(map);

var markers = L.markerClusterGroup();

const inputBusca = document.querySelector("[name='busca-texto']")

inputBusca.addEventListener("input", (event) => {   
    // tratar o valor digitado removendo acentos
    const valorDigitado = event.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

    limparMapa()

    // percorrer a listaDeMentorados, filtrar os nomes
    let encontrados = []
    listaDeMentorados.forEach( (elemento) => {
        const nomeTratado = elemento.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        if(nomeTratado.includes(valorDigitado)) {
            encontrados.push(elemento)
        }
    })
    criarCamadas(encontrados)
})

const selectTime = document.querySelector("[name='busca-time']")
selectTime.addEventListener("input", (evento) => {
    limparMapa()

    // percorrer a listaDeMentorados, filtrando pelo time
    let encontrados = []
    if(evento.target.value != "todos") {
        listaDeMentorados.forEach( (elemento) => {
            if(elemento.time ==  evento.target.value) {
                encontrados.push(elemento)
            }
        })
    } else {
        encontrados = listaDeMentorados
    }
    criarCamadas(encontrados)
})

function criarCamadas(mentorados) {
    markers = L.markerClusterGroup();
    mentorados.forEach(element => {
        let coord = element.coord.split(",")
        markers.addLayer(
            L.marker([coord[0], coord[1]]).bindPopup(
                `Nome: ${element.nome} <br>
                Turma: ${element.time}`
            )
        )
    });
    map.addLayer(markers);
}

function limparMapa() {
    // remove todos os layers desenhados no mapa, exceto o próprio mapa
    map.eachLayer(function(layer){
        if(layer._leaflet_id!=26) {
            map.removeLayer(layer)
        }
    });
}

function gerarListaTimes (ultimo) {
    var select = document.querySelector('#busca-time')

    for(i=0; i<=ultimo; i++){
        var option = document.createElement('option');
        option.value = i
        option.textContent = "Time " + i
        select.appendChild(option)
    }
}


