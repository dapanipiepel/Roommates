const http = require('http');
const fs = require('fs');
const url = require('url');
const port = 3000;
const { v4: uuidv4 } = require('uuid');
const { newRoommate, saveRoommate } = require('./roommates');
const { getGastos, addGasto, editGasto, deleteGasto, updateGastos, updateRoommates } = require('./gastos')
const { sendMail } = require('./mailer');


http.createServer(async (req, res) => {
    if (req.url == '/' && req.method == 'GET') {
        res.setHeader('Content-Type', 'text/html');
        res.end(fs.readFileSync('index.html', { encoding: 'utf8' }));
    };

    if (req.url.startsWith('/roommate') && req.method == 'POST') {
        newRoommate().then(async (roommate) => {
            saveRoommate(roommate);
            res.end(JSON.stringify(roommate))
        }).catch(error => {
            res.statusCode = 500;
            res.end();
            console.log('Error al registrar un nuevo random roommate', error);
        })
    };

    if (req.url.startsWith('/roommates') && req.method == 'GET') {
        try {
            updateRoommates();
            res.setHeader('Content-Type', 'application/json');
            res.end(fs.readFileSync('assets/json/roommates.json'));
        } catch (error) {
            console.log('Error al obtener los roommates', error.message);
        }
        //console.log('alooo');
    };

    if (req.url.startsWith('/gastos') && req.method == 'GET') {
        try {
            const gastos = getGastos();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            //console.log('gastosindexjs36', gastos);
            res.end(JSON.stringify(gastos));
        } catch (error) {
            console.log('Error al obtener los gastos', error.message);
        }

    };

    if (req.url.startsWith('/gasto') && req.method == 'POST') {
        let body = '';
        req.on('data', (chunk) => {
            try {
                body += chunk;

            } catch (error) {
                console.log('error al asignar el cuerpo', error);
            }
        });
        req.on('end', () => {
            try {
                body = JSON.parse(body);
                console.log('body', body);
                body.id = uuidv4().slice(-5);
                addGasto(body);
                //sendMail(body); VERIFICAR Q FUNCIONE EL CORREO
                res.end('Gasto agregado');
                
            } catch (error) {
                console.log('Error al agregar el gasto', error.message);
            }
            
        });

    };

    if (req.url.startsWith('/gasto') && req.method == 'PUT') {
        const { id } = url.parse(req.url, true).query;
        //console.log(id);
        let body = '';
        if (id) {
            req.on('data', (chunk) => {
                try {
                    body += chunk;
                } catch (error) {
                    console.log('Error al parsear el cuerpo', error);
                };
            });
        }
        req.on('end', () => {
            try {
                const gasto = JSON.parse(body);
                editGasto(id, gasto);
                updateGastos();
                res.statusCode = 200;
                res.end('Gasto editado');
            } catch (error) {
                console.log('No se pudo editar el gasto', error);
            };
        });
    };

    if (req.url.startsWith('/gasto') && req.method == 'DELETE') {
        const { id } = url.parse(req.url, true).query;
        //console.log(id);
        if (id) {
            try {
                deleteGasto(id);
                res.statusCode = 200;
                res.end('Gasto eliminado')
            } catch (error) {
                res.statusCode = 500;
                console.log('El id es inválido', error);
                res.end('El gasto no ha sido eliminado')
            }
        }
    };



}).listen(port, console.log('Server running at: http://localhost:3000'))