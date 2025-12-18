import nodemailer from "nodemailer"
const transporter=nodemailer.createTransport({
    host:"smtp.sendlayer.net",
    port:587,
    auth:{
        user:"ecuevah70@gmail.com",
        pass:"adyzchdpswbaydrk"
    }
})

export const EnviarCorreo=async(PacienteNombres,PacienteApellidos,Correo)=>{

 let mensajeHtml=`
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #0284c7; padding: 20px; text-align: center; color: white;">
                        <h2 style="margin: 0;">Reserva Confirmada</h2>
                        <p style="margin: 5px 0 0 0; font-size: 14px;">Clínica Los Fresnos</p>
                    </div>
                    <div style="padding: 20px;">
                        <p>Estimado(a) <strong>${PacienteNombres} ${PacienteApellidos}</strong>,</p>
                        <p>Su cita médica ha sido registrada exitosamente. A continuación encontrará todos los detalles de su reserva:</p>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;">
                        <tr style="background-color: #f8fafc;">
                            <td colspan="2" style="padding: 10px; border-bottom: 2px solid #e2e8f0;">
                            <strong style="color: #0369a1; text-transform: uppercase;">1. Datos del Paciente</strong>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 40%;">Nombre Completo:</td>
                            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: 500;">${PacienteNombres} ${PacienteApellidos}</td>
                        </tr>                                                
                        </table>
                        <div style="margin-top: 25px; padding: 10px; background-color: #fffbeb; border: 1px solid #fcd34d; border-radius: 4px; font-size: 12px; color: #92400e;">
                        <strong>Importante:</strong> Por favor preséntese 15 minutos antes de su cita. Es obligatorio portar su documento de identidad físico para la admisión..
                        </div>
                    </div>
                </div>
                    
            ` 

         
    await  transporter.sendMail({
            from: '"Pretwor" <youremail@gmail.com>', // sender address
            to: Correo, // list of receivers
            subject:"Correo enviado correctamente" , // Subject line
            html: mensajeHtml
        }).then(()=>{

            console.log("CorrectamenteEnviado")
        })
        .catch((error)=>{
            console.log("No se envio correctamente el error",error)
        })
}
