(function() {
    function initNavigation() {
        console.log('navigation.js loaded and ready!');

        
        // Wrap content into a container div
        wrapContent();

        // Inject pagination div
        injectPaginationDiv();

        // Append end of article div
        appendEndOfArticleDiv();

        // Ensure the document is focused to capture key presses
        window.focus();

        // Update pagination initially
        updatePagination();

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
    }

    // Function to inject pagination div
    function injectPaginationDiv() {
        const paginationDiv = document.createElement('div');
        paginationDiv.id = 'pagination';
        paginationDiv.textContent = '1 / 1';
        document.body.insertBefore(paginationDiv, document.body.firstChild);
    }

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
                <button id="go-back-button">Go Back</button>
                <button id="scroll-back-button">Scroll Back</button>
                <div id='extender'>1</div><div id='extender'>2</div><div id='extender'>3</div><div id='extender'>4</div>
            `;
            container.appendChild(endDiv);

            // Attach event listeners to the buttons
            document.getElementById('go-back-button').addEventListener('click', function() {
                window.history.back();
            });

            document.getElementById('scroll-back-button').addEventListener('click', function() {
                window.scrollTo({
                    left: 0,  // Scroll to the far left
                });
            });
        }
    }

    // Function to calculate the total number of pages
    function calculateTotalPages() {
        const container = document.getElementById('scroll-container');
        const scrollBackButton = document.getElementById('scroll-back-button');
        if (container && scrollBackButton) {
            const width = container.clientWidth; // Get the container width
            const buttonRect = scrollBackButton.getBoundingClientRect(); // Get the position of the scroll-back-button
            const buttonPosition = buttonRect.left + window.scrollX; // Calculate the button's position relative to the document
            const totalPages = Math.ceil((buttonPosition + 10) / width); // Calculate total pages with tolerance
            console.log(`Total pages: ${totalPages}`);
            return totalPages;
        }
        return 0;
    }

    // Function to calculate the current page based on scroll position and container width
    function calculateCurrentPage() {
        const container = document.getElementById('scroll-container');
        if (container) {
            const width = container.clientWidth; // Get the container width
            const scrollLeft = window.scrollX; // Get the current scroll position of the window
            console.log(`Container width: ${width}, Scroll left: ${scrollLeft}`);
            const page = Math.round((scrollLeft + 10) / width) + 1;
            console.log(`Current page: ${page}`);
            return page;
        }
        return 0;
    }

    // Function to update the pagination display
    function updatePagination() {
        const pagination = document.getElementById('pagination');
        if (pagination) {
            const currentPage = calculateCurrentPage();
            const totalPages = calculateTotalPages();
            pagination.textContent = `${currentPage} / ${totalPages}`;
        }
    }

    // Function to check if an element is in the viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Function to scroll the container by its width
    function scrollByContainerWidth(direction) {
        const container = document.getElementById('scroll-container');
        const scrollBackButton = document.getElementById('scroll-back-button');
        if (container) {
            const width = container.clientWidth; // Get the container width
            if (direction > 0 && scrollBackButton && isElementInViewport(scrollBackButton)) {
                console.log('Scroll-back button is in the viewport, scroll prevented.');
            } else {
                console.log(`Scrolling by container width: ${direction * width}px`);
                window.scrollBy({
                    left: direction * width,
                    behavior: 'auto'
                });
                updatePagination(); // Update pagination after scrolling
            }
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

    // Expose the initNavigation function to be called externally
    window.initNavigation = initNavigation;

    // Trigger initNavigation as soon as the DOM is ready (DOMContentLoaded)
    document.addEventListener('DOMContentLoaded', initNavigation);
})();