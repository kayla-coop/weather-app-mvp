// DOM Elements
const closeAlertBtn = document.getElementById('close-alert');
const weatherAlert = document.getElementById('weather-alert');
const findRoutesBtn = document.getElementById('find-routes-btn');
const backToPreferencesBtn = document.getElementById('back-to-preferences-btn');
const backToRoutesBtn = document.getElementById('back-to-routes-btn');
const reportHazardBtn = document.getElementById('report-hazard-btn');
const cancelReportBtn = document.getElementById('cancel-report-btn');
const submitReportBtn = document.getElementById('submit-report-btn');
const startNavigationBtn = document.getElementById('start-navigation-btn');

// Step sections
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');

// Location inputs
const startLocationSelect = document.getElementById('start-location');
const endLocationSelect = document.getElementById('end-location');

// Preference checkboxes
const avoidRainCheckbox = document.getElementById('avoid-rain');
const coveredWalkwaysCheckbox = document.getElementById('covered-walkways');
const prioritySpeedCheckbox = document.getElementById('priority-speed');

// Route containers
const routesContainer = document.getElementById('routes-container');
const selectedRouteDetails = document.getElementById('selected-route-details');

// Report modal
const reportModal = document.getElementById('report-modal');
const hazardLocationInput = document.getElementById('hazard-location');
const hazardTypeSelect = document.getElementById('hazard-type');
const hazardDescriptionInput = document.getElementById('hazard-description');

// Mock route data
const routes = [
    {
        id: 1,
        name: 'Route 1: Direct Path',
        weatherImpact: 'high',
        duration: 5,
        coveredWalkway: 'minimal',
        hazards: ['slippery walkways'],
        steps: [
            { name: 'Exit Atkins Library (North)', covered: false },
            { name: 'Cross Mary Alexander Road', covered: false },
            { name: 'Walk past Colvard Building', covered: false },
            { name: 'Enter Student Union (South Entrance)', covered: true }
        ]
    },
    {
        id: 2,
        name: 'Route 2: Covered Walkway',
        weatherImpact: 'low',
        duration: 7,
        coveredWalkway: 'extensive',
        hazards: [],
        steps: [
            { name: 'Exit Atkins Library (East)', covered: true },
            { name: 'Take covered walkway past Fretwell', covered: true },
            { name: 'Continue on covered path to College of Education', covered: true },
            { name: 'Use skybridge to Student Union', covered: true }
        ]
    },
    {
        id: 3,
        name: 'Route 3: Indoor Path',
        weatherImpact: 'minimal',
        duration: 9,
        coveredWalkway: 'fully indoors',
        hazards: [],
        steps: [
            { name: 'Exit Atkins Library (East)', covered: true },
            { name: 'Enter Fretwell Building', covered: true },
            { name: 'Pass through Fretwell to CHHS Building', covered: true },
            { name: 'Take indoor connector to College of Education', covered: true },
            { name: 'Use skybridge to Student Union', covered: true }
        ]
    }
];

// Selected route state
let selectedRoute = null;

// Event Listeners
closeAlertBtn.addEventListener('click', () => {
    weatherAlert.classList.add('hidden');
});

findRoutesBtn.addEventListener('click', () => {
    step1.classList.add('hidden');
    step2.classList.remove('hidden');
    renderRoutes();
});

backToPreferencesBtn.addEventListener('click', () => {
    step2.classList.add('hidden');
    step1.classList.remove('hidden');
});

backToRoutesBtn.addEventListener('click', () => {
    step3.classList.add('hidden');
    step2.classList.remove('hidden');
});

reportHazardBtn.addEventListener('click', () => {
    reportModal.classList.remove('hidden');
});

cancelReportBtn.addEventListener('click', () => {
    reportModal.classList.add('hidden');
    resetReportForm();
});

submitReportBtn.addEventListener('click', () => {
    const location = hazardLocationInput.value;
    const hazardType = hazardTypeSelect.value;
    const description = hazardDescriptionInput.value;
    
    if (!location) {
        alert('Please enter a location for the hazard.');
        return;
    }
    
    // In a real app, this would send data to a server
    alert(`Report submitted: ${hazardType} at ${location}`);
    reportModal.classList.add('hidden');
    resetReportForm();
});

