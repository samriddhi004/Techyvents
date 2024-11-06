function toggleBookmark(button, eventId,userId) {
    const isBookmarked = button.dataset.isBookmarked === 'true';
  
    fetch('/api/bookmark', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ eventId, isBookmarked: !isBookmarked, userId }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          button.classList.toggle('active', !isBookmarked);
          button.dataset.isBookmarked = !isBookmarked ? 'true' : 'false';
        } else {
          console.error('Error saving bookmark:', data.message);
        }
      })
      .catch(error => {
        console.error('Error saving bookmark:', error);
      });
  }
  
  // Initialize bookmarks when page loads
document.addEventListener('DOMContentLoaded', initializeBookmarkButtons);
  
function initializeBookmarkButtons() {
    fetch('/api/bookmarks')
      .then(response => response.json())
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
      });
  }