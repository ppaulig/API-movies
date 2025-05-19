import { Schema, model, models } from "mongoose";

// definimos la estructura y reglas para el modelo de usuario
const movieSchema = new Schema(
    {
        title:{type:"string", required: true, unique: true},
        year:{type: "number", required:true},
        director:{type: "string", required:true},
        duration:{type: "number", required:true},
        poster:{type: "string", required:true},
        rate:{type: "number", required:true},
        genre:{type: "string", required:true, enum: { values: ['Action', 'Drama', 'Crime', 'Adventure', 'Sci-Fi', 'Romance', 'Animation', 'Biography', 'Fantasy']}}
    }
);

const Movie = models.Movie || model("Movie", movieSchema); // si el modelo ya existe, lo usamos, si no, lo creamos

export default Movie; // exportamos el modelo para poder usarlo en cualquier parte de la aplicacion