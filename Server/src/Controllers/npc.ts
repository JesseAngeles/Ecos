import { Request, Response } from "express";
import npcs from "../Models/npc";
import { answer, answer2, answerTest, createPrompt } from "./gpt";
import { loadModelFromCSV, naives, predict, readCSV, saveModelToCSV } from "./feeling";

// Prueba de conexión
export const createModel = async (req: Request, res: Response) => {
    console.log("Prueba de conexión");
    const data = readCSV();
    const model = naives(data);
    saveModelToCSV(model);

    return res.status(200).send('Model trained');
}

// Prueba de conexión
export const test = async (req: Request, res: Response) => {
    const sentence = req.body.sentence;

    if (sentence) {
        const model = loadModelFromCSV();
        const prediction = predict(sentence, model);

        return res.status(200).json(prediction);
    } else {
        return res.status(409).send('Conflict: Missing required fields');
    }
}



// Se inserta un nuevo NPC
export const addNpc = async (req: Request, res: Response) => {
    try {
        const { name, mood, flow } = req.body;

        if (name && mood && flow) {
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

// Obtiene la informacion de un solo NPC
export const getNpc = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (id) {
            const npc = await npcs.findById(id);
            if (npc) {
                return res.status(200).json(npc);
            } else {
                return res.status(404).send("Cant find register");
            }
        } else {
            return res.status(400).send("Missing required fields");
        }
    } catch (error) {

    }
}

// Se agrega mensaje del jugador al flujo conversacional
export const sendMessageNpc = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
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

                return res.status(200).json(findNpc);
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
