import express from 'express';
import cors from 'cors'; // Importar el middleware CORS
import connectDB from './database';
import routerNpc from './Routes/npc';

connectDB(); // Conexión con la base de datos

const app = express();
const port = 8085;

app.use(express.json());
app.use(cors()); // Usar CORS como middleware global

// Definición de rutas
app.use('/npc', routerNpc);

app.listen(port, () => {
  console.log(`Servidor activo en el puerto ${port}`);
});
