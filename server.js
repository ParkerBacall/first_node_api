const {Client} = require('pg')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(express.json())
// app.use(bodyParser.urlencoded({extended: false}))
// app.use(bodyParser.json())

const client = new Client( {
    user: '',
    password: '',
    host: 'localhost',
    port: 5432,
    database: 'todos_db'
})

app.get("/", (request, response)=> response.sendFile(`${__dirname}/index.html`))
app.get("/todos", async (request, response) => {
    const rows = await readTodos()
    response.setHeader('Access-Control-Allow-Origin', '*')
    // response.setHeader('Access-Control-Allow-Headers', '*')
    response.setHeader('content-type', 'application/json')
    response.send(JSON.stringify(rows))
})

// app.get("/todos", async (request, response) => {
//     console.log(request)
//         const requestJSON = request.body
//         todo = await getTodo(requestJSON.id)
//         response.setHeader('content-type', 'application/json')
//         response.send(JSON.stringify(todo))
// })


app.post("/todos", async (request, response) => {
    let result = {}
    try {
    const requestJSON = request.body
    await createTodo(requestJSON.todo)
    result.success = true
    }
    catch(e){
        result.success = false
    }
    finally{
        response.setHeader('content-type', 'application/json')
        response.send(JSON.stringify(result))
    }
})

app.delete("/todos", async (request, response) => {
    let result = {}
    try {
    const requestJSON = request.body
    await deleteTodo(requestJSON.id)
    result.success = true
    }
    catch(e){
        result.success = false
    }
    finally{
        response.setHeader('content-type', 'application/json')
        response.send(JSON.stringify(result))
    }
})


app.listen(8080, ()=> {
    console.log('Web server listenign on port 8080')
})
start() 


async function start() {
    await connect()
    /*
    const todos = await readTodos()
    console.log(todos)

    const successCreate = await createTodo("Go to trader joes")
    console.log(`creating was ${successCreate}`)

    const successDelete = await deleteTodo(1)
    console.log(`deleting was ${successDelete}`)
*/    
}

async function connect(){
    try {
        await client.connect()
    }
    catch(e){
        console.error(`failed to connect ${e}`)
    }
}

async function readTodos() {
    try {
        const results = await client.query("select id, text from todo")
        return results.rows
    }
    catch(e){
        return []
    }

}

async function createTodo(todoText){
    try{
        await client.query("insert into todo (text) values ($1)", [todoText])
        return true
    }
    catch(e){
        return false
    }
}

async function deleteTodo(id){
    try{
        await client.query("delete from todo where id = $1", [id])
        return true
    }
    catch(e){
        return false
    }
}

async function getTodo(id){
    try{
        const result = await client.query("select id, text from todo where id = $1", [id])
       return result.rows
    }
    catch(e){
        return false
    }
}
