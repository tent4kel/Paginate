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

        // Add an event listener to trigger page calculation on viewport resize
        window.addEventListener('resize', updatePagination);

        // Delay the initial updatePagination call to ensure all elements are ready
        setTimeout(updatePagination, 100);
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
        `;
        container.appendChild(endDiv);

        const extender = document.createElement('div');
        extender.id = 'extender';
        container.appendChild(extender);

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


function updatePagination() {
    const pagination = document.getElementById('pagination');
    const container = document.getElementById('scroll-container');
    const extender = document.getElementById('extender');
    const endOfArticle = document.getElementById('end-of-article');

    if (container && endOfArticle) {
        const width = container.clientWidth;
        const scrollLeft = window.scrollX;

        // Calculate the rightmost point of end-of-article relative to the container
        const endRect = endOfArticle.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const endRight = endRect.right - containerRect.left - 10; // Deduct 10px

        // Calculate total pages
        const totalPages = Math.ceil((endRight + 10) / width);

        // Calculate current page
        const currentPage = Math.round((scrollLeft + 10) / width) + 1;

        // Update pagination display
        if (pagination) {
            pagination.textContent = `${currentPage} / ${totalPages}`;
        }

        // Calculate extender width to align with totalPages
        const nextMultiple = totalPages * width;
        let additionalWidth = nextMultiple - endRight;

        if (extender) {
            if (additionalWidth < 30) {
                extender.style.display = 'none';
            } else {
                extender.style.display = 'block';
                extender.style.width = `${additionalWidth}px`;
                extender.style.height = '1px';
            }
        }

        console.log(`Total pages: ${totalPages}`);
        console.log(`Current page: ${currentPage}`);
        console.log(`Container width: ${width}`);
        console.log(`Rightmost point of end-of-article (after deduction): ${endRight}`);
        console.log(`Next multiple of container width: ${nextMultiple}`);
        console.log(`Extender width (to align with next column): ${additionalWidth}`);
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

function scrollByContainerWidth(direction) {
    const container = document.getElementById('scroll-container');
    const scrollBackButton = document.getElementById('scroll-back-button');
    if (container) {
        const width = container.clientWidth; // Get the container width
        const currentPage = Math.round(window.scrollX / width);
        const newScrollLeft = (currentPage + direction) * width;

        if (direction > 0 && scrollBackButton && isElementInViewport(scrollBackButton)) {
            console.log('Scroll-back button is in the viewport, scroll prevented.');
        } else {
            console.log(`Scrolling by container width: ${direction * width}px`);
            window.scrollTo({
                left: newScrollLeft,
                behavior: 'auto'
            });
            updatePagination(); // Update pagination after scrolling
        }
    }
}


    // Expose the initNavigation function to be called externally
    window.initNavigation = initNavigation;

    // Trigger initNavigation as soon as the DOM is ready (DOMContentLoaded)
    document.addEventListener('DOMContentLoaded', initNavigation);
})();
