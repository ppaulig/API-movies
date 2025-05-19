// DINAMIC ROUTE
// Manejamos las peticiones GET a la ruta /api/movies/:id
import { NextResponse } from "next/server";
import Movie from "@/lib/models/movie";
import connect from "@/lib/database";
import { Types } from "mongoose";

export const GET = async (request: Request, context: { params: any }) => {
    const movieId = context.params.id; // obtenemos el id de la pelicula desde la ruta /movies/:id
  try {

    if (!movieId || !Types.ObjectId.isValid(movieId)) { // si no nos envian el id o es un formato invalido, devolvemos un error
      return new NextResponse(JSON.stringify({ message: "Invalid or missing id" }),{ status: 400 }
      );
    }

    await connect(); // nos conectamos a la base de datos

    const movie = await Movie.findById(movieId); // buscamos la pelicula por su id

    if (!movie) {
      return new NextResponse(JSON.stringify({ message: "Movie not found" }), { status: 404 });
    }

    return new NextResponse(JSON.stringify(movie), { status: 200 });

  } catch (err: any) {
    return new NextResponse("Error: " + err.message, { status: 500 });
  }
};

