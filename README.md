# 🧠 FocusManager - Gestionnaire de Productivité

Une application web moderne de gestion de tâches avec timer Pomodoro pour optimiser votre productivité quotidienne.

## ✨ Fonctionnalités

### 📝 Gestion des Tâches
- ➕ Ajout de tâches avec nom, date d'échéance et niveau de priorité
- ✅ Marquage des tâches comme terminées/en cours
- 🗑️ Suppression individuelle ou en masse des tâches
- 🔍 Filtrage par statut (toutes, en cours, terminées, en retard)
- 📅 Rappels automatiques pour les tâches du jour
- 🎯 Tri intelligent par priorité et date

### 🍅 Timer Pomodoro
- ⏱️ Timer personnalisable (15, 25, 30, 45 minutes)
- ▶️ Contrôles complets : démarrer, pause, arrêter
- 🔔 Notifications de fin de session
- 📊 Suivi du temps de travail quotidien
- 🎉 Compteur de sessions complétées

### 📊 Statistiques
- ⏰ Temps de travail quotidien
- ✅ Nombre de tâches terminées
- 🍅 Sessions Pomodoro complétées
- 📈 Pourcentage de productivité

### 🎨 Interface Moderne
- 📱 Design responsive (mobile, tablette, desktop)
- 🌙 Support du mode sombre automatique
- ⚡ Animations fluides et transitions
- ♿ Accessibilité optimisée
- 🎨 Interface épurée et intuitive

## 🚀 Déploiement sur GitHub Pages

### Méthode 1 : Via l'interface GitHub (Recommandée)

1. **Créer un nouveau repository**
   ```
   - Allez sur GitHub.com
   - Cliquez sur "New repository"
   - Nommez-le "focusmanager" (ou le nom de votre choix)
   - Cochez "Add a README file"
   - Cliquez "Create repository"
   ```

2. **Uploader les fichiers**
   ```
   - Cliquez sur "uploading an existing file"
   - Glissez-déposez les fichiers : index.html, style.css, script.js
   - Ajoutez un message de commit : "Initial commit - FocusManager app"
   - Cliquez "Commit changes"
   ```

3. **Activer GitHub Pages**
   ```
   - Allez dans Settings > Pages
   - Source : "Deploy from a branch"
   - Branch : "main" ou "master"
   - Folder : "/ (root)"
   - Cliquez "Save"
   ```

4. **Accéder à votre application**
   ```
   Votre app sera disponible à :
   https://[votre-nom-utilisateur].github.io/[nom-du-repo]
   ```

### Méthode 2 : Via Git en ligne de commande

```bash
# 1. Cloner votre repository
git clone https://github.com/[votre-nom]/[nom-du-repo].git
cd [nom-du-repo]

# 2. Copier les fichiers de l'application
cp /chemin/vers/index.html .
cp /chemin/vers/style.css .
cp /chemin/vers/script.js .

# 3. Ajouter et commiter
git add .
git commit -m "Add FocusManager application"
git push origin main

# 4. Activer GitHub Pages dans les paramètres du repository
```

## 📁 Structure des Fichiers

```
focusmanager/
├── index.html          # Page principale de l'application
├── style.css           # Styles CSS modernes et responsive
├── script.js           # Logique JavaScript complète
└── README.md           # Documentation (ce fichier)
```

## 🛠️ Technologies Utilisées

- **HTML5** : Structure sémantique et accessible
- **CSS3** : Design moderne avec variables CSS, Grid, Flexbox
- **JavaScript ES6+** : Logique applicative avec modules et classes
- **LocalStorage** : Persistance des données côté client
- **Web Notifications API** : Notifications natives du navigateur
- **Google Fonts** : Typographie moderne (Inter)

## 🎯 Utilisation

### Ajouter une Tâche
1. Saisissez le nom de la tâche
2. Sélectionnez la date d'échéance
3. Choisissez le niveau de priorité
4. Cliquez "Ajouter la tâche" ou utilisez `Ctrl+Entrée`

### Utiliser le Timer Pomodoro
1. Sélectionnez la durée souhaitée
2. Cliquez "Démarrer" ou appuyez sur `Espace`
3. Travaillez jusqu'à la fin du timer
4. Prenez une pause quand l'alerte se déclenche

### Raccourcis Clavier
- `Ctrl/Cmd + Entrée` : Ajouter une tâche
- `Espace` : Démarrer/Mettre en pause le timer

## 🔧 Personnalisation

### Modifier les Couleurs
Éditez les variables CSS dans `style.css` :
```css
:root {
    --primary-color: #2563eb;    /* Couleur principale */
    --success-color: #16a34a;    /* Couleur de succès */
    --danger-color: #dc2626;     /* Couleur de danger */
    /* ... autres variables ... */
}
```

### Ajouter des Durées Pomodoro
Modifiez le select dans `index.html` :
```html
<select id="pomodoroTime">
    <option value="15">15 min</option>
    <option value="25" selected>25 min</option>
    <option value="30">30 min</option>
    <option value="60">60 min</option> <!-- Nouvelle option -->
</select>
```

## 🐛 Résolution de Problèmes

### Les données ne se sauvegardent pas
- Vérifiez que votre navigateur supporte localStorage
- Assurez-vous que les cookies/stockage local ne sont pas bloqués
- Testez en navigation privée pour éliminer les extensions

### Les notifications ne fonctionnent pas
- Vérifiez les permissions de notification dans votre navigateur
- Les notifications nécessitent HTTPS (GitHub Pages utilise HTTPS)
- Certains navigateurs bloquent les notifications sur localhost

### L'application ne s'affiche pas correctement
- Vérifiez que tous les fichiers sont dans le même dossier
- Assurez-vous que les noms de fichiers correspondent exactement
- Testez avec différents navigateurs

## 📱 Compatibilité

### Navigateurs Supportés
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

### Appareils
- 📱 Smartphones (iOS/Android)
- 📱 Tablettes
- 💻 Ordinateurs de bureau
- 💻 Ordinateurs portables

## 🔒 Confidentialité

- ✅ Toutes les données sont stockées localement dans votre navigateur
- ✅ Aucune donnée n'est envoyée vers des serveurs externes
- ✅ Aucun tracking ou analytics
- ✅ Fonctionne entièrement hors ligne après le premier chargement

## 🤝 Contribution

Pour contribuer à ce projet :

1. Forkez le repository
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Vous êtes libre de l'utiliser, le modifier et le distribuer.

## 🆘 Support

Si vous rencontrez des problèmes :

1. Vérifiez cette documentation
2. Consultez les issues GitHub existantes
3. Créez une nouvelle issue avec :
   - Description du problème
   - Étapes pour reproduire
   - Navigateur et version
   - Captures d'écran si pertinentes

## 🎉 Remerciements

- Police Inter par Google Fonts
- Inspiration design moderne
- Communauté open source

---

**Développé avec ❤️ pour améliorer votre productivité**

*Dernière mise à jour : Décembre 2024*
