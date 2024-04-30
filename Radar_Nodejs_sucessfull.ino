#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h> // Nouvelle bibliothèque pour les requêtes HTTP POST
#include <Servo.h>
char ssid[] = "INPT-TEST";         // SSID du réseau Wi-Fi
char password[] = "iinnpptt"; // Mot de passe du réseau Wi-Fi
// Defines Tirg and Echo pins of the Ultrasonic Sensor
const int trigPin = 4;
const int echoPin = 2;
int leftAngle=180;
int rightAngle=0;
// Variables for the duration and the distance
int i=rightAngle;
float distance;
float mesurerDistance() {
  // Déclencher une impulsion ultrasonique
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // Mesurer la durée de l'impulsion ultrasonique
  long duration = pulseIn(echoPin, HIGH);

  // Convertir la durée en distance en centimètres
  float distance_cm = duration * 0.034 / 2;

  return distance_cm; // Retourner la distance mesurée
}


IPAddress serverIP(10,5,1,246); // Adresse IP du serveur Node.js
const uint16_t serverPort = 80; // Port sur lequel le serveur Node.js écoute

WiFiClient client;

Servo myServo; // Creates a servo object for controlling the servo motor
void setup() {
 pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin, INPUT); // Sets the echoPin as an Input
  Serial.begin(115200);
  myServo.attach(5);
  
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);
  Serial.print("Connexion au WiFi : ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("");
  Serial.println("WiFi connecté");
  Serial.println("Adresse IP : ");
  Serial.println(WiFi.localIP());
}

void makeHTTPRequest() {
  if (!client.connect(serverIP, serverPort)) {
    Serial.println("Échec de la connexion");
    return;
  }

  // Génération d'une température aléatoire entre 0 et 100
 
  // Construction du corps de la requête POST avec la température
  String postData = "angg=" + String(i) + "&diss=" + String(distance);


  // Envoi de la requête POST
  client.println("POST /data HTTP/1.1");
  client.print("Host: ");
  client.println(serverIP.toString());
  client.println("Connection: close");
  client.println("Content-Type: application/x-www-form-urlencoded");
  client.print("Content-Length: ");
  client.println(postData.length());
  client.println();
  client.println(postData);

  // Attendre un court instant
  delay(100);

  // Lecture de la réponse du serveur
  while (client.available()) {
    char c = client.read();
    Serial.print(c);
  }

  // Fermeture de la connexion
  client.stop();
}

void loop() {
  for( i=rightAngle;i<=leftAngle;i++){
         makeHTTPRequest();
      
     
  myServo.write(i);
  
  delay(10);
  distance = mesurerDistance();
    }
   
  for( i=leftAngle;i>rightAngle;i--){
   
       makeHTTPRequest();
        myServo.write(i);
        delay(10);
        distance = mesurerDistance();
  
  }
 
 
}