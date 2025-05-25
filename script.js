// Récupérer la durée sélectionnée à partir de l'URL
const params = new URLSearchParams(window.location.search);
const duration = params.get('duration');
document.getElementById('duration').textContent = duration || 'Non spécifiée';

// Générer le calendrier
const datesDiv = document.getElementById('dates');
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();
const currentDay = today.getDate();
const daysInMonth = new Date(year, month + 1, 0).getDate();
const firstDayOfMonth = new Date(year, month, 1).getDay();
const previousMonthDays = new Date(year, month, 0).getDate(); // Nombre de jours du mois précédent

// Calculer combien de jours générer avant la date actuelle
const currentDayOfWeek = today.getDay(); // Dimanche = 0, Lundi = 1, ..., Samedi = 6
const daysBefore = currentDayOfWeek === 0 ? 6 : currentDayOfWeek + 7; // Ajuste le décalage pour que dimanche commence correctement avec une rangée avant
const startDay = currentDay - daysBefore;

// Si on commence avant le 1er du mois, ajouter des jours du mois précédent
if (startDay < 1) {
    const extraDaysFromPreviousMonth = Math.abs(startDay);
    for (let i = extraDaysFromPreviousMonth; i > 0; i--) {
        const previousDateElement = document.createElement('div');
        previousDateElement.className = 'date previous-month not-selectable';
        previousDateElement.textContent = previousMonthDays - i + 1;
        datesDiv.appendChild(previousDateElement);
    }
}

// Générer les jours avant la date actuelle (dans le mois en cours)
for (let day = Math.max(1, startDay); day < currentDay; day++) {
    const dateElement = document.createElement('div');
    dateElement.className = 'date current-month not-selectable';
    dateElement.textContent = day;
    datesDiv.appendChild(dateElement);
}

// Ajouter la date actuelle
const todayElement = document.createElement('div');
todayElement.className = 'date today not-selectable';
todayElement.textContent = currentDay;
datesDiv.appendChild(todayElement);

for (let day = currentDay + 1; day <= daysInMonth; day++) {
    const dateElement = document.createElement('div');

    // Vérifier si des créneaux horaires sont disponibles
    const selectedDate = new Date(year, month, day);
    let availableSlots;

    if (duration == 30) {
        availableSlots = getAvailableSlots30(selectedDate);
    }
    if (duration == 60) {
        availableSlots = getAvailableSlots60(selectedDate);
    }
    if (duration == 90) {
        availableSlots = getAvailableSlots90(selectedDate);
    }

    if (availableSlots.length > 0) {
        dateElement.className = 'date current-month selectable'; // Journées avec créneaux disponibles
        dateElement.textContent = day;

        // Ajouter l'événement pour afficher les plages horaires
        dateElement.addEventListener('click', () => {
            const timeSlotsDiv = document.getElementById('time-slots');
            timeSlotsDiv.innerHTML = ''; // Réinitialiser les plages horaires

            availableSlots.forEach(slot => {
                const slotElement = document.createElement('div');
                slotElement.className = 'time-slot';
                slotElement.textContent = slot;
                timeSlotsDiv.appendChild(slotElement);
            });
        });
    } else {
        // Journées sans créneaux disponibles (non sélectionnables)
        dateElement.className = 'date current-month not-selectable';
        dateElement.textContent = day;

        // Ajouter un événement pour effacer les plages horaires
        dateElement.addEventListener('click', () => {
            const timeSlotsDiv = document.getElementById('time-slots');
            timeSlotsDiv.innerHTML = ''; // Effacer les plages horaires
        });
    }

    datesDiv.appendChild(dateElement);
}

//*************************************************************************** */
//****************** extra day (next month) ********************************* */
//*************************************************************************** */

// Ajouter des jours supplémentaires pour compléter 4 rangées après la date actuelle
const totalDaysDisplayed = daysBefore + (daysInMonth - currentDay + 1);
const extraDaysNeeded = (5 * 7) - totalDaysDisplayed; // 5 rangées (1 avant + 4 après)

