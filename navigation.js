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
        calculateTotalPages();
        updateCurrentPage();

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

        let swipeTimer = null;
        let swipeDirection = 0; // 1 for forward, -1 for backward
        let swipeStartX = 0, swipeStartY = 0;
        const baseInterval = 700; // base interval in ms
        const minInterval = 150;  // fastest possible interval
        const threshold = 50;     // minimum swipe distance to start paging
        const scaleFactor = 0.15;  // each additional pixel reduces interval by 0.2ms
        let dynamicInterval = baseInterval;

        document.addEventListener('touchstart', function(event) {
            const touch = event.changedTouches[0];
            swipeStartX = touch.screenX;
            swipeStartY = touch.screenY;
            swipeDirection = 0;
            dynamicInterval = baseInterval;
            if (swipeTimer) {
                clearInterval(swipeTimer);
                swipeTimer = null;
            }
        }, { passive: false });

        document.addEventListener('touchmove', function(event) {
            event.preventDefault();
            const touch = event.changedTouches[0];
            const deltaX = touch.screenX - swipeStartX;
            const deltaY = touch.screenY - swipeStartY;

            // Use the dominant axis (horizontal vs vertical)
            const distance = (Math.abs(deltaX) >= Math.abs(deltaY))
                             ? Math.abs(deltaX)
                             : Math.abs(deltaY);

            if (distance > threshold && swipeDirection === 0) {
                // Determine swipe direction based on dominant axis
                swipeDirection = (Math.abs(deltaX) >= Math.abs(deltaY))
                    ? (deltaX > 0 ? -1 : 1)
                    : (deltaY > 0 ? -1 : 1);
                // Trigger one page turn immediately
                scrollByContainerWidth(swipeDirection);

                // Calculate interval using the scaling factor
                let effectiveDistance = distance - threshold;
                dynamicInterval = Math.max(minInterval, baseInterval - (effectiveDistance * scaleFactor));

                swipeTimer = setInterval(() => {
                    scrollByContainerWidth(swipeDirection);
                }, dynamicInterval);
            } else if (swipeTimer) {
                // Recalculate interval if the swipe distance changes
                let effectiveDistance = distance - threshold;
                let newInterval = Math.max(minInterval, baseInterval - (effectiveDistance * scaleFactor));
                if (newInterval !== dynamicInterval) {
                    clearInterval(swipeTimer);
                    dynamicInterval = newInterval;
                    swipeTimer = setInterval(() => {
                        scrollByContainerWidth(swipeDirection);
                    }, dynamicInterval);
                }
            }
        }, { passive: false });

        document.addEventListener('touchend', function() {
            if (swipeTimer) {
                clearInterval(swipeTimer);
                swipeTimer = null;
            }
            swipeDirection = 0;
        });

        // Add an event listener to trigger page calculation on viewport resize
        window.addEventListener('resize', calculateTotalPages);

        // Delay the initial calculateTotalPages call to ensure all elements are ready
        setTimeout(calculateTotalPages, 100);
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

    // Function to calculate total pages and extender width
    function calculateTotalPages() {
        const container = document.getElementById('scroll-container');
        const extender = document.getElementById('extender');
        const endOfArticle = document.getElementById('end-of-article');

        if (container && endOfArticle) {
            const width = container.clientWidth;

            // Calculate the rightmost point of end-of-article relative to the container
            const endRect = endOfArticle.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const endRight = endRect.right - containerRect.left - 10; // Deduct 10px

            // Calculate total pages
            const totalPages = Math.ceil((endRight + 10) / width);

            // Calculate remaining space after the last column
            const remainingSpace = (totalPages * width) - (endRight + 10);

            if (extender) {
                if (remainingSpace < 30) {
                    extender.style.display = 'none';
                } else {
                    extender.style.display = 'block';
                    extender.style.width = `${remainingSpace}px`;
                    extender.style.height = '1px';
                }
            }

            console.log(`Total pages: ${totalPages}`);
            console.log(`Container width: ${width}`);
            console.log(`Rightmost point of end-of-article (after deduction): ${endRight}`);
            console.log(`Remaining space to fill: ${remainingSpace}`);

            // Update pagination display with total pages
            updatePaginationDisplay(totalPages);
        }
    }

    // Function to update pagination display with total pages
    function updatePaginationDisplay(totalPages) {
        const pagination = document.getElementById('pagination');
        if (pagination) {
            pagination.textContent = `1 / ${totalPages}`;
        }
    }

    // Function to update the current page number
    function updateCurrentPage() {
        const pagination = document.getElementById('pagination');
        const container = document.getElementById('scroll-container');

        if (container) {
            const width = container.clientWidth;
            const scrollLeft = window.scrollX;

            // Calculate current page
            const currentPage = Math.round((scrollLeft + 10) / width) + 1;

            // Update pagination display with current page
            if (pagination) {
                const totalPages = parseInt(pagination.textContent.split(' / ')[1]);
                pagination.textContent = ``${{currentPage} /}$`{totalPages}`;
            }

            console.log(`Current page: ${currentPage}`);
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
            const rect = container.getBoundingClientRect();
            const width = rect.width; // Get a floating-point number for width
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
                updateCurrentPage(); // Update current page after scrolling
            }
        }
    }

    // Expose the initNavigation function to be called externally
    window.initNavigation = initNavigation;

    // Trigger initNavigation as soon as the DOM is ready (DOMContentLoaded)
    document.addEventListener('DOMContentLoaded', initNavigation);
})();
