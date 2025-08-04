/**
 * Configuration Firebase pour FocusManager
 * 
 * INSTRUCTIONS POUR CONFIGURER FIREBASE :
 * 
 * 1. Allez sur https://console.firebase.google.com/
 * 2. Cliquez sur "Créer un projet" ou "Ajouter un projet"
 * 3. Nommez votre projet (ex: "focusmanager-[votre-nom]")
 * 4. Activez Google Analytics (optionnel)
 * 5. Une fois le projet créé, cliquez sur l'icône Web "</>"
 * 6. Nommez votre app (ex: "FocusManager Web")
 * 7. Copiez la configuration qui apparaît et remplacez les valeurs ci-dessous
 * 
 * 8. Dans la console Firebase :
 *    - Allez dans "Authentication" > "Get started"
 *    - Onglet "Sign-in method" > Activez "Email/Password"
 *    - Allez dans "Firestore Database" > "Create database"
 *    - Choisissez "Start in test mode" puis "Next"
 *    - Sélectionnez une région proche de vous
 * 
 * 9. Remplacez les valeurs ci-dessous par celles de votre projet Firebase
 */

// Configuration Firebase - Vos vraies valeurs
const firebaseConfig = {
    apiKey: "AIzaSyBN-u55gS3e5Slbp2UFu3_dTpnoeLGUW34",
    authDomain: "focusmanager-fb6b7.firebaseapp.com",
    projectId: "focusmanager-fb6b7",
    storageBucket: "focusmanager-fb6b7.firebasestorage.app",
    messagingSenderId: "719612059513",
    appId: "1:719612059513:web:cb0669f56d3999662019a8",
    measurementId: "G-T2ZBPCFBZ9"
};

// Exemple de configuration réelle (à adapter) :
/*
const firebaseConfig = {
    apiKey: "AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz",
    authDomain: "focusmanager-demo.firebaseapp.com",
    projectId: "focusmanager-demo",
    storageBucket: "focusmanager-demo.appspot.com",
    messagingSenderId: "987654321098",
    appId: "1:987654321098:web:abcdef1234567890abcdef"
};
*/

// Export de la configuration
window.firebaseConfig = firebaseConfig;
