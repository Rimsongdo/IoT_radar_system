const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');



const app = express();
const port =80;
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

// Créer le serveur HTTP
const server = http.createServer(app);

// Initialiser socket.io en passant le serveur HTTP
const io = socketIo(server);

// Route POST pour recevoir les données de température
app.post('/data', (req, res) => {
    const ango = req.body.angg;
    const disto = req.body.diss;
    io.emit('data', { angg: ango, diss: disto });
    res.sendStatus(200);
  });


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'radar.html'));
  
});
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
  });
  
  // Route GET pour la page "Contact" (contact.html)
  app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
  });
// Route POST pour recevoir l'état du bouton
app.post('/buttonState', (req, res) => {
  const buttonState = req.body.state;
  // Faites quelque chose avec l'état reçu, par exemple, transmettez-le à votre matériel ESP8266
  console.log('Nouvel état du bouton reçu:', buttonState);
  // Si vous avez besoin d'émettre cet état à tous les clients connectés via WebSocket
  // io.emit('buttonState', { state: buttonState });
  res.sendStatus(200);
});

// Démarrage du serveur
server.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});

