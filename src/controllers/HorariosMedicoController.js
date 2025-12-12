import { pool } from "../db/conexion.js";


export const ObtenerHorariosMedico=async(req,res)=>{


    const medico=req.params.id;


const [rows] =await  pool.query("select  HM.id_Horario,M.id_medico,HM.FechaHorario,HM.HoraInicio,HM.HoraFin,HM.Cupos,Concat(M.Apellidos,'  ', M.Nombres) as Doctor,E.Descripcion AS Especialidad from HorariosMedico as HM  inner join Medico as M  on M.id_medico=HM.id_medico inner join Especialidad as E ON E.id_especialidad=M.id_especialidad where HM.FechaHorario >=DATE(CONVERT_TZ(NOW(), @@session.time_zone, 'America/Lima')) and M.id_medico=?",[medico]);

if(rows.length<=0 || rows.length===0){
     return res.status(404).json({ 
            mensaje: "No existe medico con ese ID" 
        }); 

}

 res.json(rows) 
}





export const ObtenerInformacionMedicoPorIdHorario=async(req,res)=>{


    const medico=req.params.id;


const [rows] =await  pool.query("select  HM.id_Horario,M.id_medico,HM.FechaHorario,HM.HoraInicio,HM.HoraFin,HM.Cupos,Concat(M.Apellidos,'  ', M.Nombres) as Doctor,E.Descripcion AS Especialidad from HorariosMedico as HM  inner join Medico as M  on M.id_medico=HM.id_medico inner join Especialidad as E ON E.id_especialidad=M.id_especialidad where HM.FechaHorario >= CURDATE() and M.id_medico=?",[medico]);

if(rows.length<=0 || rows.length===0){
     return res.status(404).json({ 
            mensaje: "No existe medico con ese ID" 
        }); 

}

 res.json(rows) 
}

