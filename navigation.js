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
                scrollByBodyWidth(1);
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                event.preventDefault(); // Prevent default scrolling
                console.log('Scrolling left via key press');
                scrollByBodyWidth(-1);
            }
        });

        // Optional: Event listener for a custom button press (e.g., a specific button click)
        const button = document.getElementById('scroll-button'); // Assume you have a button with id 'scroll-button'
        if (button) {
            button.addEventListener('click', function() {
                console.log('Custom button clicked, scrolling right');
                scrollByBodyWidth(1);
            });
        }

        // Mouse wheel event listener for page turns
        document.addEventListener('wheel', function(event) {
            // Prevent the default scroll behavior
            event.preventDefault();

            // Check if the wheel is scrolling up or down
            if (event.deltaY > 0 || event.deltaX > 0) {
                console.log('Scrolling right or down via mouse wheel');
                scrollByBodyWidth(1); // Scroll right (forward)
            } else {
                console.log('Scrolling left or up via mouse wheel');
                scrollByBodyWidth(-1); // Scroll left (backward)
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
                scrollByBodyWidth(1); // Scroll right (forward)
            } else if (touchStartX - touchEndX > 50) {
                console.log('Swiped left via touch');
                scrollByBodyWidth(-1); // Scroll left (backward)
            }
        });
    }

    // Function to scroll the page by one screen width (can be modified for height or both)
    function scrollByBodyWidth(direction) {
        const body = document.body;
        const bodyWidth = body.offsetWidth; // Get the body width
        const computedStyles = getComputedStyle(body);
        
        const columnWidth = parseFloat(computedStyles.columnWidth); // Get the column width
        const columnGap = parseFloat(computedStyles.columnGap); // Get the column gap value in pixels

        console.log(`Body width: ${bodyWidth}px, Column width: ${columnWidth}px, Column gap: ${columnGap}px`);

        // Calculate the number of columns that fit within the body
        const columnsInView = Math.floor(bodyWidth / columnWidth);
        console.log(`Columns in view: ${columnsInView}`);

        // The total scroll distance is the width of a single column + gap, multiplied by the number of columns
        const scrollDistance = (columnWidth + columnGap) * columnsInView;

        console.log(`Scrolling by: ${direction * scrollDistance}px`);
        window.scrollBy({
            left: direction * scrollDistance,
            behavior: 'smooth' // Adds smooth scrolling effect
        });
    }

    // Expose the initNavigation function to be called externally
    window.initNavigation = initNavigation;
})();
