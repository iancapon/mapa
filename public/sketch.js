let caba
let comuna_2
let comuna_14
let calles
let avenidas
let escala
let otherFeatures

function preload() {
    caba = loadJSON("./map_assets/callejero.JSON")
    comuna_2 = loadJSON("./map_assets/comuna2.JSON")
    comuna_14 = loadJSON("./map_assets/comuna14.JSON")
}

function setup() {
    const MAPA = caba
    calles = Calles(MAPA)
    avenidas = Avenidas(MAPA)
    escala = factorDeEscala(calles, avenidas, 2400)

    console.log(buscar_tipos_calles(MAPA.features))

    const tipos = buscar_tipos_calles(MAPA.features).filter((tipo) => !["AVENIDA","CALLE"].includes(tipo))
    otherFeatures = tipos.map(tipo => CrearListaDeFeatures(MAPA,tipo))
    createCanvas(2600, 2600)
    noLoop()
}


function draw() {
    translate(50, 50)
    background(200)
    
    stroke(255,0,0)
    strokeWeight(2)
    renderizar(avenidas)
    
    stroke(0,0,255)
    strokeWeight(1)
    renderizar(calles)

    stroke(0,255,0)
    otherFeatures.forEach(feature => renderizar(feature))
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


function buscar_tipos_calles(lista_features) {
    let tipos = []
    lista_features.forEach(feature => {
        const index = tipos.findIndex(tipo => tipo == feature.properties.tipo_c)
        if (index == -1) {
            tipos.push(feature.properties.tipo_c)
        }
    })
    return tipos
}

function factorDeEscala(calles, avenidas, escalaDeseada) {
    let maxminAvenidas = calcularMaxminXY(avenidas)

    let maxX = maxminAvenidas[0]
    let maxY = maxminAvenidas[1]
    let minX = maxminAvenidas[2]
    let minY = maxminAvenidas[3]

    let maxminCalles = calcularMaxminXY(calles)

    if (maxminCalles[0] > maxX) {
        maxX = maxminCalles[0]
    }
    if (maxminCalles[1] > maxY) {
        maxY = maxminCalles[1]
    }
    if (maxminCalles[2] < minX) {
        minX = maxminCalles[2]
    }
    if (maxminCalles[3] < minY) {
        minY = maxminCalles[3]
    }

    //console.log([maxX, maxY, minX, minY])

    let escalaX = Math.abs(maxX - minX)
    let escalaY = Math.abs(maxY - minY)

    //console.log("escala X: " + String(escalaX))
    //console.log("escala Y: " + String(escalaY))

    //console.log(escalaY*escalaDeseada)

    return {
        factor: escalaDeseada,
        escala: escalaDeseada / escalaY,
        desvioX: -minX,
        desvioY: -minY
    }
}

function calcularMaxminXY(datos) {
    let maxX = 0
    let minX = 0
    let maxY = 0
    let minY = 0

    datos.forEach((av, a_index) => {
        av.secciones.forEach((feature, f_index) => {
            feature.geometry.coordinates.forEach((point, p_index) => {
                if (a_index == 0 && f_index == 0 && p_index == 0) {
                    maxX = point[0]
                    maxY = point[1]
                    minX = point[0]
                    minY = point[1]
                }
                else {
                    if (point[0] > maxX) {
                        maxX = point[0]
                    }
                    if (point[1] > maxY) {
                        maxY = point[1]
                    }
                    if (point[0] < minX) {
                        minX = point[0]
                    }
                    if (point[1] < minY) {
                        minY = point[1]
                    }
                }
            })
        })
    })

    return [maxX, maxY, minX, minY]
}