import express, { Router } from "express";
import connectDB from "./database";
import routerNpc from "./Routes/npc";

// Conexión con la base de datos
connectDB();

const app = express();
app.use(express.json());

// Definición de rutas
app.use('/npc/', routerNpc);

app.listen(8085, () => console.log("active server"));
