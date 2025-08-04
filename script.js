/**
 * FocusManager - Application de gestion de tâches avec timer Pomodoro
 * Version améliorée avec gestion d'erreurs et fonctionnalités avancées
 */

// Configuration et variables globales
const CONFIG = {
    DEFAULT_POMODORO_TIME: 25,
    STORAGE_KEYS: {
        TASKS: 'focusmanager_tasks',
        WORKED_TODAY: 'focusmanager_worked_today',
        LAST_DATE: 'focusmanager_last_date',
        TOTAL_SESSIONS: 'focusmanager_total_sessions',
        COMPLETED_TASKS: 'focusmanager_completed_tasks'
    },
    PRIORITIES: {
        low: { label: '🟢 Faible', class: 'low-priority' },
        medium: { label: '🟡 Moyenne', class: 'medium-priority' },
        high: { label: '🔴 Élevée', class: 'high-priority' }
    }
};

// État de l'application
let appState = {
    tasks: [],
    timer: null,
    pomodoroTime: CONFIG.DEFAULT_POMODORO_TIME * 60,
    isRunning: false,
    isPaused: false,
    workedToday: 0,
    lastDate: '',
    totalSessions: 0,
    completedTasks: 0,
    currentFilter: 'all'
};

// Éléments DOM
const elements = {
    taskForm: null,
    taskName: null,
    taskDate: null,
    taskPriority: null,
    taskList: null,
    message: null,
    timer: null,
    startBtn: null,
    pauseBtn: null,
    stopBtn: null,
    pomodoroTime: null,
    clearAllBtn: null,
    filterTasks: null,
    stats: {
        todayTime: null,
        completedTasks: null,
        totalSessions: null,
        productivity: null
    }
};

/**
 * Utilitaires pour le localStorage avec gestion d'erreurs
 */
const Storage = {
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Erreur lors de la lecture de ${key}:`, error);
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Erreur lors de l'écriture de ${key}:`, error);
            this.showMessage('Erreur de sauvegarde des données', 'error');
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Erreur lors de la suppression de ${key}:`, error);
            return false;
        }
    }
};

/**
 * Gestion des messages utilisateur
 */
function showMessage(text, type = 'success', duration = 3000) {
    if (!elements.message) return;
    
    elements.message.textContent = text;
    elements.message.className = `message ${type}`;
    elements.message.classList.remove('hidden');
    
    setTimeout(() => {
        elements.message.classList.add('hidden');
    }, duration);
}

/**
 * Validation des données
 */
const Validator = {
    isValidTaskName(name) {
        return name && name.trim().length > 0 && name.trim().length <= 100;
    },

    isValidDate(dateString) {
        if (!dateString) return false;
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
    },

    isValidPriority(priority) {
        return Object.keys(CONFIG.PRIORITIES).includes(priority);
    }
};

/**
 * Utilitaires de formatage
 */
const Formatter = {
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },

    formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const diffTime = date - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return "Aujourd'hui";
        if (diffDays === 1) return "Demain";
        if (diffDays > 0) return `Dans ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
        return `En retard de ${Math.abs(diffDays)} jour${Math.abs(diffDays) > 1 ? 's' : ''}`;
    },

    isOverdue(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    }
};

/**
 * Gestion des tâches
 */
