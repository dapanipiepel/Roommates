const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

//GET gasto
const getGastos = () => {
    const gastosJson = fs.readFileSync('./assets/json/gastos.json', 'utf8');
    //console.log(gastosJson);
    const gastosParseados = JSON.parse(gastosJson);
    //console.log('gastosPArseados',gastosParseados);
    return gastosParseados.gastos;

};

//POST gasto

const addGasto = (gasto) => {
    const gastos = getGastos();
    gastos.push(gasto);
    fs.writeFileSync('./assets/json/gastos.json', JSON.stringify({gastos: gastos}), 'utf8');

};

//PUT gasto

const editGasto = (id, gasto) => {
    const gastosJson = fs.readFileSync('./assets/json/gastos.json', 'utf8');
    //console.log(gastosJson);
    const {gastos: gastos} = JSON.parse(gastosJson);
    const index = gastos.findIndex((gasto) => gasto.id == id);
    gasto.id = id;
    gastos[index] = gasto;
    //console.log(gasto);
    fs.writeFileSync('./assets/json/gastos.json', JSON.stringify({gastos: gastos}), 'utf8');
};

//DELETE gasto

const deleteGasto = (id) => {
    const gastosJson = fs.readFileSync('./assets/json/gastos.json', 'utf8');
    //console.log(gastosJson)
    const {gastos} = JSON.parse(gastosJson);
    const index = gastos.findIndex((gasto) => gasto.id == id);
    const deletedGasto = gastos.splice(index, 1);
    fs.writeFileSync('./assets/json/gastos.json', JSON.stringify({gastos: gastos}), 'utf8');

};

const updateGastos = (gasto, id) => {
    const {gastos: gastosJSON} = JSON.parse(fs.readFileSync('assets/json/gastos.json', 'utf8'));
    // console.log(gastosJSON);
    const datosParaActualizar = gastosJSON.map((g) => {
        if (g.id == id){
            g.roommate = gasto.roommate;
            g.descripcion = gasto.descripcion;
            g.monto = gasto.monto;
            return g;
        } else {
            return g;
        }
    });
    fs.writeFileSync('./assets/json/gastos.json', JSON.stringify({gastos: gastosJSON}), 'utf8')
};


//debe y recibe

const debe = (roommate, gasto, cantidadRoommates) => {
    const sumaDeuda = gasto.reduce((acumulador, gastoActual) => {
        if (gastoActual.roommate != roommate){
            const resultado = acumulador + gastoActual.monto;
            return resultado;
        } else {
            const resultado = acumulador + 0;
            return resultado;
        }
    }, 0);
    const resultadoDebe = +(sumaDeuda / cantidadRoommates);
    return resultadoDebe;
};

const recibe = (roommate, gasto, cantidadRoommates) => {
    const sumaRecibe = gasto.reduce((acumulador, gastoActual) => {
        if (gastoActual.roommate == roommate){
            const resultado = acumulador + gastoActual.monto;
            return resultado;
        } else {
            const resultado = acumulador + 0;
            return resultado;
        }
    }, 0);
    const resultadoRecibe = +(sumaRecibe / cantidadRoommates);
    return resultadoRecibe;
};

const updateRoommates = () => {
    const roommatesJSON = JSON.parse(fs.readFileSync('assets/json/roommates.json', 'utf8'));
    const { gastos: gastosJSON } = JSON.parse(fs.readFileSync('assets/json/gastos.json', 'utf8'));
    //console.log('gastos97',gastosJSON);
    const { roommates } = roommatesJSON;
    const cantidadRoommates = roommates.length;
    //console.log('cantidad Roommates', cantidadRoommates);
    if(cantidadRoommates > 0){
        roommates.map((roommate) => {
            roommate.debe = debe(roommate.nombre, gastosJSON, cantidadRoommates);
            //console.log('Roommate Debe',roommate.debe);
            roommate.recibe = recibe(roommate.nombre, gastosJSON, cantidadRoommates);
            //console.log('roommate recibe',roommate.recibe);
        });
        fs.writeFileSync('./assets/json/roommates.json', JSON.stringify({roommates}), 'utf8')
    } 
};


module.exports = { getGastos, addGasto, editGasto, deleteGasto, updateRoommates, updateGastos }


