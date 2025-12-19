import { pool } from "../db/conexion.js";


export const GetHorarios=async(req,res)=>{

      try {
     

        const [result] =await  pool.query("select HM.id_Horario,HM.FechaHorario,HM.HoraInicio,HM.HoraFin,HM.Cupos,CONCAT(M.Apellidos,' ' ,M.Nombres) AS Medico,M.id_medico,E.Descripcion as Especialidad from HorariosMedico as HM inner join Medico AS M ON M.id_medico=HM.id_medico inner join Especialidad as E on M.id_especialidad=E.id_especialidad");
        
        res.send(result)

    }catch(error){

        return res.status(500).json({
            mensaje:"Error"
        })
    }
}

export const GetHorarioId=async(req,res)=>{

   const IdHorario=req.params.id
  console.log(IdHorario)
      try {
     
          
        const [result] =await  pool.query("select HM.id_Horario,HM.FechaHorario,HM.HoraInicio,HM.HoraFin,HM.Cupos,CONCAT(M.Apellidos,' ' ,M.Nombres) AS Medico,M.id_medico,E.Descripcion as Especialidad from HorariosMedico as HM inner join Medico AS M ON M.id_medico=HM.id_medico inner join Especialidad as E on M.id_especialidad=E.id_especialidad where HM.id_Horario=?",[IdHorario]);
        
        res.send(result)

    }catch(error){

        return res.status(500).json({
            mensaje:"Error"
        })
    }
}

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