for (let i = 1; i <= extraDaysNeeded; i++) {
    const nextDateElement = document.createElement('div');

    // Vérifier si des créneaux horaires sont disponibles 
    const selectedDate = new Date(year, month + 1, i);
    let availableSlots;
    
    if (duration == 30) {
        availableSlots = getAvailableSlots30(selectedDate);
    }
    if (duration == 60) { 
        availableSlots = getAvailableSlots60(selectedDate);
    }
    if (duration == 90) {
        availableSlots = getAvailableSlots90(selectedDate);
    }
    
    if (availableSlots.length > 0) {
        nextDateElement.className = 'date next-month selectable'; // Journées avec créneaux disponibles
        nextDateElement.textContent = i;

        // Ajouter l'événement pour afficher les plages horaires
        nextDateElement.addEventListener('click', () => {
            const timeSlotsDiv = document.getElementById('time-slots');
            timeSlotsDiv.innerHTML = ''; // Réinitialiser les plages horaires

            availableSlots.forEach(slot => {
                const slotElement = document.createElement('div');
                slotElement.className = 'time-slot';
                slotElement.textContent = slot;
                timeSlotsDiv.appendChild(slotElement);
            });
        });
    } else {
        // Journées sans créneaux disponibles (non sélectionnables)
        nextDateElement.className = 'date next-month not-selectable';
        nextDateElement.textContent = i;
    }

    datesDiv.appendChild(nextDateElement);
}



function getAvailableSlots30(selectedDate) {
    const dayOfWeek = selectedDate.getDay(); // 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi

    // Définir les horaires en fonction de ton emploi du temps
    const schedule = {
        0: [], // Dimanche : fermé
        1: ['10:00 - 10:30', '10:30 - 11:00', '11:00 - 11:30', '11:30 - 12:00', '13:00 - 13:30', '13:30 - 14:00', '14:00 - 14:30', '14:30 - 15:00', '15:00 - 15:30', '15:30 - 16:00'], // Lundi
        2: [], // Mardi : fermé
        3: ['09:00 - 09:30', '09:30 - 10:00', '10:00 - 10:30', '10:30 - 11:00', '11:00 - 11:30', '11:30 - 12:00', '14:30 - 15:00', '15:00 - 15:30', '15:30 - 16:00', '16:00 - 16:30', '16:30 - 17:00'], // Mercredi
        4: ['14:00 - 14:30', '14:30 - 15:00', '15:00 - 15:30', '15:30 - 16:00', '16:00 - 16:30', '16:30 - 17:00', '17:00 - 17:30', '17:30 - 18:00', '18:00 - 18:30'], // Jeudi
        5: [], // Vendredi : fermé
        6: [] // Samedi : fermé
    };

    return schedule[dayOfWeek] || [];
}

function getAvailableSlots60(selectedDate) {
    const dayOfWeek = selectedDate.getDay(); // 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi

    // Définir les horaires en fonction de ton emploi du temps
    const schedule = {
        0: [], // Dimanche : fermé
        1: ['10:00 - 11:00', '11:00 - 12:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00'], // Lundi
        2: [], // Mardi : fermé
        3: ['09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '15:00 - 16:00', '16:00 - 17:00'], // Mercredi
        4: ['14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00'], // Jeudi
        5: [], // Vendredi : fermé
        6: [] // Samedi : fermé
    };

    return schedule[dayOfWeek] || [];
}


function getAvailableSlots90(selectedDate) {
    const dayOfWeek = selectedDate.getDay();

    // Définir les horaires en fonction de ton emploi du temps
    let horraire = {
        0: [], // Dimanche : fermé
        1: [
            { start: "10:00", end: "12:00" }, // Lundi
            { start: "13:00", end: "16:00" }
        ],
        2: [], // Mardi : fermé
        3: [
            { start: "09:00", end: "12:00" }, // Mercredi
            { start: "15:00", end: "17:00" }
        ],
        4: [
            { start: "14:00", end: "18:00" } // Jeudi
        ],
        5: [], // Vendredi : fermé
        6: [] // Samedi : fermé
    };

    return horraire[dayOfWeek] || [];
}