/**
 * Service Worker pour Firebase Cloud Messaging
 * Gère les notifications push en arrière-plan
 */

// Import Firebase scripts pour le service worker
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Configuration Firebase (même que dans firebase-config.js)
const firebaseConfig = {
    apiKey: "AIzaSyBN-u55gS3e5Slbp2UFu3_dTpnoeLGUW34",
    authDomain: "focusmanager-fb6b7.firebaseapp.com",
    projectId: "focusmanager-fb6b7",
    storageBucket: "focusmanager-fb6b7.firebasestorage.app",
    messagingSenderId: "719612059513",
    appId: "1:719612059513:web:cb0669f56d3999662019a8",
    measurementId: "G-T2ZBPCFBZ9"
};

// Initialiser Firebase dans le service worker
firebase.initializeApp(firebaseConfig);

// Récupérer l'instance de messaging
const messaging = firebase.messaging();

// Gérer les messages en arrière-plan
messaging.onBackgroundMessage((payload) => {
    console.log('Message reçu en arrière-plan:', payload);
    
    const notificationTitle = payload.notification.title || 'FocusManager';
    const notificationOptions = {
        body: payload.notification.body || 'Nouvelle notification',
        icon: '/icon-192x192.png', // Vous pouvez ajouter une icône
        badge: '/badge-72x72.png', // Badge pour Android
        tag: 'focusmanager-notification',
        requireInteraction: true, // La notification reste jusqu'à interaction
        actions: [
            {
                action: 'open',
                title: 'Ouvrir l\'app',
                icon: '/icon-open.png'
            },
            {
                action: 'dismiss',
                title: 'Ignorer',
                icon: '/icon-dismiss.png'
            }
        ],
        data: {
            url: '/', // URL à ouvrir quand on clique
            ...payload.data
        }
    };

    // Afficher la notification
    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Gérer les clics sur les notifications
self.addEventListener('notificationclick', (event) => {
    console.log('Clic sur notification:', event);
    
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        // Ouvrir ou focus sur l'application
        event.waitUntil(
            clients.matchAll({ type: 'window' }).then((clientList) => {
                // Si l'app est déjà ouverte, la mettre au premier plan
                for (const client of clientList) {
                    if (client.url === self.location.origin + '/' && 'focus' in client) {
                        return client.focus();
                    }
                }
                // Sinon, ouvrir une nouvelle fenêtre
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            })
        );
    }
    // L'action 'dismiss' ferme juste la notification (déjà fait avec close())
});

// Gérer l'installation du service worker
self.addEventListener('install', (event) => {
    console.log('Service Worker installé');
    self.skipWaiting();
});

// Gérer l'activation du service worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker activé');
    event.waitUntil(self.clients.claim());
});
