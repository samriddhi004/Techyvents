// Function to toggle bookmark status
function toggleBookmark(button, eventId, userId) {
    const isBookmarked = button.dataset.isBookmarked === 'true';
    
    fetch('/api/bookmark', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, eventId, isBookmarked: !isBookmarked }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            button.classList.toggle('active', !isBookmarked);
            button.dataset.isBookmarked = !isBookmarked ? 'true' : 'false';
            localStorage.setItem('bookmarkedEvents', JSON.stringify(data.bookmarkedEvents));
            // Optional: Show success message
            showNotification('Bookmark updated successfully!', 'success');
        } else {
            throw new Error(data.message || 'Error saving bookmark');
        }
    })
    .catch(error => {
        console.error('Error saving bookmark:', error);
        showNotification('Failed to update bookmark', 'error');
    });
}

// Function to initialize bookmark buttons
function initializeBookmarkButtons() {
    showLoadingState(true);
    
    fetch('/api/bookmarks')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch bookmarks');
            }
            return response.json();
        })
        .then(data => {
            const bookmarks = data.bookmarks || [];
            const buttons = document.querySelectorAll('.bookmark-btn');

            buttons.forEach(button => {
                const eventId = button.closest('.event-card').dataset.eventId;
                if (bookmarks.includes(eventId)) {
                    button.classList.add('active');
                    button.dataset.isBookmarked = 'true';
                } else {
                    button.dataset.isBookmarked = 'false';
                }
            });
        })
        .catch(error => {
            console.error('Error fetching bookmarks:', error);
            showNotification('Failed to load bookmarks', 'error');
        })
        .finally(() => {
            showLoadingState(false);
        });
}

// Helper function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Helper function to show/hide loading state
function showLoadingState(isLoading) {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = isLoading ? 'block' : 'none';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize from localStorage first
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedEvents')) || [];
    const buttons = document.querySelectorAll('.bookmark-btn');

    buttons.forEach(button => {
        const eventId = button.closest('.event-card').dataset.eventId;
        if (bookmarks.includes(eventId)) {
            button.classList.add('active');
            button.dataset.isBookmarked = 'true';
        } else {
            button.dataset.isBookmarked = 'false';
        }
    });

    // Then fetch latest from server
    initializeBookmarkButtons();
});