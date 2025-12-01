import {Router} from "express"
import { GetCitas,CrearCita, GetCita, EliminarEmpleado } from "../controllers/Citas.Controller.js";
const router=Router();


router.get("/Citas",GetCitas)
router.post("/Citas",CrearCita)
router.get("/Citas/:id",GetCita)
router.delete("/Citas/:id",EliminarEmpleado)
router.put("/Citas/:id",EliminarEmpleado)
export default router