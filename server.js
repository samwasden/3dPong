const express = require('express')
const path = require('path')

const app = express()

app.use("/css", express.static(path.join(__dirname, '/style.css')))

app.use("/reset", express.static(path.join(__dirname, '/reset.css')))

app.use("/3dcss", express.static(path.join(__dirname, '/pong3D/style.css')))

app.use("/2dcss", express.static(path.join(__dirname, '/pong2D/style.css')))

app.get('/regFont',function(req,res) {
    res.sendFile(path.join(__dirname, '/fonts/FFFFORWA.TTF'));
});

app.get('/jsonFont',function(req,res) {
    res.sendFile(path.join(__dirname, '/fonts/blockfont.json'));
});

app.get('/',function(req,res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/pong3d',function(req,res) {
    res.sendFile(path.join(__dirname, '/pong3D/index.html'));
});

app.get('/pong2d',function(req,res) {
    res.sendFile(path.join(__dirname, '/pong2D/index.html'));
});
  
app.get('/3dscript', (req, res) => {
    res.sendFile(path.join(__dirname, '/pong3D/main.js'))
  });

  app.get('/2dscript', (req, res) => {
    res.sendFile(path.join(__dirname, '/pong2D/main.js'))
  });

app.get('/three', (req, res) => {
    res.sendFile(path.join(__dirname, '/pong3D/three.js'))
  });

const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })