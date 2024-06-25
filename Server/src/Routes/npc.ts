import { Router } from "express";
import { addNpc } from "../Controllers/npc";

const routerNpc = Router();

routerNpc.post('/add', addNpc);

export default routerNpc;