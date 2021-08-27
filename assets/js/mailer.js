const nodemailer = require('nodemailer');
const config = {
    service: 'gmail',
    auth: {
        user: 'nodemailerADL@gmail.com',
        pass: 'desafiolatam'
    }
};
const transporter = nodemailer.createTransport(config);
const sendMail = (gasto) => {
    transporter.sendMail({
        from: 'nodemailerADL@gmail.com',
        to: 'daniel.rivas.g2a@gmail.com',
        subject: 'Nuevo gasto añadido en Roommates',
        html: ` 
                <h1> Se ha generado un nuevo gasto en la aplicación Roommates </h1>
                <p> Detalle: </p>
                <ul> 
                    <li> Roommate: ${gasto.roommate} </li>
                    <li> Detalle: ${gasto.descripcion} </li>
                    <li> Monto: ${gasto.monto} </li>
                </ul>
            `,
    }, console.log('Email enviado'));
};

module.exports = { sendMail }