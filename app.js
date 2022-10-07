import  express, { response } from 'express';
import bodyParser from'body-parser';
import fs from 'fs';
import pg from 'pg';
import cors from 'cors';
import { request } from 'http';




const {Pool} = pg;

const pool = new Pool({
    'user' : 'postgres',
    'host' : 'localhost',
    'database' : 'todo_app',
    'password' : '1234',
    'port': 5432,
    


});

const app = express();
app.use(bodyParser.json());
app.use(cors())

app.post("/",async(request,response)=>{
    const {todoText , todoStatus} = request.body;
    console.log(request.body);
    const client = await pool.connect();
    const result = await client.query({
        text : `INSERT INTO todo_app 
        (text, status)
        VALUES($1, $2)`,
        values : [
            todoText,
            todoStatus
        ]
    })
    const result1 = await client.query({
        text: `SELECT * FROM todo_app
        ORDER BY id DESC;`
    })
    response.json(result1);
})

app.put("/:id", async(request,response)=>{
    const id = request.params.id;
    const {todoText ,todoStatus} = request.body;

    const client = await pool.connect();
    const result = await client.query({
        text : `UPDATE todo_app 
        SET text = $1, status = $2
        WHERE ID = $3;`,
        values : [
            todoText,
            todoStatus,
            id
        ]
    })
    const result1 = await client.query({
        text: `SELECT * FROM todo_app
        ORDER BY id DESC;`
    })
    response.json(result1);
})

app.get("/", async(request,response)=>{

    const client = await pool.connect();
    const result = await client.query({
        text: `SELECT * FROM todo_app
        ORDER BY id DESC;`
    })
    return response.send(result.rows);
    
})

app.delete("/:id", async(request,response)=>{
    const id = request.params.id 
    const client = await pool.connect();
    const result = await client.query({
        text : `DELETE FROM todo_app WHERE id = ${id}`
    })
    const result1 = await client.query({
        text: `SELECT * FROM todo_app
        ORDER BY id DESC;`
    })
    response.json(result1);
});

app.listen(4001,()=>{
    console.log("started server")
}
)