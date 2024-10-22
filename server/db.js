// Importamos el modulo de mongoose
import mongoose from 'mongoose';

// Definimos una funcion asincrona para conectarnos a la base de datos
const connectDB = async () => {
    try{
        //Intentamos conectarnos a la base de datos usando mongoose.connect
        await mongoose.connect('mongodb://localhost:27017/wikiud'),{
            
            useneNewUrlParser: true, // Utiliza el nuevo analizador de URL de MongoDB
            useUnifiedTopology: true, // Utiliza el nuevo motor de administración de conexiones
            
        }
        // Si la conexión es exitosa, mostramos un mensaje en la consola
        console.log('Connected to MongoDB');
    }catch(err){
       // Si ocurre un error, lo mostramos en la consola y terminamos el proceso
       console.error(err.message);
       process.exit(1);  
    }
};

// Exportamos la funcion connectDB para poder usarla en otros archivos
export default connectDB;