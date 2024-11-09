const Trayectos = function (assets, escala) {
    this.lineas_cubiertas = []
    this.colores = []
    this.dibujar_mapa = function () {
        this.renderizar(this.lineas_cubiertas)
    }

    this.cargar_linea = function (linea, recorrido, color) {
        if (color != undefined) {
            this.colores.push({ linea: linea, recorrido: recorrido, color: color })
        } else {
            this.colores.push({ linea: linea, recorrido: recorrido, color: random(0, 100) })
        }
        let linea_gral = this.buscar_lineas(assets.lineas, linea)
        if (recorrido == undefined) {
            linea_gral.forEach(line => this.lineas_cubiertas.push(line))
            return
        }
        linea_gral.forEach(line => {
            if (line.properties.recorrido == recorrido) {
                this.lineas_cubiertas.push(line)
            }
        })
    }

    this.renderizar = function (datos) {
        //console.log(datos)
        try {
            datos.forEach((feature, a_index) => {
                colorMode(HSB, 100)
                stroke(this.colores.find(col => col.linea === feature.properties.linea).color, 90, 90,70)
                strokeWeight(13)
                feature.geometry.coordinates.forEach(recorrido => {
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
            })
        } catch (error) {
            console.log(error)
        }
    }

    this.cargar_lineas_cercanas = function (coordinates, radio) {
        const lineasCercanas = [];
        assets.lineas.features.forEach(feature => {
            let isNear = false;
            // Iterar sobre cada recorrido de la línea
            feature.geometry.coordinates.forEach(lineSegment => {
                lineSegment.forEach(point => {
                    const distancia = calcularDistancia(coordinates, point);

                    if (distancia <= radio) {
                        isNear = true;
                    }
                });
            });
            if (isNear) {
                lineasCercanas.push(feature);
            }
        });
        this.lineas_cubiertas = lineasCercanas;
    }



    this.buscar_instancias_de_tipo_recorrido = function (arreglo, numero) {
        return arreglo.filter(feature => feature.properties.linea == numero)
    }

    this.buscar_lineas = function (comuna, lineas) {
        return comuna.features.filter(feature => lineas.includes(feature.properties.linea))
    }

    this.todas_las_lineas = function (comuna) {
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
}

function calcularDistancia(coord1, coord2) {
    const R = 6371000; // Radio de la Tierra en metros
    const lat1 = coord1[1] * (Math.PI / 180);
    const lon1 = coord1[0] * (Math.PI / 180);
    const lat2 = coord2[1] * (Math.PI / 180);
    const lon2 = coord2[0] * (Math.PI / 180);
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // distancia en metros
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
