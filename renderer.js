// Calendar application renderer process
const { ipcRenderer } = require('electron');

class CalendarApp {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.events = this.loadEvents();
        
        this.initializeEventListeners();
        this.renderCalendar();
        this.updateSidebar();
    }

    initializeEventListeners() {
        // Navigation buttons
        document.getElementById('prev-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
            this.updateSidebar();
        });

        document.getElementById('next-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
            this.updateSidebar();
        });

        // Add event button
        document.getElementById('add-event-btn').addEventListener('click', () => {
            this.openEventModal();
        });

        // Modal controls
        document.getElementById('close-modal').addEventListener('click', () => {
            this.closeEventModal();
        });

        document.getElementById('cancel-event').addEventListener('click', () => {
            this.closeEventModal();
        });

        // Event form submission
        document.getElementById('event-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEvent();
        });

        // Close modal when clicking outside
        document.getElementById('event-modal').addEventListener('click', (e) => {
            if (e.target.id === 'event-modal') {
                this.closeEventModal();
            }
        });

        // Listen for menu events from main process
        ipcRenderer.on('new-event', () => {
            this.openEventModal();
        });
    }

    renderCalendar() {
        const monthYear = document.getElementById('current-month-year');
        const calendarGrid = document.getElementById('calendar-grid');

        // Update month/year display
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        monthYear.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;

        // Clear existing calendar
        calendarGrid.innerHTML = '';

        // Get first day of month and number of days
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        // Generate calendar days
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const dayElement = this.createDayElement(date);
            calendarGrid.appendChild(dayElement);
        }
    }

    createDayElement(date) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = date.getDate();
        
        const dayEvents = document.createElement('div');
        dayEvents.className = 'day-events';

        // Add styling based on date
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();
        const isCurrentMonth = date.getMonth() === this.currentDate.getMonth();

        if (isToday) {
            dayElement.classList.add('today');
        }
        if (!isCurrentMonth) {
            dayElement.classList.add('other-month');
        }

        // Add events for this day
        const dateString = this.formatDate(date);
        const dayEventsList = this.events.filter(event => event.date === dateString);
        
        dayEventsList.forEach(event => {
            const eventDot = document.createElement('div');
            eventDot.className = 'event-dot';
            eventDot.title = event.title;
            dayEvents.appendChild(eventDot);
        });

        // Click handler for day selection
        dayElement.addEventListener('click', () => {
            // Remove previous selection
            document.querySelectorAll('.calendar-day.selected').forEach(el => {
                el.classList.remove('selected');
            });
            
            // Add selection to clicked day
            dayElement.classList.add('selected');
            this.selectedDate = date;
            
            // Open event modal with selected date
            this.openEventModal(date);
        });

        dayElement.appendChild(dayNumber);
        dayElement.appendChild(dayEvents);
        
        return dayElement;
    }

    openEventModal(selectedDate = null) {
        const modal = document.getElementById('event-modal');
        const form = document.getElementById('event-form');
        const dateInput = document.getElementById('event-date');
        
        // Reset form
        form.reset();
        
        // Set date if provided
        if (selectedDate) {
            dateInput.value = this.formatDate(selectedDate);
        } else if (this.selectedDate) {
            dateInput.value = this.formatDate(this.selectedDate);
        } else {
            dateInput.value = this.formatDate(new Date());
        }
        
        modal.classList.add('show');
        document.getElementById('event-title').focus();
    }

    closeEventModal() {
        const modal = document.getElementById('event-modal');
        modal.classList.remove('show');
    }

    saveEvent() {
        const title = document.getElementById('event-title').value.trim();
        const date = document.getElementById('event-date').value;
        const time = document.getElementById('event-time').value;
        const description = document.getElementById('event-description').value.trim();

        if (!title || !date) {
            alert('Please fill in the title and date fields.');
            return;
        }

        const newEvent = {
            id: Date.now().toString(),
            title,
            date,
            time,
            description
        };

        this.events.push(newEvent);
        this.saveEvents();
        this.renderCalendar();
        this.updateSidebar();
        this.closeEventModal();
    }

    updateSidebar() {
        this.updateTodayEvents();
        this.updateUpcomingEvents();
    }

    updateTodayEvents() {
        const todayEventsContainer = document.getElementById('today-events');
        const today = this.formatDate(new Date());
        const todayEvents = this.events.filter(event => event.date === today);

        todayEventsContainer.innerHTML = '';

        if (todayEvents.length === 0) {
            todayEventsContainer.innerHTML = '<p style="color: #a0aec0; font-style: italic;">No events today</p>';
            return;
        }

        todayEvents.forEach(event => {
            const eventElement = this.createEventElement(event);
            todayEventsContainer.appendChild(eventElement);
        });
    }

    updateUpcomingEvents() {
        const upcomingEventsContainer = document.getElementById('upcoming-events');
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        const upcomingEvents = this.events
            .filter(event => {
                const eventDate = new Date(event.date);
                return eventDate > today && eventDate <= nextWeek;
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5);

        upcomingEventsContainer.innerHTML = '';

        if (upcomingEvents.length === 0) {
            upcomingEventsContainer.innerHTML = '<p style="color: #a0aec0; font-style: italic;">No upcoming events</p>';
            return;
        }

        upcomingEvents.forEach(event => {
            const eventElement = this.createEventElement(event);
            upcomingEventsContainer.appendChild(eventElement);
        });
    }

    createEventElement(event) {
        const eventElement = document.createElement('div');
        eventElement.className = 'event-item';
        
        const eventTitle = document.createElement('div');
        eventTitle.className = 'event-title';
        eventTitle.textContent = event.title;
        
        const eventTime = document.createElement('div');
        eventTime.className = 'event-time';
        eventTime.textContent = event.time ? 
            `${this.formatDateDisplay(event.date)} at ${this.formatTimeDisplay(event.time)}` :
            this.formatDateDisplay(event.date);
        
        eventElement.appendChild(eventTitle);
        eventElement.appendChild(eventTime);
        
        if (event.description) {
            const eventDescription = document.createElement('div');
            eventDescription.className = 'event-description';
            eventDescription.textContent = event.description;
            eventElement.appendChild(eventDescription);
        }

        // Add click handler for event editing/deletion
        eventElement.addEventListener('click', () => {
            this.showEventOptions(event);
        });
        
        return eventElement;
    }

    showEventOptions(event) {
        // Simple implementation - you can enhance this with a proper context menu
        const action = confirm(`Event: ${event.title}\n\nClick OK to delete this event, or Cancel to keep it.`);
        
        if (action) {
            this.deleteEvent(event.id);
        }
    }

    deleteEvent(eventId) {
        this.events = this.events.filter(event => event.id !== eventId);
        this.saveEvents();
        this.renderCalendar();
        this.updateSidebar();
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    formatDateDisplay(dateString) {
        const date = new Date(dateString);
        const options = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    formatTimeDisplay(timeString) {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    }

    loadEvents() {
        try {
            const savedEvents = localStorage.getItem('calendar-events');
            return savedEvents ? JSON.parse(savedEvents) : [];
        } catch (error) {
            console.error('Error loading events:', error);
            return [];
        }
    }

    saveEvents() {
        try {
            localStorage.setItem('calendar-events', JSON.stringify(this.events));
        } catch (error) {
            console.error('Error saving events:', error);
        }
    }
}

// Initialize the calendar app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CalendarApp();
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape key to close modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('event-modal');
        if (modal.classList.contains('show')) {
            modal.classList.remove('show');
        }
    }
    
    // Ctrl/Cmd + N to create new event
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        document.getElementById('add-event-btn').click();
    }
});
