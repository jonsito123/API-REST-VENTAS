import {Router} from "express"
import { GetCitas,CrearCita, EliminarEmpleado, ObtenerCita, ActualizarEmpleado } from "../controllers/Citas.Controller.js";
import { GetEspecialidades } from "../controllers/EspecialidadController.js";
import { ObtenerInfomacionMedico, ObtenerMedicosEspecialidad } from "../controllers/MedicosController.js";
import { ObtenerHorariosMedico, ObtenerHorariosPorFechaMedico } from "../controllers/HorariosMedicoController.js";
import { ActualizarHorario, CrearHorarioMedico, GetHorario, GetHorarioId, GetHorarios} from "../controllers/HorarioController.js";
import { EnviarCorreo } from "../controllers/Correo.Controller.js";
const router=Router();


router.get("/Citas",GetCitas)
router.post("/Citas",CrearCita)
router.get("/Citas/:id",ObtenerCita)
router.delete("/Citas/:id",EliminarEmpleado)
router.put("/Citas/:id",ActualizarEmpleado)
router.get("/Especialidades",GetEspecialidades)
router.get("/Medicos/:id",ObtenerInfomacionMedico)
router.get("/MedicosEspecialidad/:id",ObtenerMedicosEspecialidad)
/*obtener horario para panal administracion*/ 
router.get("/Horarios",GetHorarios)
router.get("/HorarioEspecifico/:id",GetHorario)
/*Horario con informacion */
router.get("/Horario/:id",GetHorarioId)
router.put("/Horario/:id",ActualizarHorario )
router.post("/Horario",CrearHorarioMedico)

router.get("/HorariosMedico/:id",ObtenerHorariosMedico)
router.post("/HorariosMedicoFecha",ObtenerHorariosPorFechaMedico)
router.post("/EnviarCorreo",EnviarCorreo)

export default router