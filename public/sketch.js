let assets = {
    caba: undefined,
    lineas: undefined
}
let mapa = undefined
let colectivos = undefined
let zoom = 1

function preload() {
    assets.caba = loadJSON("./map_assets/callejero.JSON")
    assets.lineas = loadJSON("./map_assets/lineas.JSON")
}

function setup() {
    mapa = new Mapa(assets, 800 * 4)
    colectivos = new Trayectos(assets, mapa.getEscala())

    colectivos.cargar_linea("111","A")
    colectivos.cargar_linea("152","A")
    colectivos.cargar_linea("29","A")
    colectivos.cargar_linea("61","A")
    colectivos.cargar_linea("62","A")

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
}
