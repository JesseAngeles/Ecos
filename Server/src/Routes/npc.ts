import { Router } from "express";
import { addNpc, allNpc, getNpc, sendMessageNpc, connectionTest } from "../Controllers/npc";

const routerNpc = Router();

routerNpc.get('/test', connectionTest);
routerNpc.post('/add', addNpc);
routerNpc.get('/all', allNpc);
routerNpc.get('/:id', getNpc);
routerNpc.post('/:id', sendMessageNpc);

export default routerNpc;