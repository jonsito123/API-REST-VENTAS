import { pool } from "../db/conexion.js";




export const GetCitas=async(req,res)=>{

    try {
     

        const [result] =await  pool.query("Select * from Citas");
        res.send(result)

    }catch(error){

        return res.status(500).json({
            mensaje:"Error"
        })
    }

 
}

export const CrearCita=async(req,res)=>{
  try {
   const {Nombres,Apellidos,Dni,Telefono,Turno,FechaCita}=req.body;
    
   const [rows]= await pool.query('INSERT INTO Citas(Nombres,Apellidos,Dni,Telefono,Turno,FechaCita) VALUES (?,?,?,?,?,?)',[

    Nombres,Apellidos,Dni,Telefono,Turno,FechaCita
    ])
     res.send({

        id:rows.insertId,
        Nombres,
        Apellidos
     })

  }catch(error){
      return res.status(500).json({
            mensaje:"Error"
        })

  }

    
}

export const GetCita=async(req,res)=>{

const cita=req.params.id;


const [rows] =await  pool.query("Select * from Citas Where IdCita=?",[cita]);

if(rows.length<=0){
    return res.status(404).json({

        message:"Empleado no encontrado"
    })

}

/*resultado correcto*/
res.json(rows[0]) 

 
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