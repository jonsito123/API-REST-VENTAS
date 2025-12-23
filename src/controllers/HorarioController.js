import { pool } from "../db/conexion.js";


export const GetHorario=async(req,res)=>{

   const IdHorario=req.params.id

      try {
     
          
        const [result] =await  pool.query("SELECT * FROM HorariosMedico WHERE id_Horario=?",[IdHorario]);
        
        res.send(result)

    }catch(error){

        return res.status(500).json({
            mensaje:"Error"
        })
    }
}

export const GetHorarioId=async(req,res)=>{

   const IdHorario=req.params.id

      try {
     
          
        const [result] =await  pool.query("select HM.id_Horario,HM.FechaHorario,HM.HoraInicio,HM.HoraFin,HM.Cupos,CONCAT(M.Apellidos,' ' ,M.Nombres) AS Medico,M.id_medico,E.Descripcion as Especialidad from HorariosMedico as HM inner join Medico AS M ON M.id_medico=HM.id_medico inner join Especialidad as E on M.id_especialidad=E.id_especialidad where HM.id_Horario=?",[IdHorario]);
        
        res.send(result)

    }catch(error){

        return res.status(500).json({
            mensaje:"Error"
        })
    }
}


export const GetHorarios=async(req,res)=>{

      try {
     

        const [result] =await  pool.query("select HM.id_Horario,HM.FechaHorario,HM.HoraInicio,HM.HoraFin,HM.Cupos,CONCAT(M.Apellidos,' ' ,M.Nombres) AS Medico,M.id_medico,E.Descripcion as Especialidad from HorariosMedico as HM inner join Medico AS M ON M.id_medico=HM.id_medico inner join Especialidad as E on M.id_especialidad=E.id_especialidad order by id_Horario desc");
        
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

export const ActualizarHorario=async(req,res)=>{


    const IdHorario=req.params.id


    const HorarioAtencion=req.body.HorarioAtencion;
    const HorarioInicio=req.body.HorarioInicio;
    const HorarioFin=req.body.HorarioFin;
    const Cupos=req.body.Cupos;
    
    
   
  
    try {

    const [rows]=await pool.query("update HorariosMedico set FechaHorario=?,HoraInicio=?,HoraFin=?,Cupos=? where id_Horario=?",[HorarioAtencion,HorarioInicio,HorarioFin,Cupos,IdHorario])

    if(!rows.affectedRows) {

                return res.status(500).json({
                mensaje:"Error",
                error:"Error al actualizar el horario por fabor verificar"
                })
        }   
        res.send({

            id:rows.affectedRows,
            mensaje:"Se actualizo correctamente el horario"

        })
    

    }catch(e){
      
        res.send({
            rpta:"Not fund insert"
        })
    }
   


   
}