startNavigationBtn.addEventListener('click', () => {
    alert('Navigation started! In a real app, turn-by-turn directions would begin.');
});

// Functions
function renderRoutes() {
    routesContainer.innerHTML = '';
    
    // Get user preferences
    const avoidRain = avoidRainCheckbox.checked;
    const preferCoveredWalkways = coveredWalkwaysCheckbox.checked;
    const prioritizeSpeed = prioritySpeedCheckbox.checked;
    
    // Sort routes based on preferences
    let sortedRoutes = [...routes].sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;
        
        // Apply preference weights
        if (avoidRain || preferCoveredWalkways) {
            // Weather impact score (higher is better)
            scoreA += a.weatherImpact === 'low' ? 30 : 
                     a.weatherImpact === 'medium' ? 15 : 0;
            scoreB += b.weatherImpact === 'low' ? 30 : 
                     b.weatherImpact === 'medium' ? 15 : 0;
            
            // Covered walkway score
            scoreA += a.coveredWalkway === 'fully indoors' ? 30 :
                     a.coveredWalkway === 'extensive' ? 20 : 0;
            scoreB += b.coveredWalkway === 'fully indoors' ? 30 :
                     b.coveredWalkway === 'extensive' ? 20 : 0;
        }
        
        if (prioritizeSpeed) {
            // Duration score (lower is better)
            scoreA += (15 - a.duration) * 5;
            scoreB += (15 - b.duration) * 5;
        }
        
        return scoreB - scoreA; // Higher score is better
    });
    
    // Create route cards
    sortedRoutes.forEach(route => {
        const routeCard = document.createElement('div');
        routeCard.className = 'route-card';
        routeCard.setAttribute('data-route-id', route.id);
        
        // Weather impact badge class
        const impactClass = route.weatherImpact === 'low' ? 'impact-low' :
                           route.weatherImpact === 'medium' ? 'impact-medium' :
                           'impact-high';
        
        // Impact text
        const impactText = route.weatherImpact === 'low' ? 'Low Weather Impact' :
                          route.weatherImpact === 'medium' ? 'Medium Weather Impact' :
                          'High Weather Impact';
        
        // Covered walkway text
        const coverageText = route.coveredWalkway === 'fully indoors' ? 'Fully indoors' :
                            route.coveredWalkway === 'extensive' ? 'Mostly covered' :
                            'Minimal cover';
        
        routeCard.innerHTML = `
            <div class="route-header">
                <h4 class="route-name">${route.name}</h4>
                <span class="impact-badge ${impactClass}">${impactText}</span>
            </div>
            
            <div class="route-details-grid">
                <div class="route-detail">
                    <span class="route-detail-text">Duration: ${route.duration} minutes</span>
                </div>
                <div class="route-detail">
                    <span class="route-detail-text">${coverageText}</span>
                </div>
            </div>
            
            ${route.hazards.length > 0 ? `
                <div class="route-hazards">
                    Hazards: ${route.hazards.join(', ')}
                </div>
            ` : ''}
        `;
        
        routeCard.addEventListener('click', () => {
            selectRoute(route);
        });
        
        routesContainer.appendChild(routeCard);
    });
}

function selectRoute(route) {
    selectedRoute = route;
    step2.classList.add('hidden');
    step3.classList.remove('hidden');
    renderSelectedRouteDetails();
}

function renderSelectedRouteDetails() {
    if (!selectedRoute) return;
    
    // Create impact badge class
    const impactClass = selectedRoute.weatherImpact === 'low' ? 'impact-low' :
                       selectedRoute.weatherImpact === 'medium' ? 'impact-medium' :
                       'impact-high';
    
    // Create impact text
    const impactText = selectedRoute.weatherImpact === 'low' ? 'Low Weather Impact' :
                      selectedRoute.weatherImpact === 'medium' ? 'Medium Weather Impact' :
                      'High Weather Impact';
    
    selectedRouteDetails.innerHTML = `
        <h3 class="selected-route-name">${selectedRoute.name}</h3>
        <div class="route-badges">
            <span class="route-badge">${selectedRoute.duration} minutes</span>
            <span class="route-badge ${impactClass}">${impactText}</span>
        </div>
        
        <div class="route-steps">
            <h4 class="route-steps-title">Route Steps:</h4>
            <ol class="steps-list">
                ${selectedRoute.steps.map((step, index) => `
                    <li class="step-item">
                        <div class="step-number">${index + 1}.</div>
                        <div class="step-details">
                            <p class="step-name">${step.name}</p>
                            ${step.covered ? 
                                '<p class="step-covered">Covered path</p>' :
                                '<p class="step-exposed">Exposed to weather</p>'
                            }
                        </div>
                    </li>
                `).join('')}
            </ol>
        </div>
    `;
}

function resetReportForm() {
    hazardLocationInput.value = '';
    hazardTypeSelect.value = 'Flooding';
    hazardDescriptionInput.value = '';
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Pre-select options based on URL params if needed
    const urlParams = new URLSearchParams(window.location.search);
    const fromParam = urlParams.get('from');
    const toParam = urlParams.get('to');
    
    if (fromParam) {
        const fromOption = Array.from(startLocationSelect.options).find(
            option => option.value.toLowerCase() === fromParam.toLowerCase()
        );
        if (fromOption) startLocationSelect.value = fromOption.value;
    }
    
    if (toParam) {
        const toOption = Array.from(endLocationSelect.options).find(
            option => option.value.toLowerCase() === toParam.toLowerCase()
        );
        if (toOption) endLocationSelect.value = toOption.value;
    }
    
    // Add event listeners for simulated real-time weather updates
    simulateWeatherUpdates();
});

function simulateWeatherUpdates() {
    // This function would connect to a real weather API in a production app
    // For demo purposes, we'll simulate some weather changes
    
    const weatherConditions = [
        { temp: 68, condition: 'Light Rain' },
        { temp: 67, condition: 'Moderate Rain' },
        { temp: 65, condition: 'Thunderstorms' },
        { temp: 69, condition: 'Cloudy' },
        { temp: 71, condition: 'Partly Cloudy' }
    ];
    
    // For demo: Change weather every minute
    let currentIndex = 0;
    
    function updateWeatherDisplay() {
        const tempDisplay = document.querySelector('.temperature');
        const conditionsDisplay = document.querySelector('.conditions');
        const weatherInfo = weatherConditions[currentIndex];
        
        tempDisplay.textContent = `${weatherInfo.temp}°F`;
        conditionsDisplay.textContent = weatherInfo.condition;
        
        // Update the weather display in step 3 as well
        const weatherCondition = document.querySelector('.weather-condition');
        const weatherTemperature = document.querySelector('.weather-temperature');
        
        if (weatherCondition && weatherTemperature) {
            weatherCondition.textContent = weatherInfo.condition;
            weatherTemperature.textContent = `${weatherInfo.temp}°F`;
        }
        
        // Update current index for next time
        currentIndex = (currentIndex + 1) % weatherConditions.length;
        
        // If the condition changes to Thunderstorms, show alert if it was previously hidden
        if (weatherInfo.condition === 'Thunderstorms' && weatherAlert.classList.contains('hidden')) {
            weatherAlert.classList.remove('hidden');
            
            // Update alert text
            const alertText = weatherAlert.querySelector('.alert-text');
            alertText.innerHTML = '<span class="alert-bold">Alert:</span> Thunderstorm Warning: Heavy thunderstorms currently in the area.';
        }
    }
    
    // Initial update
    updateWeatherDisplay();
    
    // Update every 60 seconds
    setInterval(updateWeatherDisplay, 60000);
}

// Implement simulated crowdsourced hazard reporting
let hazardReports = [
    {
        id: 1,
        location: 'Between Fretwell and CHHS',
        hazardType: 'Flooding',
        description: 'Small pond forming near the walkway entrance',
        timestamp: '11:45 AM',
        votes: 3
    },
    {
        id: 2,
        location: 'Student Union south entrance',
        hazardType: 'Slippery Surface',
        description: 'Wet floor at entrance with no warning sign',
        timestamp: '10:30 AM',
        votes: 5
    }
];

