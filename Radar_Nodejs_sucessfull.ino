#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h> 
#include <Servo.h>
char ssid[] = "INPT-TEST";         // SSID du réseau Wi-Fi
char password[] = "iinnpptt"; // Mot de passe du réseau Wi-Fi

const int trigPin = 4;
const int echoPin = 2;
int leftAngle=180;
int rightAngle=0;

int i=rightAngle;
float distance;

float mesurerDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long duration = pulseIn(echoPin, HIGH);
  float distance_cm = duration * 0.034 / 2;
  return distance_cm; // Retourner la distance mesurée
}


IPAddress serverIP(10,5,1,246); // Adresse IP du serveur Node.js
const uint16_t serverPort = 80; // Port sur lequel le serveur Node.js écoute

WiFiClient client;

Servo myServo;

void setup() {
 pinMode(trigPin, OUTPUT); 
  pinMode(echoPin, INPUT); 
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


  String postData = "angg=" + String(i) + "&diss=" + String(distance);
  client.println("POST /data HTTP/1.1");
  client.print("Host: ");
  client.println(serverIP.toString());
  client.println("Connection: close");
  client.println("Content-Type: application/x-www-form-urlencoded");
  client.print("Content-Length: ");
  client.println(postData.length());
  client.println();
  client.println(postData);
  delay(100);
  while (client.available()) {
    char c = client.read();
    Serial.print(c);
  }
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
