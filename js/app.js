document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    if (mobileMenuButton) {
        const nav = document.querySelector('nav');
        mobileMenuButton.addEventListener('click', function() {
            nav.classList.toggle('mobile-menu-open');
        });
    }

    // Form submission handling
    const findButton = document.getElementById('find-destinations');
    if (findButton) {
        findButton.addEventListener('click', function() {
            processForm();
        });
    }
});

// Process the form and generate recommendations
function processForm() {
    // Get form values
    const mood = document.getElementById('mood').value;
    const season = document.getElementById('season').value;
    const tripLength = document.getElementById('trip-length').value;
    const climate = document.getElementById('climate').value;
    const activityLevel = document.getElementById('activity-level').value;
    const budget = document.getElementById('budget').value;
    
    // Get selected interests
    const interestCheckboxes = document.querySelectorAll('input[name="interests"]:checked');
    const interests = Array.from(interestCheckboxes).map(checkbox => checkbox.value);

    // Validate form
    if (!mood || !season || !tripLength || !climate || !activityLevel || !budget || interests.length === 0) {
        alert('Please fill out all fields and select at least one interest.');
        return;
    }

    // Generate recommendations
    const recommendations = generateRecommendations(mood, season, tripLength, climate, activityLevel, budget, interests);
    
    // Display recommendations
    displayRecommendations(recommendations);
    
    // Show recommendations section
    document.getElementById('recommendations').classList.remove('hidden');
    
    // Scroll to recommendations
    document.getElementById('recommendations').scrollIntoView({ behavior: 'smooth' });
}

// Generate personalized recommendations based on user preferences
function generateRecommendations(mood, season, tripLength, climate, activityLevel, budget, interests) {
    // Calculate match score for each destination
    const scoredDestinations = destinations.map(destination => {
        let score = 0;
        
        // Score based on mood match
        if (destination.mood.includes(mood)) {
            score += 3; // Mood is important, so higher weight
        }
        
        // Score based on season match
        if (destination.season.includes(season)) {
            score += 2;
        }
        
        // Score based on trip length match
        if (destination.tripLength.includes(tripLength)) {
            score += 1;
        }
        
        // Score based on climate match
        if (destination.climate.includes(climate)) {
            score += 2;
        }
        
        // Score based on activity level match
        if (destination.activityLevel.includes(activityLevel)) {
            score += 2;
        }
        
        // Score based on budget match
        if (destination.budget.includes(budget)) {
            score += 2;
        }
        
        // Score based on interests match
        const interestMatches = interests.filter(interest => 
            destination.interests.includes(interest)
        ).length;
        
        score += interestMatches;
        
        return {
            ...destination,
            score: score
        };
    });
    
    // Sort destinations by score (highest first)
    const sortedDestinations = scoredDestinations.sort((a, b) => b.score - a.score);
    
    // Return top 6 recommendations
    return sortedDestinations.slice(0, 6);
}

// Display recommendations in the UI
function displayRecommendations(recommendations) {
    const container = document.getElementById('recommendation-container');
    
    // Clear previous recommendations
    container.innerHTML = '';
    
    // Add new recommendation cards
    recommendations.forEach(recommendation => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-md overflow-hidden recommendation-card';
        
        card.innerHTML = `
            <div class="h-48 overflow-hidden">
                <img src="${recommendation.image}" alt="${recommendation.name}" class="w-full h-full object-cover">
            </div>
            <div class="p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-2">${recommendation.name}</h3>
                <p class="text-gray-600 mb-4">${recommendation.description}</p>
                <div class="flex flex-wrap gap-2 mb-4">
                    ${recommendation.interests.map(interest => `
                        <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                            ${interest.charAt(0).toUpperCase() + interest.slice(1)}
                        </span>
                    `).join('')}
                </div>
                <div class="mt-4">
                    <a href="#" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300">
                        View Details
                    </a>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
    
    // If no recommendations
    if (recommendations.length === 0) {
        container.innerHTML = `
            <div class="col-span-3 text-center py-12">
                <h3 class="text-xl font-semibold text-gray-800 mb-2">No matching destinations found</h3>
                <p class="text-gray-600">Try adjusting your preferences to get better recommendations.</p>
            </div>
        `;
    }
}