import { pool } from "../db/conexion.js";
export const GetEspecialidades=async(req,res)=>{

    try {
     

        const [result] =await  pool.query("Select Especialidad.id_especialidad,Especialidad.Descripcion from Especialidad WHERE   Especialidad.id_especialidad in (select id_especialidad from Medico as M inner join HorariosMedico AS HM on M.id_medico=HM.id_medico where HM.FechaHorario>=CURDATE())");
        res.send(result)

    }catch(error){

        return res.status(500).json({
            mensaje:"Error"
        })
    }

 
}
