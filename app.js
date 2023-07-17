'use strict';
import cors from "cors" // Si se quiere interpretar como el nuevo estándar se debe poner import, pero también debes agregar que se está usando el tipo módulo y no commonJS
import path from "path"
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url))
import express from "express"
const app = express();
import http from "http"
const server = http.createServer(app);
// CORS
app.use(cors());
// Configurando las opciones de cors
const whiteList = ['http://localhost:5000', 'http://192.168.1.70:5000']; // Aquí se agregarían todas las rutas que tienen permitido conseguir datos desde los scripts
const corsOptions = {
    origin: function(origin, callback){
        console.log(origin, whiteList.indexOf(origin) !== -1, !origin);
        
        if (whiteList.indexOf(origin) !== -1 || !origin){ // Para no bloquear las peticiones entre el mismo servidor se le agrega el !origin
            callback(null, true);
        } else {
            console.log(new Error());
            callback('Not allow by CORS');
        };
    }
}


app.use(express.static(path.resolve(__dirname, './public')));
app.use("/duck", express.static(path.resolve(__dirname, '../SVG')));

app.get('/', (req, res)=>{
    console.log(req.method, req.url, req.ip, `Status: 200`);
    res.status(200)
    .sendFile(path.resolve(__dirname, './public/index.html'));
    
});

app.get('/api', (req, res)=>{
    console.log(req.method, req.url, req.ip, `Status: 200`);
    res.status(200)
    .sendFile(path.resolve(__dirname, './public/index.html'));
    
});

app.get('/productos', cors(corsOptions), (req, res)=>{ // Cuando soliciten un cors si no están en las rutas permitidas para proporcionar este recurso, no va dejar.
    console.log(req.method, req.url, req.ip, `Status: 200`);
    res.status(200).type('application/json').send({
        "name":"Iphone 12"
    });
    
});

app.get('/favicon.ico', (req, res)=>{
    console.log(req.method, req.url, req.ip, `Status: 200`);
    res.status(200)
    .sendFile(path.resolve(__dirname, './public/Imagenes/favicon.png'));
});

app.all('*', (req, res)=>{
    console.log(req.method, req.url, req.ip, `Status: 400`);
    res.status(400)
    .send('Not found');
});

server.listen(5000, ()=>{
    console.log('Servidor activo en el puerto 5000')
});