const TaskManager = {
    loadTasks() {
        appState.tasks = Storage.get(CONFIG.STORAGE_KEYS.TASKS, []);
        this.displayTasks();
    },

    saveTasks() {
        if (Storage.set(CONFIG.STORAGE_KEYS.TASKS, appState.tasks)) {
            this.displayTasks();
            this.updateStats();
        }
    },

    addTask(name, date, priority = 'medium') {
        // Validation
        if (!Validator.isValidTaskName(name)) {
            showMessage('Le nom de la tâche est requis (max 100 caractères)', 'error');
            return false;
        }

        if (!Validator.isValidDate(date)) {
            showMessage('Veuillez sélectionner une date valide (aujourd\'hui ou plus tard)', 'error');
            return false;
        }

        if (!Validator.isValidPriority(priority)) {
            showMessage('Priorité invalide', 'error');
            return false;
        }

        // Création de la tâche
        const task = {
            id: Date.now(),
            name: name.trim(),
            date: date,
            priority: priority,
            done: false,
            createdAt: new Date().toISOString()
        };

        appState.tasks.push(task);
        this.saveTasks();
        showMessage('Tâche ajoutée avec succès !', 'success');
        return true;
    },

    toggleTask(id) {
        const task = appState.tasks.find(t => t.id === id);
        if (!task) {
            showMessage('Tâche introuvable', 'error');
            return;
        }

        task.done = !task.done;
        if (task.done) {
            task.completedAt = new Date().toISOString();
            appState.completedTasks++;
            Storage.set(CONFIG.STORAGE_KEYS.COMPLETED_TASKS, appState.completedTasks);
            showMessage('Tâche marquée comme terminée !', 'success');
        } else {
            delete task.completedAt;
            showMessage('Tâche marquée comme en cours', 'success');
        }

        this.saveTasks();
    },

    removeTask(id) {
        const taskIndex = appState.tasks.findIndex(t => t.id === id);
        if (taskIndex === -1) {
            showMessage('Tâche introuvable', 'error');
            return;
        }

        appState.tasks.splice(taskIndex, 1);
        this.saveTasks();
        showMessage('Tâche supprimée', 'success');
    },

    clearAllTasks() {
        if (appState.tasks.length === 0) {
            showMessage('Aucune tâche à supprimer', 'error');
            return;
        }

        if (confirm('Êtes-vous sûr de vouloir supprimer toutes les tâches ? Cette action est irréversible.')) {
            appState.tasks = [];
            this.saveTasks();
            showMessage('Toutes les tâches ont été supprimées', 'success');
        }
    },

    filterTasks(filter) {
        appState.currentFilter = filter;
        this.displayTasks();
    },

    getFilteredTasks() {
        switch (appState.currentFilter) {
            case 'pending':
                return appState.tasks.filter(task => !task.done);
            case 'completed':
                return appState.tasks.filter(task => task.done);
            case 'overdue':
                return appState.tasks.filter(task => !task.done && Formatter.isOverdue(task.date));
            default:
                return appState.tasks;
        }
    },

    displayTasks() {
        if (!elements.taskList) return;

        const filteredTasks = this.getFilteredTasks();
        
        if (filteredTasks.length === 0) {
            elements.taskList.innerHTML = `
                <div class="empty-state">
                    <p>🎯 ${this.getEmptyMessage()}</p>
                    <p class="empty-subtitle">
                        ${appState.currentFilter === 'all' ? 'Ajoutez votre première tâche ci-dessus !' : 'Changez le filtre pour voir d\'autres tâches.'}
                    </p>
                </div>
            `;
            return;
        }

        const tasksHTML = filteredTasks
            .sort((a, b) => {
                // Tri par priorité puis par date
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                }
                return new Date(a.date) - new Date(b.date);
            })
            .map(task => this.createTaskHTML(task))
            .join('');

        elements.taskList.innerHTML = tasksHTML;
    },

    getEmptyMessage() {
        switch (appState.currentFilter) {
            case 'pending': return 'Aucune tâche en cours';
            case 'completed': return 'Aucune tâche terminée';
            case 'overdue': return 'Aucune tâche en retard';
            default: return 'Aucune tâche pour le moment';
        }
    },

    createTaskHTML(task) {
        const priorityConfig = CONFIG.PRIORITIES[task.priority];
        const isOverdue = !task.done && Formatter.isOverdue(task.date);
        
        return `
            <div class="task-item ${task.done ? 'completed' : ''} ${priorityConfig.class}" data-id="${task.id}">
                <div class="task-header">
                    <div class="task-info">
                        <div class="task-name">${this.escapeHtml(task.name)}</div>
                        <div class="task-meta">
                            <span class="task-priority">${priorityConfig.label}</span>
                            <span class="task-date ${isOverdue ? 'overdue' : ''}">
                                📅 ${task.date} (${Formatter.formatDate(task.date)})
                            </span>
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="btn btn-small ${task.done ? 'btn-warning' : 'btn-success'}" 
                                onclick="TaskManager.toggleTask(${task.id})">
                            ${task.done ? '↩️ Annuler' : '✅ Terminer'}
                        </button>
                        <button class="btn btn-small btn-danger" 
                                onclick="TaskManager.removeTask(${task.id})">
                            🗑️ Supprimer
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

/**
 * Gestion du timer Pomodoro
 */
const PomodoroTimer = {
    start() {
        if (appState.isRunning) return;

        appState.isRunning = true;
        appState.isPaused = false;
        
        this.updateButtons();
        
        appState.timer = setInterval(() => {
            appState.pomodoroTime--;
            this.updateDisplay();
            
            if (appState.pomodoroTime <= 0) {
                this.complete();
            }
        }, 1000);

        showMessage('Timer Pomodoro démarré !', 'success');
    },

    pause() {
        if (!appState.isRunning) return;

        if (appState.isPaused) {
            // Reprendre
            appState.isPaused = false;
            appState.timer = setInterval(() => {
                appState.pomodoroTime--;
                this.updateDisplay();
                
                if (appState.pomodoroTime <= 0) {
                    this.complete();
                }
            }, 1000);
            showMessage('Timer repris', 'success');
        } else {
            // Mettre en pause
            appState.isPaused = true;
            clearInterval(appState.timer);
            showMessage('Timer mis en pause', 'success');
        }
        
        this.updateButtons();
    },

    stop() {
        if (!appState.isRunning) return;

        clearInterval(appState.timer);
        appState.timer = null;
        appState.isRunning = false;
        appState.isPaused = false;
        
        const selectedTime = parseInt(elements.pomodoroTime.value);
        appState.pomodoroTime = selectedTime * 60;
        
        this.updateDisplay();
        this.updateButtons();
        showMessage('Timer arrêté', 'success');
    },

    complete() {
        clearInterval(appState.timer);
        appState.timer = null;
        appState.isRunning = false;
        appState.isPaused = false;

        const completedMinutes = parseInt(elements.pomodoroTime.value);
        this.trackTime(completedMinutes);
        
        // Reset du timer
        appState.pomodoroTime = completedMinutes * 60;
        this.updateDisplay();
        this.updateButtons();

        // Notification
        this.showCompletionNotification(completedMinutes);
        
        // Incrémenter les sessions
        appState.totalSessions++;
        Storage.set(CONFIG.STORAGE_KEYS.TOTAL_SESSIONS, appState.totalSessions);
        
        this.updateStats();
    },

    showCompletionNotification(minutes) {
        // Notification native si supportée
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('🍅 Pomodoro terminé !', {
                body: `Vous avez travaillé ${minutes} minutes. Prenez une pause !`,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🍅</text></svg>'
            });
        }
        
        // Alerte de fallback
        alert(`🍅 Pomodoro terminé !\n\nVous avez travaillé ${minutes} minutes.\nPrenez une pause bien méritée !`);
        showMessage(`Session de ${minutes} minutes terminée ! 🎉`, 'success', 5000);
    },

    updateDisplay() {
        if (elements.timer) {
            elements.timer.textContent = Formatter.formatTime(appState.pomodoroTime);
        }
    },

    updateButtons() {
        if (!elements.startBtn || !elements.pauseBtn || !elements.stopBtn) return;

        elements.startBtn.disabled = appState.isRunning;
        elements.pauseBtn.disabled = !appState.isRunning;
        elements.stopBtn.disabled = !appState.isRunning;
        
        if (appState.isPaused) {
            elements.pauseBtn.innerHTML = '▶️ Reprendre';
        } else {
            elements.pauseBtn.innerHTML = '⏸️ Pause';
        }
    },

    changeTime() {
        if (appState.isRunning) {
            showMessage('Impossible de changer la durée pendant que le timer fonctionne', 'error');
            return;
        }

        const selectedTime = parseInt(elements.pomodoroTime.value);
        appState.pomodoroTime = selectedTime * 60;
        this.updateDisplay();
        showMessage(`Durée changée à ${selectedTime} minutes`, 'success');
    },

    trackTime(minutes) {
        const today = new Date().toDateString();
        
        // Reset si nouveau jour
        if (today !== appState.lastDate) {
            appState.workedToday = 0;
            appState.lastDate = today;
        }
        
        appState.workedToday += minutes;
        
        // Sauvegarde
        Storage.set(CONFIG.STORAGE_KEYS.WORKED_TODAY, appState.workedToday);
        Storage.set(CONFIG.STORAGE_KEYS.LAST_DATE, appState.lastDate);
    },

    updateStats() {
        if (!elements.stats.todayTime) return;

        elements.stats.todayTime.textContent = appState.workedToday;
        elements.stats.completedTasks.textContent = appState.completedTasks;
        elements.stats.totalSessions.textContent = appState.totalSessions;
        
        // Calcul de la productivité (basé sur les tâches terminées vs créées)
        const totalTasks = appState.tasks.length;
        const completedTasksCount = appState.tasks.filter(t => t.done).length;
        const productivity = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;
        
        elements.stats.productivity.textContent = `${productivity}%`;
    }
};

/**
 * Gestion des rappels automatiques
 */
function checkReminders() {
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = appState.tasks.filter(task => 
        task.date === today && !task.done
    );

    if (todayTasks.length > 0) {
        const taskNames = todayTasks.map(t => `• ${t.name}`).join('\n');
        const message = `📅 Rappel du jour !\n\nVous avez ${todayTasks.length} tâche${todayTasks.length > 1 ? 's' : ''} prévue${todayTasks.length > 1 ? 's' : ''} pour aujourd'hui :\n\n${taskNames}`;
        
        // Notification native si supportée
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('📅 Rappel de tâches', {
                body: `${todayTasks.length} tâche${todayTasks.length > 1 ? 's' : ''} prévue${todayTasks.length > 1 ? 's' : ''} aujourd'hui`,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📅</text></svg>'
            });
        }
        
        setTimeout(() => alert(message), 1000);
    }
}

