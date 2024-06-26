import { Router } from "express";
import { addNpc, allNpc, sendMessageNpc } from "../Controllers/npc";

const routerNpc = Router();

routerNpc.post('/add', addNpc);
routerNpc.get('/all', allNpc);
routerNpc.get('/send', sendMessageNpc);

export default routerNpc;