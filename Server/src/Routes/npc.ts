import { Router } from "express";
import { addNpc, allNpc, getNpc, sendMessageNpc, test, createModel, deleteNpc } from "../Controllers/npc";

const routerNpc = Router();

routerNpc.get('/train', createModel);
routerNpc.get('/test', test);
routerNpc.post('/add', addNpc);
routerNpc.get('/all', allNpc);
routerNpc.get('/:id', getNpc);
routerNpc.post('/:id', sendMessageNpc);
routerNpc.delete('/:id', deleteNpc);

export default routerNpc;