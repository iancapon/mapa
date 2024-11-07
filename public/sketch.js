let caba
let comuna_2
let comuna_14
let calles
let avenidas
let escala
let otherFeatures

let lineas_caba
let lineas_de_bondi

function preload() {
    caba = loadJSON("./map_assets/callejero.JSON")
    comuna_2 = loadJSON("./map_assets/comuna2.JSON")
    comuna_14 = loadJSON("./map_assets/comuna14.JSON")
    lineas_caba = loadJSON("./map_assets/lineas.JSON")
}

function setup() {
    const MAPA = caba
    const LINEAS = lineas_caba

    calles = Calles(MAPA)
    avenidas = Avenidas(MAPA)

    lineas_de_bondi = buscar_lineas(LINEAS,["111","152","29","61","62"])
    //lineas_de_bondi = todas_las_lineas(LINEAS)

    escala = factorDeEscala(calles, avenidas, 800*4)

    const tipos = buscar_tipos_calles(MAPA.features).filter((tipo) => !["AVENIDA", "CALLE"].includes(tipo))
    otherFeatures = tipos.map(tipo => CrearListaDeFeatures(MAPA, tipo))

    createCanvas(1920*3, 1080*3)
    noLoop()
}


function draw() {
    translate(1500, 50)
    background(0)

    stroke(255,255)
    strokeWeight(4)
    renderizar(avenidas)

    strokeWeight(2)
    renderizar(calles)

    otherFeatures.forEach(feature => renderizar(feature))

    colorMode(HSB,100)
    strokeWeight(8)
    renderizarLineas(lineas_de_bondi)
}

function renderizarLineas(datos) {
    console.log(datos)
    datos.forEach((feature, a_index) => {
        stroke(random(0,100),80,100,80)
        let recorrido = feature.geometry.coordinates[0]
        let prev_point
        recorrido.forEach((point, p_index) => {
            if (p_index > 0) {
                let ax = (prev_point[0] + escala.desvioX) * escala.escala
                let ay = (escala.factor / escala.escala - (prev_point[1] + escala.desvioY)) * escala.escala
                let bx = (point[0] + escala.desvioX) * escala.escala
                let by = (escala.factor / escala.escala - (point[1] + escala.desvioY)) * escala.escala

                /*console.log({
                    ax: ax,
                    ay: ay,
                    bx: bx,
                    by: by
                })*/

                line(ax, ay, bx, by)
            }
            prev_point = point
        })
    })
}

function renderizar(datos) {
    datos.forEach((av, a_index) => {
        av.secciones.forEach((feature, f_index) => {
            let prev_point
            feature.geometry.coordinates.forEach((point, p_index) => {
                if (p_index > 0) {
                    let ax = (prev_point[0] + escala.desvioX) * escala.escala
                    let ay = (escala.factor / escala.escala - (prev_point[1] + escala.desvioY)) * escala.escala
                    let bx = (point[0] + escala.desvioX) * escala.escala
                    let by = (escala.factor / escala.escala - (point[1] + escala.desvioY)) * escala.escala

                    /*console.log({
                        ax: ax,
                        ay: ay,
                        bx: bx,
                        by: by
                    })*/

                    line(ax, ay, bx, by)
                }
                prev_point = point
            })
        })
    })
}