import nodemailer from "nodemailer"

const transporter=nodemailer.createTransport({
  service:"gmail",
  host:"smtp.gmail.com",
  port:587,
  secure:true,
  auth:{
    user:"ecuevah70@gmail.com",
     pass:"adyzchdpswbaydrk"
  }
})

export async function enviarEmailConfiguracion(direccion) {

    transporter.sendMail({
        to:"ecuevah70@gmail.com",
        from:direccion,
        subject:"Reserva de Citas",
        html:`Mi correo es direccion ${direccion}`

    })
}