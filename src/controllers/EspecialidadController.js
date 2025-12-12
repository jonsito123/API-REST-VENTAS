import { pool } from "../db/conexion.js";
export const GetEspecialidades=async(req,res)=>{

    try {
     

        const [result] =await  pool.query("Select * from Especialidad");
        res.send(result)

    }catch(error){

        return res.status(500).json({
            mensaje:"Error"
        })
    }

 
}