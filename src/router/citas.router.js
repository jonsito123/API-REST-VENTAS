import {Router} from "express"
import { GetCitas,CrearCita, EliminarEmpleado, ObtenerCita, ActualizarEmpleado } from "../controllers/Citas.Controller.js";
import { GetEspecialidades } from "../controllers/EspecialidadController.js";
import { ObtenerInfomacionMedico, ObtenerMedicosEspecialidad } from "../controllers/MedicosController.js";
import { ObtenerHorariosMedico } from "../controllers/HorariosMedicoController.js";
import { CrearHorarioMedico } from "../controllers/HorarioController.js";
const router=Router();


router.get("/Citas",GetCitas)
router.post("/Citas",CrearCita)
router.get("/Citas/:id",ObtenerCita)
router.delete("/Citas/:id",EliminarEmpleado)
router.put("/Citas/:id",ActualizarEmpleado)
router.get("/Especialidades",GetEspecialidades)
router.get("/Medicos/:id",ObtenerInfomacionMedico)
router.get("/MedicosEspecialidad/:id",ObtenerMedicosEspecialidad)
router.post("/Horario",CrearHorarioMedico)
router.get("/HorariosMedico/:id",ObtenerHorariosMedico)

export default router