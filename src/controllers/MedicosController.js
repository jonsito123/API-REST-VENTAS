import { pool } from "../db/conexion.js";


export const ObtenerInfomacionMedico=async(req,res)=>{


   const IdMedico=req.params.id;

   res.send({
    msg:"Not found"
   })
   
}

export const ObtenerMedicosEspecialidad=async(req,res)=>{

    const especialidad=req.params.id;


    const [rows] =await  pool.query("SELECT M.id_medico,M.CMP,Nombres,Apellidos,Descripcion as Especialidad FROM Medico AS M inner join Especialidad as E  ON E.id_especialidad=M.id_especialidad where  M.id_medico in (select M.id_medico from Medico as M inner join HorariosMedico AS HM on M.id_medico=HM.id_medico where HM.FechaHorario >=CURRENT_DATE() AND id_especialidad=?)",[especialidad]);
 
    if(rows.length<=0 || rows.length===0){
        return res.status(404).json({ 
                mensaje: "No existe medico con ese ID" 
            });

    }

    res.json(rows) 
    }




/*resultado correcto*/