/**
 * Demande de permission pour les notifications
 */
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showMessage('Notifications activées !', 'success');
            }
        });
    }
}

/**
 * Initialisation des éléments DOM
 */
function initializeElements() {
    // Formulaire et champs
    elements.taskForm = document.getElementById('taskForm');
    elements.taskName = document.getElementById('taskName');
    elements.taskDate = document.getElementById('taskDate');
    elements.taskPriority = document.getElementById('taskPriority');
    
    // Affichage
    elements.taskList = document.getElementById('taskList');
    elements.message = document.getElementById('message');
    
    // Timer
    elements.timer = document.getElementById('timer');
    elements.startBtn = document.getElementById('startBtn');
    elements.pauseBtn = document.getElementById('pauseBtn');
    elements.stopBtn = document.getElementById('stopBtn');
    elements.pomodoroTime = document.getElementById('pomodoroTime');
    
    // Contrôles
    elements.clearAllBtn = document.getElementById('clearAllBtn');
    elements.filterTasks = document.getElementById('filterTasks');
    
    // Statistiques
    elements.stats.todayTime = document.getElementById('todayTime');
    elements.stats.completedTasks = document.getElementById('completedTasks');
    elements.stats.totalSessions = document.getElementById('totalSessions');
    elements.stats.productivity = document.getElementById('productivity');

    // Vérification des éléments critiques
    const criticalElements = [
        'taskForm', 'taskName', 'taskDate', 'taskList', 'timer', 
        'startBtn', 'pauseBtn', 'stopBtn'
    ];
    
    const missingElements = criticalElements.filter(key => !elements[key]);
    if (missingElements.length > 0) {
        console.error('Éléments DOM manquants:', missingElements);
        showMessage('Erreur d\'initialisation de l\'interface', 'error');
    }
}

