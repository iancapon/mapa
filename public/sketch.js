let assets = {
    caba: undefined,
    lineas: undefined
}
let mapa = undefined
let colectivos = undefined
let zoom = 0.5
// Variables x e y para las coordenadas y el radio
let p_x = -58.463843; // Longitud o posición X
let p_y = -34.635661; // Latitud o posición Y
let radio = 200; // Radio del círculo

function preload() {
    assets.caba = loadJSON("./map_assets/callejero.JSON")
    assets.lineas = loadJSON("./map_assets/lineas.JSON")
}

function setup() {
    mapa = new Mapa(assets, 800 * 4)
    colectivos = new Trayectos(assets, mapa.getEscala())

    colectivos.cargar_lineas_cercanas([p_x, p_y], radio)

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
    text("RED DE COLECTIVO", 1500 * 2, 200 * 2)

    // Dibujar un círculo en coordenadas específicas
    dibujarCirculo(p_x, p_y, radio); // Ejemplo de coordenadas y radio
}

function dibujarCirculo(longitud, latitud, radio) {
    // Convierte las coordenadas del mapa a la escala actual
    const escala = mapa.getEscala();
    const x = (longitud + escala.desvioX) * escala.escala;
    const y = (escala.factor / escala.escala - (latitud + escala.desvioY)) * escala.escala;

    // Dibujar el círculo en el punto escalado
    noFill();
    stroke(255, 0, 0); // Color del borde
    strokeWeight(2); // Grosor del borde
    ellipse(x, y, radio * 2); // Dibuja el círculo
}