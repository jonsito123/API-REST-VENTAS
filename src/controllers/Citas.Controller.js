import { pool } from "../db/conexion.js";
import {Resend} from "resend"

const resend = new Resend("re_2dtQfq2M_Pdtc4piKUtJaJ6MafXQkszDd");


export const GetCitas=async(req,res)=>{

    try {
     

        const [result] =await  pool.query("select C.id_Cita,C.FechaCreacion,C.Estado,C.PacienteNombres,C.PacienteApellidos,C.Correo,C.TipoDocumento,C.NumeroDocumento,C.Celular,C.FechaHorario,C.HoraInicio,C.HoraFin,E.Descripcion as Especialidad,CONCAT(M.Nombres, ' ', M.Apellidos) AS Medico from Citas as C inner join HorariosMedico as HM ON HM.id_Horario=C.id_Horario inner join Medico as M ON M.id_medico=HM.id_medico INNER JOIN Especialidad E on E.id_especialidad=M.id_especialidad ORDER by C.FechaCreacion desc");
        
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
    const FechaCreacion=new Date()
    const PacienteNombres=body.PacienteNombres
    const PacienteApellidos=body.PacienteApellidos;
    const TipoDocumento=body.TipoDocumento;
    const NumeroDocumento=body.NumeroDocumento;
    const Celular=body.Celular;

    
    /*consultar horario obteneido*/
    const [horario] =await  pool.query("SELECT FechaHorario,HoraInicio,HoraFin FROM HorariosMedico WHERE id_Horario=?",[id_Horario]);
    
    const Horario=horario[0];
    
    var FechaHorario=Horario.FechaHorario.toISOString().split("T")[0]
    var HoraInicio=Horario.HoraInicio
    var HoraFin=Horario.HoraFin
    const [rows]= await pool.query('INSERT INTO Citas(id_Horario,FechaCreacion,PacienteNombres,PacienteApellidos,TipoDocumento,NumeroDocumento,Celular,Correo,FechaHorario,HoraInicio,HoraFin) VALUES(?,?,?,?,?,?,?,?,?,?,?)',[id_Horario,FechaCreacion,PacienteNombres,PacienteApellidos,TipoDocumento,NumeroDocumento,Celular,Correo,FechaHorario,HoraInicio,HoraFin])
       
        /*correo base de mi emisor*/
        /*obtener informacion medico */
       // const [result] =await  pool.query("select  HM.id_Horario,HM.FechaHorario,HM.HoraInicio,HM.HoraFin,HM.Cupos,Concat(M.Apellidos,'  ', M.Nombres) as Doctor,E.Descripcion AS Especialidad from HorariosMedico as HM  inner join Medico as M  on M.id_medico=HM.id_medico inner join Especialidad as E ON E.id_especialidad=M.id_especialidad where HM.id_Horario=?",[id_Horario]);
       /*enviar el corroe*/
        /*que pasa que si inserto correctamente*/ 
         
        //var
         /*conversion de horario*/
        //var  date = new Date(doctor.FechaHorario);
       // const FechaHorario=date.toLocaleDateString("en-GB")
     
        /*enviar email*/
        if(!rows.insertId) {

            return res.status(500).json({
            mensaje:"Error",
            error:"Error al insertar el registro"
            })
        }
        
    const data = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [Correo],
      subject: 'Hello World',
      html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
     
    });

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