/**
 * Initialisation des événements
 */
function initializeEvents() {
    // Formulaire de tâche
    if (elements.taskForm) {
        elements.taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = elements.taskName.value;
            const date = elements.taskDate.value;
            const priority = elements.taskPriority.value;
            
            if (TaskManager.addTask(name, date, priority)) {
                elements.taskForm.reset();
                // Définir la date par défaut à aujourd'hui
                elements.taskDate.value = new Date().toISOString().split('T')[0];
            }
        });
    }

    // Boutons du timer
    if (elements.startBtn) {
        elements.startBtn.addEventListener('click', () => PomodoroTimer.start());
    }
    
    if (elements.pauseBtn) {
        elements.pauseBtn.addEventListener('click', () => PomodoroTimer.pause());
    }
    
    if (elements.stopBtn) {
        elements.stopBtn.addEventListener('click', () => PomodoroTimer.stop());
    }

    // Changement de durée du timer
    if (elements.pomodoroTime) {
        elements.pomodoroTime.addEventListener('change', () => PomodoroTimer.changeTime());
    }

    // Bouton supprimer tout
    if (elements.clearAllBtn) {
        elements.clearAllBtn.addEventListener('click', () => TaskManager.clearAllTasks());
    }

    // Filtre des tâches
    if (elements.filterTasks) {
        elements.filterTasks.addEventListener('change', (e) => {
            TaskManager.filterTasks(e.target.value);
        });
    }

    // Raccourcis clavier
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter pour ajouter une tâche
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            if (elements.taskName === document.activeElement || 
                elements.taskDate === document.activeElement) {
                elements.taskForm.dispatchEvent(new Event('submit'));
            }
        }
        
        // Espace pour démarrer/arrêter le timer (si pas dans un champ de saisie)
        if (e.code === 'Space' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
            e.preventDefault();
            if (appState.isRunning) {
                PomodoroTimer.pause();
            } else {
                PomodoroTimer.start();
            }
        }
    });
}

