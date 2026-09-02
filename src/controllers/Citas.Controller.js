import { pool } from "../db/conexion.js";
/*import {Resend} from "resend"*/
import dotenv from "dotenv"
/*const resend = new Resend("re_2dtQfq2M_Pdtc4piKUtJaJ6MafXQkszDd");*/

dotenv.config()

import brevo from "@getbrevo/brevo"
/*proteger las variables de entorno*/ 
const apiInstance=new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
    brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.KEY_API
)

export const GetCitas=async(req,res)=>{

    try {
     
        /*consulta resta api para Fresalud*/

        const [result] =await  pool.query("select C.id_Cita,C.FechaCrea,C.Consultorio,C.Estado,C.Monto,C.TipoSeguro,C.PacienteNombres,C.PacienteApellidos,C.Correo,C.TipoDocumento,C.NumeroDocumento,C.Celular,C.FechaHorario,C.HoraInicio,C.HoraFin,E.Descripcion as Especialidad,CONCAT(M.Nombres, ' ', M.Apellidos) AS Medico,M.IdMedicoFresalud from Citas as C inner join HorariosMedico as HM ON HM.id_Horario=C.id_Horario inner join Medico as M ON M.id_medico=HM.id_medico INNER JOIN Especialidad E on E.id_especialidad=M.id_especialidad ORDER by C.id_Cita desc");
        
        res.send(result)

    }catch(error){

        return res.status(500).json({
            mensaje:"Error"
        })
    }

 
}

