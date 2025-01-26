(function() {
    function initNavigation() {
        console.log('navigation.js loaded and ready!');

        // Wrap content into a container div
        wrapContent();

        // Append end of article div
        appendEndOfArticleDiv();

        // Ensure the document is focused to capture key presses
        window.focus();

        // Attach a keydown event listener to the whole document
        document.addEventListener('keydown', function(event) {
            console.log(`Key pressed: ${event.key}`);
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === 'PageDown') {
                event.preventDefault(); // Prevent default scrolling
                console.log('Scrolling right or down via key press');
                scrollByContainerWidth(1);
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'PageUp') {
                event.preventDefault(); // Prevent default scrolling
                console.log('Scrolling left or up via key press');
                scrollByContainerWidth(-1);
            }
        });

        // Optional: Event listener for a custom button press (e.g., a specific button click)
        const button = document.getElementById('scroll-button'); // Assume you have a button with id 'scroll-button'
        if (button) {
            button.addEventListener('click', function() {
                console.log('Custom button clicked, scrolling right');
                scrollByContainerWidth(1);
            });
        }

        let canScroll = true;

        document.addEventListener('wheel', function(event) {
            if (!canScroll) return;

            // Prevent the default scroll behavior
            event.preventDefault();
            
            // Check if the wheel is scrolling up or down
            if (event.deltaY > 0 || event.deltaX > 0) {
                console.log('Scrolling right or down via mouse wheel');
                scrollByContainerWidth(1); // Scroll right (forward)
            } else {
                console.log('Scrolling left or up via mouse wheel');
                scrollByContainerWidth(-1); // Scroll left (backward)
            }

            // Set canScroll to false to start the cooldown
            canScroll = false;

            // Reset canScroll after 500ms
            setTimeout(() => {
                canScroll = true;
            }, 200);
        }, { passive: false });

        // Variables for touch swipe detection
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;

        // Touch start event listener
        document.addEventListener('touchstart', function(event) {
            touchStartX = event.changedTouches[0].screenX;
            touchStartY = event.changedTouches[0].screenY;
        });

        // Touch move event listener
        document.addEventListener('touchmove', function(event) {
            // Prevent default touch scrolling
            event.preventDefault();
        }, { passive: false });

        // Touch end event listener (detect swipe direction)
        document.addEventListener('touchend', function(event) {
            touchEndX = event.changedTouches[0].screenX;
            touchEndY = event.changedTouches[0].screenY;

            // If the swipe was long enough, trigger the appropriate page turn
            if (touchEndX - touchStartX > 50) {
                console.log('Swiped right via touch');
                scrollByContainerWidth(-1); // Scroll right (forward)
            } else if (touchStartX - touchEndX > 50) {
                console.log('Swiped left via touch');
                scrollByContainerWidth(1); // Scroll left (backward)
            } else if (touchEndY - touchStartY > 50) {
                console.log('Swiped down via touch');
                scrollByContainerWidth(-1); // Scroll down (forward)
            } else if (touchStartY - touchEndY > 50) {
                console.log('Swiped up via touch');
                scrollByContainerWidth(1); // Scroll up (backward)
            }
        });

        // Function to wrap all content into a container div
        function wrapContent() {
            const content = document.body.innerHTML;
            const container = document.createElement('div');
            container.id = 'scroll-container';
            container.innerHTML = content;
            document.body.innerHTML = '';
            document.body.appendChild(container);
        }

        // Function to append end of article div
        function appendEndOfArticleDiv() {
            const container = document.getElementById('scroll-container');
            if (container) {
                const endDiv = document.createElement('div');
                endDiv.id = 'end-of-article';
                endDiv.innerHTML = `
                    <hr>
                    <p>End of Article</p>
                    <button id="go-back-button">Go Back</button>
                    <button id="close-tab-button">Close Tab</button>
                `;
                container.appendChild(endDiv);

                // Attach event listeners to the buttons
                document.getElementById('go-back-button').addEventListener('click', function() {
                    window.history.back();
                });

                document.getElementById('close-tab-button').addEventListener('click', function() {
                    window.close();
                });
            }
        }

        // Function to scroll the container by its width
        function scrollByContainerWidth(direction) {
            const container = document.getElementById('scroll-container');
            if (container) {
                const width = container.clientWidth; // Get the container width
                console.log(`Scrolling by container width: ${direction * width}px`);
                window.scrollBy({
                    left: direction * width,
                    behavior: 'auto' 
                });
            }
        }

        // Resize images based on their natural size (150% max scale)
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Wait for the image to fully load before processing
            img.addEventListener('load', function() {
                const originalWidth = img.naturalWidth;
                const originalHeight = img.naturalHeight;

                // Check that we actually have valid dimensions
                if (originalWidth > 0 && originalHeight > 0) {
                    // Calculate the maximum allowed size (150% of the original size)
                    const maxWidth = originalWidth * 1.5;
                    const maxHeight = originalHeight * 1.5;
                    
                    // Apply the max width and max height
                    img.style.maxWidth = `${maxWidth}px`;
                    img.style.maxHeight = `${maxHeight}px`;

                    // Make sure the image is responsive but does not exceed the calculated limits
                    img.style.width = '100%';
                    img.style.height = 'auto';

                    // Logging
                    console.log(`Image resized: originalWidth=${originalWidth}, originalHeight=${originalHeight}, maxWidth=${maxWidth}, maxHeight=${maxHeight}`);
                }
            });

            // If the image is already loaded (in case it’s cached), we can process it immediately
            if (img.complete) {
                const originalWidth = img.naturalWidth;
                const originalHeight = img.naturalHeight;
                if (originalWidth > 0 && originalHeight > 0) {
                    const maxWidth = originalWidth * 1.5;
                    const maxHeight = originalHeight * 1.5;
                    img.style.maxWidth = `${maxWidth}px`;
                    img.style.maxHeight = `${maxHeight}px`;
                    img.style.width = '100%';
                    img.style.height = 'auto';
                    console.log(`Image resized: originalWidth=${originalWidth}, originalHeight=${originalHeight}, maxWidth=${maxWidth}, maxHeight=${maxHeight}`);
                }
            }
        });
    }

    // Expose the initNavigation function to be called externally
    window.initNavigation = initNavigation;

    // Trigger initNavigation as soon as the DOM is ready (DOMContentLoaded)
    document.addEventListener('DOMContentLoaded', initNavigation);
})();
