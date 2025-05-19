// CONEXION A LA BASE DE DATOS
import mongoose from "mongoose"; // importamos mongoose

const MONGODB_URI = process.env.MONGODB_URI; // obtenemos la variable de entorno que contiene la uri de la conexion a la base de datos

const connect = async () => {
    const connectionState = mongoose.connection.readyState; // recuperamos el estado de la conexion a la base de datos
    
    // Si ya estamos conectados
    if (connectionState === 1) {
        console.log("Already connected");
        return;
    }

    // Si nos estamos conectando
    if (connectionState === 2){
        console.log("Connecting ...");
        return;
    }

    // Si no entramos en ninguno de los dos estados anteriores, significa que no estamos conectados
    try{
        mongoose.connect(MONGODB_URI!, {dbName:"API-movies", bufferCommands:true}) // Nos conectamos a la base de datos.
        console.log("Connected");
    } catch (err:any){
        console.log("Error:", err); // Si hubo un error, lo mostramos por consola
        throw new Error("Error:", err)
    }
}

export default connect; // Exportamos la funcion para poder conectarnos a la base de datos desde cualquier parte de la aplicacion