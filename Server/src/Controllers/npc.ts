import { Request, Response } from "express";
import npcs from "../Models/npc";

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
