import { NextResponse } from "next/server" 
import Movie from "@/lib/models/movie";
import connect from "@/lib/database";
import { Types } from "mongoose";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId; // importamos el ObjectId de mongoose para poder usarlo en la busqueda de movies



export const GET = async () =>{
    try{
        await connect(); // nos conectamos a la base de datos
        const movies = await Movie.find(); // buscamos todas las movies
        return new NextResponse(JSON.stringify(movies), {status: 200}); // devolvemos las movies en un string Json
    }catch (err:any){
        return new NextResponse("Error" + err.message, {status: 500}); // si hay un error, lo devolvemos
    }
}

export const POST =async (request:Request) => {
    try{
        const body = await request.json(); // obtenemos el body de la peticion/ .json() nos da el body en formato json
        await connect();
        const newMovie = new Movie(body); // creamos una nueva movie
        await newMovie.save(); // guardamos la nueva movie en la base de datos

        return new NextResponse(JSON.stringify({message:"movie created", movie: newMovie}), {status: 201} );
    }catch (err:any){
        return new NextResponse("Error" + err.message, {status: 500}); // si hay un error, lo devolvemos
    }
}
 
export const PATCH = async (request:Request) => { // hacemos el patch para que solo se pueda modificar el title
    try{
        const { searchParams } = new URL(request.url) // obtenemos todos los parametros de la url
        const id = searchParams.get("id"); // obtenemos el id enviado por parametro
        const body =  await request.json(); // obtenemos el body de la peticion.
        const { newTitle } = body; // destructuramos el body para obtener el nuevo titulo
        await connect(); // nos conectamos a la base de datos

        if (!id || !newTitle){
            return new NextResponse(JSON.stringify({message:"ID or title not provided"}), {status: 400}); // si no nos envian el id o el nuevo titulo, devolvemos un error
        }

        if (!Types.ObjectId.isValid(id)){
            return new NextResponse(JSON.stringify({message:"invalid ID"}), {status:400}); // si el id no es valido, devolvemos un error
        }

        const updatedMovie = await Movie.findOneAndUpdate(
            {_id: new ObjectId(id)}, // buscamos la movie por su id
            {title: newTitle}, // actualizamos el titulo
            {new: true} // devolvemos la movie actualizada
        )
         
        if (!updatedMovie){
            return new NextResponse(JSON.stringify({message:"Movie not found in database"}), {status:404}); // si no encontramos el usuario, devolvemos un error 
        }

        return new NextResponse(JSON.stringify({message:"Movie updated", movie: updatedMovie}), {status:200}); // si no entra en ningun error, devolvemos la movie actualizado  

    }catch (err:any){
        return new NextResponse("Error:" + err.message, {status: 500}); // si hay un error, lo devolvemos   
    }
}

export const DELETE = async (request:Request) => { // nos envia el id por parametro
    try{
        const { searchParams } = new URL(request.url) // obtenemos todos los parametros de la url
        const id = searchParams.get("id"); // obtenemos el id 
        await connect(); // nos conectamos a la base de datos
        
        if (!id){
            return new NextResponse(JSON.stringify({message:"Id not provided"}), {status:400}); // si no nos envian el id, devolvemos un error  
        }
        
        if (!Types.ObjectId.isValid(id)){
            return new NextResponse(JSON.stringify({message:"invalid ID"}), {status:400}) // si el id no es valido, devolvemos un error
        }
        
        const deletedMovie = await Movie.findByIdAndDelete(new Types.ObjectId(id)); // buscamos la movie por ID y la eliminamos
        
        if (!deletedMovie){
            return new NextResponse(JSON.stringify({message:"ID no found in database"}), {status:404}) // si no encontramos en id en la base de datos, retornamos error
        }

        return new NextResponse(JSON.stringify({message:"movie deleted", movie:deletedMovie}), {status:200}) // si no entra en ningun error devolvemos la movie eliminada

    }catch (err:any){
        return new NextResponse("Error:" + err.message, {status:500}) 
    }

}