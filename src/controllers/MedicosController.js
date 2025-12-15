import { pool } from "../db/conexion.js";


export const ObtenerInfomacionMedico=async(req,res)=>{


   const IdMedico=req.params.id;

   res.send({
    msg:"Not found"
   })
   
}

export const ObtenerMedicosEspecialidad=async(req,res)=>{


    const especialidad=req.params.id;


const [rows] =await  pool.query("SELECT  M.id_medico ,Nombres,Apellidos,Descripcion as Especialidad FROM Medico AS M inner join Especialidad as E  ON E.id_especialidad=M.id_especialidad where E.id_especialidad=?",[especialidad]);
 
if(rows.length<=0 || rows.length===0){
     return res.status(404).json({ 
            mensaje: "No existe medico con ese ID" 
        });

}

 res.json(rows) 
}




/*resultado correcto*/



