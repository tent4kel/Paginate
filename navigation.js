document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
});

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