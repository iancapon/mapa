const fs = require("fs")
const CIUDAD_CABA = JSON.parse(fs.readFileSync("./map_assets/callejero.JSON"))


function filtrarCallesPorComuna(comuna) {
    return { features: CIUDAD_CABA.features.filter(feature => feature.properties.comuna == comuna) }

}

function guardarComunaEnArchivo(comuna) {
    fs.writeFileSync("./map_assets/comuna" + String(comuna) + ".JSON", JSON.stringify(filtrarCallesPorComuna(comuna)), (err) => {
        if (err) {
            console.log("ERROR: " + err)
        } else {
            console.log("SUCCESS")
        }
    })
}

//guardarComunaEnArchivo(2)
//guardarComunaEnArchivo(14)

