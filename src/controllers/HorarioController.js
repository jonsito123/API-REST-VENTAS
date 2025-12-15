import { pool } from "../db/conexion.js";


export const CrearHorarioMedico=async(req,res)=>{


   const id_medico=req.body.id_medico
   const FechaHorario=req.body.FechaHorario
   const Cupos=req.body.Cupos
   const HoraInicio=req.body.HoraInicio
   const HoraFin=req.body.HoraFin
   
  
    try {

    const [rows]=await pool.query("insert into HorariosMedico(id_medico,FechaHorario,HoraInicio,HoraFin,Cupos) VALUES (?,?,?,?,?)",[id_medico,FechaHorario,HoraInicio,HoraFin,Cupos])

    if(!rows.insertId) {

                return res.status(500).json({
                mensaje:"Error",
                error:"Error al insertar el Horario"
                })
        }   
        res.send({

            id:rows.insertId,
            mensaje:"Horario Creado Correctamente"

        })
    

    }catch(e){
      
        res.send({
            rpta:"Not fund insert"
        })
    }
   


   
}