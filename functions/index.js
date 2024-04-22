const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const app = express();

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://plethysmographia-default-rtdb.europe-west1.firebasedatabase.app",
});

// JSON middleware beállítása
app.use(bodyParser.json());

// Firestore inicializálása
const db = admin.firestore();

// POST kérés kezelése
app.post("/api/pulse", async (req, res) => {
  try {
    const timestamp = new Date(req.body.timestamp);

    const docRef = await db.collection("Measurements").add({
      timestamp: timestamp,
      measurement: req.body.measurement,
      userId: req.body.userId,
    });

    console.log("Document ID:", docRef.id);
    return res.status(200).send();
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

// Export the api to Firebase Cloud Functions
exports.app = functions.https.onRequest(app);
