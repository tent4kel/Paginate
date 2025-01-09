(function() {
    // Check if the document is ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('navigation.js loaded and ready!');

        // Variables to track swipe gestures
        let touchStartX = 0;
        let touchEndX = 0;

        // Detect swipe gestures
        document.addEventListener('touchstart', function(event) {
            touchStartX = event.touches[0].clientX; // Record the starting X coordinate
            console.log(`Touch started at X: ${touchStartX}`);
        });

        document.addEventListener('touchend', function(event) {
            touchEndX = event.changedTouches[0].clientX; // Record the ending X coordinate
            console.log(`Touch ended at X: ${touchEndX}`);
            handleSwipeGesture();
        });

        // Handle swipe gesture
        function handleSwipeGesture() {
            const swipeThreshold = 50; // Minimum distance for a swipe to be recognized
            const swipeDistance = touchEndX - touchStartX;
            console.log(`Swipe distance: ${swipeDistance}`);

            if (touchStartX - touchEndX > swipeThreshold) {
                console.log('Swipe detected: LEFT');
                scrollByScreenWidth(1); // Swipe left
            } else if (touchEndX - touchStartX > swipeThreshold) {
                console.log('Swipe detected: RIGHT');
                scrollByScreenWidth(-1); // Swipe right
            } else {
                console.log('Swipe too short, no action taken');
            }
        }

        // Event listener for keydown (e.g., ArrowRight, ArrowLeft)
        document.addEventListener('keydown', function(event) {
            console.log(`Key pressed: ${event.key}`);
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                event.preventDefault(); // Prevent default scrolling
                console.log('Scrolling right via key press');
                scrollByScreenWidth(1);
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                event.preventDefault(); // Prevent default scrolling
                console.log('Scrolling left via key press');
                scrollByScreenWidth(-1);
            }
        });

        // Optional: Event listener for a custom button press (e.g., a specific button click)
        const button = document.getElementById('scroll-button'); // Assume you have a button with id 'scroll-button'
        if (button) {
            button.addEventListener('click', function() {
                console.log('Custom button clicked, scrolling right');
                scrollByScreenWidth(1);
            });
        }
    });

    // Function to scroll the page by one screen width (can be modified for height or both)
    function scrollByScreenWidth(direction) {
        const width = window.innerWidth; // Get the screen width (viewport width)
        console.log(`Scrolling by width: ${direction * width}px`);
        window.scrollBy({
            left: direction * width,
            behavior: 'smooth' // Adds smooth scrolling effect
        });
    }
})();