export const CrearCita=async(req,res)=>{
try {
   
    /*paquete para enviar email*/

    const body=req.body;
    const id_Horario=body.id_Horario
    const Correo=body.Correo
    var FechaCreacion=new Date();
    const PacienteNombres=body.PacienteNombres
    const PacienteApellidos=body.PacienteApellidos;
    const TipoDocumento=body.TipoDocumento;
    const NumeroDocumento=body.NumeroDocumento;
    const Celular=body.Celular;
    const TipoSeguro=body.TipoSeguro
    
    /*consultar horario obteneido*/
    const [horario] =await  pool.query("SELECT FechaHorario,HoraInicio,HoraFin,CONCAT(M.Apellidos,',',M.Nombres) AS Medico,E.Descripcion AS Especialidad FROM HorariosMedico HM inner join Medico as M on M.id_medico=HM.id_medico inner join Especialidad as E on E.id_especialidad=M.id_especialidad WHERE HM.id_Horario=?",[id_Horario]);
    
    const Horario=horario[0];
    
    var FechaHorario=Horario.FechaHorario.toISOString().split("T")[0]
    
    var HoraInicio=Horario.HoraInicio
    var HoraFin=Horario.HoraFin
    var Medico=Horario.Medico
    var Especialidad=Horario.Especialidad
    const [rows]= await pool.query('INSERT INTO Citas(id_Horario,FechaCreacion,PacienteNombres,PacienteApellidos,TipoDocumento,NumeroDocumento,Celular,Correo,FechaHorario,HoraInicio,HoraFin,TipoSeguro,FechaCrea) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)',[id_Horario,FechaCreacion,PacienteNombres,PacienteApellidos,TipoDocumento,NumeroDocumento,Celular,Correo,FechaHorario,HoraInicio,HoraFin,TipoSeguro,FechaCreacion])
       
        /*correo base de mi emisor*/
        /*obtener informacion medico */
    FechaHorario = FechaHorario.split("-").reverse().join("/")   
       /*enviar el corroe*/
        /*que pasa que si inserto correctamente*/ 

     
        /*enviar email*/
        if(!rows.insertId) {

            return res.status(500).json({
            mensaje:"Error",
            error:"Error al insertar el registro"
            })
        }
        
         /*ENVIO DE CORREO*/

        const sendSmtpEmail = new brevo.SendSmtpEmail();

        sendSmtpEmail.subject = "Reserva Agendada";
        sendSmtpEmail.to = [
        { email: Correo, name:PacienteNombres},
        //   { email: "fazttech@gmail.com", name: "Joe Mcmillan" },
        ];
        sendSmtpEmail.htmlContent =     `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Registro de Reserva Exitoso</title>
                </head>
                <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f7f9; color: #333333; margin: 0; padding: 20px;">
                
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                            <td align="center">
                                <div style="max-width: 600px; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e1e8ed; text-align: left;">
                                    
                                    <!-- Encabezado -->
                                    <div style="background-color: #007bc4; padding: 25px 20px; text-align: center; color: white;">
                                        <h1 style="margin: 0; font-size: 22px; font-weight: 600;">Clínica Los Fresnos</h1>
                                        <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 13px;">Portal de Reserva de Citas Web</p>
                                    </div>
                
                                    <!-- Cuerpo -->
                                    <div style="padding: 25px;">
                                        <div style="display: inline-block; background-color: #e3f2fd; color: #0d47a1; border: 1px solid #bbdefb; padding: 6px 14px; border-radius: 20px; font-weight: bold; font-size: 12px; margin-bottom: 20px;">
                                            ✓ REGISTRO EXITOSO
                                        </div>
                                        
                                        <p style="font-size: 15px; line-height: 1.5; color: #444444; margin-top: 0; margin-bottom: 20px;">
                                            Estimado(a) <strong>${PacienteNombres} ${PacienteApellidos}</strong>,<br><br>
                                            Queremos confirmarle que los datos de su solicitud de atención médica han sido registrados correctamente en nuestro sistema web.
                                        </p>
                
                                        <!-- Bloque 1: Datos del Paciente -->
                                        <div style="background: #f8fafc; border: 1px solid #e9eff4; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                                            <div style="font-size: 13px; font-weight: 700; color: #007bc4; text-transform: uppercase; margin-bottom: 10px; border-bottom: 2px solid #e9eff4; padding-bottom: 5px;">
                                                1. Datos del Paciente Registrados
                                            </div>
                                            <table width="100%" cellspacing="0" cellpadding="4" border="0" style="font-size: 14px;">
                                                <tr>
                                                    <td style="color: #666666; font-weight: 500;">Nombre Completo:</td>
                                                    <td align="right" style="color: #111111; font-weight: 600;">${PacienteNombres} ${PacienteApellidos}</td>
                                                </tr>
                                                <tr>
                                                    <td style="color: #666666; font-weight: 500;">Documento Identidad:</td>
                                                    <td align="right" style="color: #111111; font-weight: 600;">${TipoDocumento}-${NumeroDocumento}</td>
                                                </tr>
                                                <tr>
                                                    <td style="color: #666666; font-weight: 500;">Celular Contacto:</td>
                                                    <td align="right" style="color: #111111; font-weight: 600;">${Celular}</td>
                                                </tr>
                                            </table>
                                        </div>
                
                                        <!-- Bloque 2: Detalles de la Cita -->
                                        <div style="background: #f8fafc; border: 1px solid #e9eff4; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                                            <div style="font-size: 13px; font-weight: 700; color: #007bc4; text-transform: uppercase; margin-bottom: 10px; border-bottom: 2px solid #e9eff4; padding-bottom: 5px;">
                                                2. Detalles de la Cita
                                            </div>
                                            <table width="100%" cellspacing="0" cellpadding="4" border="0" style="font-size: 14px;">
                                                <tr>
                                                    <td style="color: #666666; font-weight: 500;">Especialidad:</td>
                                                    <td align="right" style="color: #111111; font-weight: 600;">${Especialidad}</td>
                                                </tr>
                                                <tr>
                                                    <td style="color: #666666; font-weight: 500;">Médico Tratante:</td>
                                                    <td align="right" style="color: #111111; font-weight: 600;">Dr. ${Medico}</td>
                                                </tr>
                                                <tr>
                                                    <td style="color: #666666; font-weight: 500;">Fecha Programada:</td>
                                                    <td align="right" style="color: #111111; font-weight: 600;">${FechaHorario}</td>
                                                </tr>
                                                <tr>
                                                    <td style="color: #666666; font-weight: 500;">Horario Atención:</td>
                                                    <td align="right" style="color: #111111; font-weight: 600;">${HoraInicio}-${HoraFin}</td>
                                                </tr>
                                            </table>
                                        </div>
                
                                        <!-- Bloque Próximos Pasos -->
                                        <div style="background-color: #fff9db; border-left: 4px solid #f59f00; border-radius: 4px; padding: 15px; margin-bottom: 15px;">
                                            <div style="font-weight: 700; color: #b06a00; margin-bottom: 8px; font-size: 14px;">📌 ¿Cuáles son los siguientes pasos?</div>
                                            <ol style="margin: 0; padding-left: 18px; font-size: 13.5px; line-height: 1.5; color: #665200;">
                                                <li style="margin-bottom: 6px;"><strong>Contacto por WhatsApp:</strong> Nos comunicaremos con usted al número registrado para brindarle los métodos de pago.</li>
                                                <li><strong>Plazo de confirmación:</strong> Dispondrá de un lapso máximo de <strong>2 horas</strong> tras recibir el mensaje para realizar el pago.</li>
                                            </ol>
                                        </div>
                
                                        <!-- Alerta Admisión -->
                                        <div style="background-color: #fce8e6; border-left: 4px solid #d93025; border-radius: 4px; padding: 15px; margin-bottom: 15px; font-size: 13px; line-height: 1.5; color: #a51d14;">
                                            <strong>⚠️ IMPORTANTE PARA EL DÍA DE SU CITA:</strong><br>
                                            Preséntese <strong>15 minutos antes</strong>. Es obligatorio portar su <strong>DNI físico</strong> para el proceso de admisión.
                                        </div>
                                    </div>
                
                                    <!-- Pie de página -->
                                    <div style="background: #f1f5f8; padding: 15px; text-align: center; font-size: 11px; color: #777777; border-top: 1px solid #e9eff4;">
                                        Este es un correo automático, por favor no lo responda.<br>
                                        Soporte técnico: <a href="mailto:soporte@clinicalosfresnos.com.pe" style="color: #007bc4; text-decoration: none;">soporte@clinicalosfresnos.com.pe</a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>   
            `
       sendSmtpEmail.sender = {
        name: "ClinicaLosFresnos",
        email: "noresponder@clinicalosfresnos.com.pe",
        }

      const result =await   apiInstance.sendTransacEmail(sendSmtpEmail);
        /*respuesta correcta*/ 
        res.send({

            id:rows.insertId,
            PacienteNombres,
            PacienteApellidos,
            FechaCreacion,
            NumeroDocumento,
            mensaje:"No se puedo enviar su detalle confirmación,se esta comunicando por el numero de celuar"

        })
     
        /*que lo lea nomas */
       
       /*enviar el correo ultimi*/

       

}catch(error){


     console.log(error)
    return res.status(500).json({
            mensaje:"Error",
            error:error.message
    })


}

    
}