/**
 * Chargement des données depuis le localStorage
 */
function loadData() {
    // Chargement des tâches
    TaskManager.loadTasks();
    
    // Chargement des statistiques
    appState.workedToday = Storage.get(CONFIG.STORAGE_KEYS.WORKED_TODAY, 0);
    appState.lastDate = Storage.get(CONFIG.STORAGE_KEYS.LAST_DATE, new Date().toDateString());
    appState.totalSessions = Storage.get(CONFIG.STORAGE_KEYS.TOTAL_SESSIONS, 0);
    appState.completedTasks = Storage.get(CONFIG.STORAGE_KEYS.COMPLETED_TASKS, 0);
    
    // Reset si nouveau jour
    const today = new Date().toDateString();
    if (today !== appState.lastDate) {
        appState.workedToday = 0;
        appState.lastDate = today;
        Storage.set(CONFIG.STORAGE_KEYS.WORKED_TODAY, 0);
        Storage.set(CONFIG.STORAGE_KEYS.LAST_DATE, today);
    }
}

/**
 * Initialisation de l'application
 */
function initializeApp() {
    try {
        // Initialisation des éléments DOM
        initializeElements();
        
        // Chargement des données
        loadData();
        
        // Initialisation des événements
        initializeEvents();
        
        // Mise à jour de l'affichage
        PomodoroTimer.updateDisplay();
        PomodoroTimer.updateButtons();
        PomodoroTimer.updateStats();
        
        // Définir la date par défaut à aujourd'hui
        if (elements.taskDate) {
            elements.taskDate.value = new Date().toISOString().split('T')[0];
            elements.taskDate.min = new Date().toISOString().split('T')[0];
        }
        
        // Demander la permission pour les notifications
        requestNotificationPermission();
        
        // Vérifier les rappels après un délai
        setTimeout(checkReminders, 2000);
        
        console.log('FocusManager initialisé avec succès');
        
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        showMessage('Erreur lors de l\'initialisation de l\'application', 'error');
    }
}

// Initialisation quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Sauvegarde automatique avant fermeture
window.addEventListener('beforeunload', () => {
    if (appState.isRunning) {
        return 'Un timer Pomodoro est en cours. Êtes-vous sûr de vouloir quitter ?';
    }
});

// Export pour les tests (si nécessaire)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TaskManager,
        PomodoroTimer,
        Storage,
        Validator,
        Formatter
    };
}
