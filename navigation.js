(function() {
    // Check if the document is ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('navigation.js loaded and ready!');

        // Event listener for button press (e.g., ArrowRight)
        document.addEventListener('keydown', function(event) {
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                // Scroll by one full screen width
                scrollByScreenWidth(1);
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                // Scroll back by one full screen width
                scrollByScreenWidth(-1);
            }
        });

        // Optional: Event listener for a custom button press (e.g., a specific button click)
        const button = document.getElementById('scroll-button'); // Assume you have a button with id 'scroll-button'
        if (button) {
            button.addEventListener('click', function() {
                scrollByScreenWidth(1);
            });
        }
    });

    // Function to scroll the page by one screen width (can be modified for height or both)
    function scrollByScreenWidth(direction) {
        const width = window.innerWidth; // Get the screen width (viewport width)
        window.scrollBy(direction * width, 0); // Scroll horizontally by one screen width (direction = 1 or -1)
    }
})();

