import { Connection } from "mongoose";


declare global {
    var mongoose:{
        conn: Connection | null; // already have a connection
        promise: Promise<Connection> | null; 
        //promise in action when someone attempts to connect
    }
}

export {}
