import { Request, Response } from "express";
import npcs from "../Models/npc";
import { answer, answer2, answerTest, createPrompt } from "./gpt";

// Se isnerta un nuevo NPC
export const addNpc = async (req: Request, res: Response) => {
    try {
        const { name, mood, firstMessage } = req.body;

        if (name && mood && firstMessage) {
            const flow: Array<[boolean, string]> = [[true, firstMessage]];

            const newNpc = new npcs({ name, mood, flow });
            const addNpc = await newNpc.save();
            const npcReturn = await npcs.findById(addNpc._id);
            return res.status(200).json(npcReturn);
        } else {
            return res.status(409).send('Conflict: Missing required fields');
        }

    } catch (error) {
        return res.status(500).send(error);
    }
}

// Obtiene la información de todos los NPCs
export const allNpc = async (req: Request, res: Response) => {
    try {
        const allNpcs = await npcs.find();
        return res.status(200).json(allNpcs);
    } catch (error) {
        return res.status(500).send(error);
    }
}

// Se agrega mensaje del jugador al flujo conversacional
export const sendMessageNpc = async (req: Request, res: Response) => {
    try {
        const id: string = req.body.id;
        const message: string = req.body.message;
        
        if (id && message) {
            const findNpc = await npcs.findById(id);
            if (findNpc) {

                const answerNpc = await answer2(findNpc.name, findNpc.flow, message);
                
                const flow = findNpc.flow;
                const messageFlow: [boolean, string] = [false, message]; 
                const answerFlow: [boolean, string] = [true, answerNpc];
                
                // Concatenación de mensajes
                const newFlow: Array<[boolean, string]> = [
                    ...flow, messageFlow, answerFlow
                ];
                
                // Actualiza el flujo conversacional
                findNpc.flow = newFlow;
                // Guarda el nuevo NPC
                await findNpc.save(); 
                return res.status(200).json(answerFlow); 
            } else {
                return res.status(404).send('NPC not found'); 
            }
        } else {
            return res.status(400).send('Missing required fields'); 
        }
    } catch (error) {
        return res.status(500).send('Internal Server Error'); 
    }
}
