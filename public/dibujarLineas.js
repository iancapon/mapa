function buscar_instancias_de_tipo_recorrido(arreglo, numero) {
    return arreglo.filter(feature => feature.properties.linea == numero)
}



function buscar_lineas(comuna, lineas) {
    return comuna.features.filter(feature => lineas.includes(feature.properties.linea))
}

function todas_las_lineas(comuna) {//un solo recorrido por linea
    let linea = []
    return comuna.features.filter(feature => {
        if (linea.includes(feature.properties.linea)) {
            return false
        }
        else {
            linea.push(feature.properties.linea)
            return true
        }
    })
}