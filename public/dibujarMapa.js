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

//console.log(imprimirCALLESyAVENIDAS(calles(COMUNA_2),avenidas(COMUNA_2)))

