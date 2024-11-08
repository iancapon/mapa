
const Mapa = function (assets, ALTO) {
    this.buscar_tipos_calles = function (lista_features) {
        let tipos = []
        lista_features.forEach(feature => {
            const index = tipos.findIndex(tipo => tipo == feature.properties.tipo_c)
            if (index == -1) {
                tipos.push(feature.properties.tipo_c)
            }
        })
        return tipos
    }

    this.separar_por_nom_map = function (lista) {
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

    this.CrearListaDeFeatures = function (comuna, tipo) {
        const desorganizado = buscar_instancias_de_tipo_calle(comuna.features, tipo)
        return separar_por_nom_map(desorganizado)
    }

    this.factorDeEscala = function (calles, avenidas, escalaDeseada) {
        let maxminAvenidas = this.calcularMaxminXY(avenidas)

        let maxX = maxminAvenidas[0]
        let maxY = maxminAvenidas[1]
        let minX = maxminAvenidas[2]
        let minY = maxminAvenidas[3]

        let maxminCalles = this.calcularMaxminXY(calles)

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


    this.calcularMaxminXY = function (datos) {
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

    this.renderizar = function (datos) {
        datos.forEach((av, a_index) => {
            av.secciones.forEach((feature, f_index) => {
                let prev_point
                feature.geometry.coordinates.forEach((point, p_index) => {
                    if (p_index > 0) {
                        let ax = (prev_point[0] + escala.desvioX) * escala.escala
                        let ay = (escala.factor / escala.escala - (prev_point[1] + escala.desvioY)) * escala.escala
                        let bx = (point[0] + escala.desvioX) * escala.escala
                        let by = (escala.factor / escala.escala - (point[1] + escala.desvioY)) * escala.escala
                        /*
                        console.log({
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

    this.dibujar_mapa = function (shade) {
        stroke(shade)
        strokeWeight(4)
        this.renderizar(avenidas)

        strokeWeight(2)
        this.renderizar(calles)

        otherFeatures.forEach(feature => this.renderizar(feature))
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

    const tipos = this.buscar_tipos_calles(assets.caba.features).filter((tipo) => !["AVENIDA", "CALLE"].includes(tipo))
    const avenidas = this.CrearListaDeFeatures(assets.caba, "AVENIDA")
    const calles = this.CrearListaDeFeatures(assets.caba, "CALLE")
    const otherFeatures = tipos.map(tipo => this.CrearListaDeFeatures(assets.caba, tipo))
    const escala = this.factorDeEscala(calles, avenidas, ALTO)
    
    this.getEscala = function(){
        return escala
    }
}