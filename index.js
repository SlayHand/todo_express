const express = require('express')
const path = require('path')
const fs = require('node:fs')

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended:true}))

const readFile = (filename) =>{
    return new Promise((resolve, reject) => { 
        fs.readFile(filename, "utf-8", (error, data) =>{
            if (error){
                console.error(error)
                return
            } 
            const tasks = JSON.parse(data)
            resolve(tasks)
        })
    })
} 
const writeFile = (filename, data) =>{
    return new Promise((resolve, reject) => { 
        fs.writeFile(filename, "utf-8", error, data =>{
            if (error){
                console.error(error);
                return;
            } 
            resolve(true)
        })
    })
} 
app.get('/', (req, res) => {
    readFile('./tasks.json')
        .then(tasks =>{
            console.log(tasks)
            res.render('index', {tasks: tasks})
        })
    })

app.post('/', (req, res) =>{
    readFile('./tasks.json')
    .then(tasks =>{
        let index
        if(tasks.length === 0)
        {
            index = 0
        } else {
            index = tasks[tasks.length-1].id +1; 
        }  
        const newTask = {
            "id" : index,
            "task" :req.body.task
        } 
        tasks.push(newTask)
        data = JSON.stringify(tasks, null, 2)
        console.log(data)
            writeFile('tasks.json', data)
            res.redirect('/')
        })
    })
app.get('/delete-task/:taskId', (req,res) =>{
    let deletedTaskId = parseInt (req.params.taskId)
    readFile('./tasks.json')
    .then(tasks => {
        tasks.forEach((task, index) => {
            if(task.id === deletedTaskId){
                tasks.splice(index, 1)
            } 
        })
        data = JSON.stringify(tasks, null, 2)
        fs.writeFile('tasks.json', data => {
            if (err){
                console.error(err);
                return;
            }
            res.redirect('/') 
        })
    })
})

app.listen(3001, () => {
    console.log('Server started at http://localhost:3001')
})