import { Router } from "express";
import { listGames, creatGame} from "../controllers/gamesControllers.js";

const router = Router();

router.get("/games", listGames);

router.post("/games", creatGame);

export default router;