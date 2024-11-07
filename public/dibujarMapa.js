//const fs = require("fs")
//COMUNA_2 = JSON.parse(fs.readFileSync("./map_assets/comuna2.JSON"))

function buscar_instancias_de_nom_mapa(arreglo, nom_mapa) {
    return arreglo.filter(feature => feature.properties.nom_mapa == nom_mapa)
}

function buscar_instancias_de_tipo_calle(arreglo, tipo) {
    return arreglo.filter(feature => feature.properties.tipo_c == tipo)
}

function separar_por_nom_map(lista) {
    let caminos = []
    lista.forEach(feature => {
        const index = caminos.findIndex(camino => camino.nombre == feature.properties.nom_mapa)
        if (index >= 0) {
            caminos[index].secciones.push(feature)
        } else {
            caminos.push({
                nombre: feature.properties.nom_mapa,
                secciones: [feature]
            })
        }
    })
    return caminos
}

//const avenidas_desorganizadas = buscar_instancias_de_tipo_calle(COMUNA_2.features, "AVENIDA")
//const calles_desorganizadas = buscar_instancias_de_tipo_calle(COMUNA_2.features, "CALLE")

//const avenidas = separar_por_nom_map(avenidas_desorganizadas)
//const calles = separar_por_nom_map(calles_desorganizadas)

function Avenidas(comuna){
    const avenidas_desorganizadas = buscar_instancias_de_tipo_calle(comuna.features, "AVENIDA")
    const avenidas = separar_por_nom_map(avenidas_desorganizadas)
    return avenidas
} 

function Calles(comuna){
    const calles_desorganizadas = buscar_instancias_de_tipo_calle(comuna.features, "CALLE")
    const calles = separar_por_nom_map(calles_desorganizadas)
    return calles
}   

function CrearListaDeFeatures(comuna,tipo){
    const desorganizado = buscar_instancias_de_tipo_calle(comuna.features, tipo)
    return separar_por_nom_map(desorganizado)
}

function imprimirCALLESyAVENIDAS(calles, avenidas) {
    console.log("--- AVENIDAS ---")
    console.log(avenidas.forEach(av => console.log(av.nombre)))

    console.log("--- CALLES ---")
    console.log(calles.forEach(ca => console.log(ca.nombre)))
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

//console.log(imprimirCALLESyAVENIDAS(calles(COMUNA_2),avenidas(COMUNA_2)))