// Function to add a new hazard report
function addHazardReport(report) {
    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const newReport = {
        id: hazardReports.length + 1,
        timestamp,
        votes: 1,
        ...report
    };
    
    hazardReports.unshift(newReport);
    
    // In a real app, this would update routes based on new hazards
    updateRoutesWithHazards();
}

function updateRoutesWithHazards() {
    // This function would update route data based on reported hazards
    // For demo purposes, we'll just log the action
    console.log('Routes would be updated based on new hazard reports');
    
    // In a real app, this might trigger a re-render of the routes or
    // update the safety scores of affected routes
}

// Handle form submission for hazard reports
submitReportBtn.addEventListener('click', () => {
    const location = hazardLocationInput.value;
    const hazardType = hazardTypeSelect.value;
    const description = hazardDescriptionInput.value;
    
    if (!location) {
        alert('Please enter a location for the hazard.');
        return;
    }
    
    const newReport = {
        location,
        hazardType,
        description
    };
    
    addHazardReport(newReport);
    alert(`Report submitted: ${hazardType} at ${location}. Thank you for helping keep campus safe!`);
    reportModal.classList.add('hidden');
    resetReportForm();
});

// Simulate API connection for weather data
// In a real app, this would connect to an actual weather service API
function simulateWeatherAPI() {
    // This would normally fetch data from a weather API
    return {
        current: {
            temp: 68,
            feels_like: 67,
            humidity: 75,
            wind_speed: 8,
            weather: 'light rain'
        },
        hourly: [
            { time: '12 PM', temp: 68, precipitation: 60, weather: 'light rain' },
            { time: '1 PM', temp: 67, precipitation: 70, weather: 'moderate rain' },
            { time: '2 PM', temp: 65, precipitation: 80, weather: 'thunderstorms' },
            { time: '3 PM', temp: 64, precipitation: 80, weather: 'thunderstorms' },
            { time: '4 PM', temp: 67, precipitation: 40, weather: 'light rain' },
            { time: '5 PM', temp: 69, precipitation: 20, weather: 'cloudy' }
        ],
        alerts: [
            {
                type: 'weather',
                severity: 'moderate',
                title: 'Thunderstorm Warning',
                description: 'Thunderstorms expected between 2:00 PM and 4:00 PM with potential for lightning.',
                time: '12:30 PM'
            }
        ]
    };
}

// Add mock functionality for analytics
function trackUserJourney(eventType, details = {}) {
    // In a real app, this would send analytics data
    console.log(`Analytics event: ${eventType}`, details);
}

// Track when users select routes
function trackRouteSelection(route) {
    trackUserJourney('route_selected', {
        route_id: route.id,
        route_name: route.name,
        start_location: startLocationSelect.value,
        end_location: endLocationSelect.value,
        weather_impact: route.weatherImpact,
        preferences: {
            avoid_rain: avoidRainCheckbox.checked,
            prefer_covered: coveredWalkwaysCheckbox.checked,
            prioritize_speed: prioritySpeedCheckbox.checked
        }
    });
}

// Add analytics tracking to route selection
const originalSelectRoute = selectRoute;
selectRoute = function(route) {
    trackRouteSelection(route);
    originalSelectRoute(route);
};

// Track when hazard reports are submitted
const originalAddHazardReport = addHazardReport;
addHazardReport = function(report) {
    trackUserJourney('hazard_reported', {
        hazard_type: report.hazardType,
        location: report.location
    });
    originalAddHazardReport(report);
};

// Demo feature: Simulate speech notifications for severe weather
startNavigationBtn.addEventListener('click', () => {
    const weatherData = simulateWeatherAPI();
    
    if (weatherData.alerts.length > 0) {
        const alert = weatherData.alerts[0];
        
        // Check if browser supports speech synthesis
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance();
            speech.text = `Weather Alert: ${alert.title}. ${alert.description}`;
            speech.volume = 1;
            speech.rate = 1;
            speech.pitch = 1;
            
            window.speechSynthesis.speak(speech);
        }
    }
    
    alert('Navigation started! Follow the route instructions to reach your destination safely.');
});
                    