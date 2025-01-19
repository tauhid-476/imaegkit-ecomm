import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URL is not set in the env');
}

let cached = global.mongoose

//no connection
if(!cached){
    cached = global.mongoose = { conn: null, promise: null }
}

export async function connectToDatabase(){
    //already connected
    if(cached.conn){
        return cached.conn
    }

    //no promise in action , make one
    if(!cached.promise){
        //optional options based on plan of mongodb
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10,
          };
      
        cached.promise = mongoose
            .connect(MONGODB_URI, opts)
            .then(() => mongoose.connection);   
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}