export const ObtenerCita=async(req,res)=>{

   const IdCita=req.params.id

    try {
     

         const [result] =await  pool.query("select C.id_Cita,C.FechaCreacion,C.PacienteNombres,C.PacienteApellidos,C.TipoDocumento,C.NumeroDocumento,C.Celular,HM.FechaHorario,E.Descripcion, M.Nombres,M.Apellidos from Citas as C inner join HorariosMedico as HM ON HM.id_Horario=C.id_Horario inner join Medico as M ON M.id_medico=HM.id_medico INNER JOIN Especialidad E on E.id_especialidad=M.id_especialidad where C.id_Cita=? ORDER by C.id_Cita",[IdCita]);
        
        res.send(result)


    }catch(error){

        return res.status(500).json({
            mensaje:"Error"
        })
    }

 
}


export const EliminarEmpleado=async(req,res)=>{


const [result]=pool.query("delete from Citas Where IdCita = ?",[req.params.id])
 

if(result.affectedRows <=0){

 return res.status(400).json({

    message:"Empleado no encontrado"
 })
}
res.status(204).json({
 message:"Empleado eliminado correctamente"
})

}

export const ActualizarEstadoCita=async(req,res)=>{

const id=req.params.id
const Monto=req.body.Monto
const Consultorio=req.body.Consultorio    

const [result]=await pool.query("update Citas set Estado=1,Monto=?,Consultorio=? where id_Cita=?",[Monto,Consultorio,id])

if(result.affectedRows===0){

    return res.status(404).json({

        message:"Citas no encontrada ni actualizada"
    })

}
else {

     return res.status(200).json({

        message:"Cita actualizada correctamente"
    })
}



}
