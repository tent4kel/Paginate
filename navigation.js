(function() {
    // Check if the document is ready
    document.addEventListener('DOMContentLoaded', function() {
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