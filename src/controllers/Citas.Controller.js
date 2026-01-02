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
     

        const [result] =await  pool.query("select C.id_Cita,C.FechaCreacion,C.Estado,C.TipoSeguro,C.PacienteNombres,C.PacienteApellidos,C.Correo,C.TipoDocumento,C.NumeroDocumento,C.Celular,C.FechaHorario,C.HoraInicio,C.HoraFin,E.Descripcion as Especialidad,CONCAT(M.Nombres, ' ', M.Apellidos) AS Medico from Citas as C inner join HorariosMedico as HM ON HM.id_Horario=C.id_Horario inner join Medico as M ON M.id_medico=HM.id_medico INNER JOIN Especialidad E on E.id_especialidad=M.id_especialidad ORDER by C.id_Cita desc");
        
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
    var FechaCreacion=new Date() 
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
    const [rows]= await pool.query('INSERT INTO Citas(id_Horario,FechaCreacion,PacienteNombres,PacienteApellidos,TipoDocumento,NumeroDocumento,Celular,Correo,FechaHorario,HoraInicio,HoraFin,TipoSeguro) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',[id_Horario,FechaCreacion,PacienteNombres,PacienteApellidos,TipoDocumento,NumeroDocumento,Celular,Correo,FechaHorario,HoraInicio,HoraFin,TipoSeguro])
       
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

        sendSmtpEmail.subject = "Reserva Citas Final";
        sendSmtpEmail.to = [
        { email: Correo, name:PacienteNombres},
        //   { email: "fazttech@gmail.com", name: "Joe Mcmillan" },
        ];
        sendSmtpEmail.htmlContent =`
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
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">Documento Identidad:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: 500;">
                        ${TipoDocumento} - ${NumeroDocumento}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">Celular Contacto:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: 500;">${Celular}</td>
                    </tr>
                    <tr style="background-color: #f8fafc;">
                        <td colspan="2" style="padding: 10px; border-bottom: 2px solid #e2e8f0; padding-top: 15px;">
                        <strong style="color: #0369a1; text-transform: uppercase;">2. Detalles de la Cita</strong>
                        </td>
                    </tr>
                     <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">Especialidad:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: 500;">${Especialidad}</td>
                    </tr>
                     <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">Médico Tratante:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: 500;">Dr ${Medico}</td>
                    </tr>
                     <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">Fecha Programada:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: 500; color: #0284c7;">${FechaHorario}</td>
                    </tr>
                     <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">Horario Atención:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: 500;">${HoraInicio}-${HoraFin}</td>
                    </tr>
                    </table>
                    <div style="margin-top: 25px; padding: 10px; background-color: #fffbeb; border: 1px solid #fcd34d; border-radius: 4px; font-size: 12px; color: #92400e;">
                    <strong>Importante:</strong> Por favor preséntese 15 minutos antes de su cita. Es obligatorio portar su documento de identidad físico para la admisión..
                    </div>
                </div>
                </div>
                    
            `
       sendSmtpEmail.sender = {
        name: "ClinicaLosFresnos",
        email: "noresponder@clinicalosfresnos.com.pe",
        }

      const result =apiInstance.sendTransacEmail(sendSmtpEmail);
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

export const ActualizarEmpleado=async(req,res)=>{

const {id}=req.params.id
const {Nombres,Apellidos,Dni,Telefono,Turno,FechaCita}=req.body;

const [result]=pool.query("update Citas Set Nombres=?,Apellidos=?,Dni=?,Telefono=?,Turno=?,FechaCita=? WHERE IdCita=?",
    [Nombres,Apellidos,Dni,Telefono,Turno,FechaCita,id]
)

if(result.affectedRows===0){

    return res.status(4040).json({

        message:"Citas no encontrada ni actualizada"
    })

}


/*es decir la geurra*/

const [rows] =await  pool.query("Select * from Citas Where IdCita=?",[id]);

res.json(rows)

}