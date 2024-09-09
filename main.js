const express = require('express')

const app = express();

// Simulate a CPU-intensive task
app.get('/cpu-intensive', (req, res) => {
    let result = 0;
    for(var i =0; i < 1e6; i++) {
       result += i * Math.random() * 100
    }
    res.send(`Result of the CPU-intensive task: ${result}`);
})
// Simulate an I/O operation
app.get('/simulate-io', (req, res) => {
    setTimeout(() => {
        res.send("Simulated I/O operation completed");
    }, 500); // Simulate a 500ms I/O operation
   });

app.listen(2003, ()=>{
    console.log(`app listening on ${2003}`);
})