let assets = {
    caba: undefined,
    lineas: undefined
}
let mapa = undefined
let colectivos = undefined
let zoom = 1

let p_x = -58.404665117856574; ////longitud
let p_y = -34.58673430613933;  /// latitud
let radio = 368; // Radio del círculo

function preload() {
    assets.caba = loadJSON("./map_assets/callejero.JSON")
    assets.lineas = loadJSON("./map_assets/lineas.JSON")
}

function setup() {
    mapa = new Mapa(assets, 800 * 4)
    colectivos = new Trayectos(assets, mapa.getEscala())

    //colectivos.cargar_lineas_cercanas([p_x,p_y],radio)
    colectivos.cargar_linea("111","A",20)
    colectivos.cargar_linea("152","A",73)
    colectivos.cargar_linea("062","A",39)
    colectivos.cargar_linea("039","A",8)
    colectivos.cargar_linea("029","A",16)
    colectivos.cargar_linea("092","A",48)

    createCanvas(1920 * 2, 1080 * 2)
    noLoop()
}

function draw() {
    scale(zoom)
    translate(50, 50)
    background(255)

    mapa.dibujar_mapa(0)

    colectivos.dibujar_mapa()

    textSize(60)
    stroke(0)
    strokeWeight(1)
    fill(0)
    text("RED DE TRANSPORTE", 1500 * 2, 200 * 2)

    //dibujarMarcador(p_x, p_y); 
}


function dibujarMarcador(longitud, latitud) {
    // Convierte las coordenadas del mapa a la escala actual
    const escala = mapa.getEscala();
    const x = (longitud + escala.desvioX) * escala.escala;
    const y = (escala.factor / escala.escala - (latitud + escala.desvioY)) * escala.escala;
    // Dibujar el círculo en el punto escalado
    fill(100,100,100);
    strokeWeight(2); // Grosor del borde
    ellipse(x, y, 40); // Dibuja el círculo
}