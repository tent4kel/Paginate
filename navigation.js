(function() {
    function initNavigation() {
        console.log('navigation.js loaded and ready!');
        
        // Ensure the document is focused to capture key presses
        window.focus();

        // Attach a keydown event listener to the whole document
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

        // Mouse wheel event listener for page turns
        document.addEventListener('wheel', function(event) {
            // Prevent the default scroll behavior
            event.preventDefault();

            // Check if the wheel is scrolling up or down
            if (event.deltaY > 0 || event.deltaX > 0) {
                console.log('Scrolling right or down via mouse wheel');
                scrollByScreenWidth(-1); // Scroll right (forward)
            } else {
                console.log('Scrolling left or up via mouse wheel');
                scrollByScreenWidth(1); // Scroll left (backward)
            }
        }, { passive: false });

        // Variables for touch swipe detection
        let touchStartX = 0;
        let touchEndX = 0;

        // Touch start event listener
        document.addEventListener('touchstart', function(event) {
            touchStartX = event.changedTouches[0].screenX;
        });

        // Touch move event listener
        document.addEventListener('touchmove', function(event) {
            // Prevent default touch scrolling
            event.preventDefault();
        }, { passive: false });

        // Touch end event listener (detect swipe direction)
        document.addEventListener('touchend', function(event) {
            touchEndX = event.changedTouches[0].screenX;

            // If the swipe was long enough, trigger the appropriate page turn
            if (touchEndX - touchStartX > 50) {
                console.log('Swiped right via touch');
                scrollByScreenWidth(1); // Scroll right (forward)
            } else if (touchStartX - touchEndX > 50) {
                console.log('Swiped left via touch');
                scrollByScreenWidth(-1); // Scroll left (backward)
            }
        });
    }

    // Function to scroll the page by one screen width (can be modified for height or both)
    function scrollByScreenWidth(direction) {
        const width = window.outerWidth; // Get the total window width including scrollbar
        console.log(`Scrolling by width: ${direction * width}px`);
        window.scrollBy({
            left: direction * width,
            behavior: 'auto' 
        });
    }

    // Expose the initNavigation function to be called externally
    window.initNavigation = initNavigation;
})();
