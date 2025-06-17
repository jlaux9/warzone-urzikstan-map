    // script.js

    // Ensure the DOM is fully loaded before running the script
    document.addEventListener('DOMContentLoaded', () => {
        // Get references to key DOM elements
        const mapContainer = document.getElementById('mapContainer');
        const urzikstanMap = document.getElementById('urzikstanMap');
        const popupOverlay = document.getElementById('popupOverlay');
        const popupTitle = document.getElementById('popupTitle');
        const popupInfo = document.getElementById('popupInfo');
        const popupClose = document.getElementById('popupClose');

        /**
         * Helper function to debounce an event listener.
         * Prevents a function from being called too many times in a short period.
         * @param {Function} func The function to debounce.
         * @param {number} delay The delay in milliseconds.
         * @returns {Function} The debounced function.
         */
        const debounce = (func, delay = 150) => {
            let timeoutId;
            return (...args) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                }, delay);
            };
        };

        // Define an array of key locations with their relative coordinates (percentages)
        // and the information to display in the popup.
        // 'x' and 'y' are percentages (0-100) from the top-left corner of the map image.
        // 'colorClass' specifies an additional CSS class for custom colors.
        // If 'colorClass' is omitted, the default '.pinpoint' style (red) will be used.
        const locations = [
            {
                name: "Bunker 1",
                x: 20,
                y: 72,
                info: "<strong>Code:</strong> 04222021",
                colorClass: 'pinpoint-orange' // This pinpoint will be orange
            },
            {
                name: "Bunker 2",
                x: 19,
                y: 61,
                info: "<strong>Blue Access Card</strong>",
                colorClass: 'pinpoint-blue' // This pinpoint will be blue
            },
            {
                name: "Bunker 3",
                x: 19,
                y: 59,
                info: "<strong>30198805</strong>",
                colorClass: 'pinpoint-orange' // This pinpoint will be orange
            },
            {
                name: "Bunker 4",
                x: 33,
                y: 28,
                info: "<strong>Red Access Card</strong>",
                // Example: No explicit colorClass here to demonstrate default red
            },
            {
                name: "Bunker 5",
                x: 47,
                y: 31,
                info: "<strong>Red Access Card</strong>",
            },
            {
                name: "Bunker 6",
                x: 77,
                y: 37,
                info: "<strong>Red Access Card</strong>",
            },
            {
                name: "Bunker 7",
                x: 70,
                y: 50.5,
                info: "<strong>Blue Access Card</strong>",
                colorClass: 'pinpoint-blue' // This pinpoint will be blue
                // No colorClass here
            },
            {
                name: "Bunker 8",
                x: 70,
                y: 48.5,
                info: "<strong>Blue Access Card</strong>",
                colorClass: 'pinpoint-blue' // This pinpoint will be blue
            },
            {
                name: "Bunker 9",
                x: 59,
                y: 81,
                info: "<strong>Red Access Card</strong>",
                // No colorClass here
            },
            {
                name: "Bunker 10",
                x: 82,
                y: 81,
                info: "<strong>31547206</strong>",
                colorClass: 'pinpoint-orange' // This pinpoint will be orange
            },
            {
                name: "Bunker 11",
                x: 42,
                y: 20,
                info: "<strong>Locate a red phone that provides a sequence of three numbers spoken in Russian. These numbers must then be translated into English. If the phone disconnects during interaction, it’s an incorrect one, and players will need to search for a different red phone elsewhere on the map</strong>",
                // No colorClass here
            }
        ];

        /**
         * Creates and positions pinpoint markers on the map based on the defined locations.
         * This function is called initially and whenever the window is resized to ensure responsiveness.
         */
        const createPinpoints = () => {
            // Remove any existing pinpoints to prevent duplicates when resizing
            document.querySelectorAll('.pinpoint').forEach(pin => pin.remove());

            // Get the current rendered dimensions of the map image
            const mapWidth = urzikstanMap.offsetWidth;
            const mapHeight = urzikstanMap.offsetHeight;

            // Iterate over each location and create a corresponding pinpoint
            locations.forEach((location, index) => {
                // Calculate the pixel position of the pinpoint based on its percentage coordinates
                const posX = (location.x / 100) * mapWidth;
                const posY = (location.y / 100) * mapHeight;

                // Create a new div element for the pinpoint
                const pinpoint = document.createElement('div');
                pinpoint.classList.add('pinpoint'); // Always add the base styling class first

                // Add the specific color class if defined for this location
                if (location.colorClass) {
                    pinpoint.classList.add(location.colorClass);
                }

                pinpoint.style.left = `${posX}px`; // Set horizontal position
                pinpoint.style.top = `${posY}px`;   // Set vertical position
                pinpoint.dataset.index = index; // Store the index to easily retrieve location data later

                // Add a small number to the pinpoint for visual identification
                pinpoint.textContent = index + 1;

                // Attach a click event listener to each pinpoint
                pinpoint.addEventListener('click', () => handlePinClick(location));

                // Append the newly created pinpoint to the map container
                mapContainer.appendChild(pinpoint);
            });
        };

        /**
         * Handles the click event on a pinpoint.
         * Populates the popup with location data and displays it.
         * @param {object} locationData - The data object for the clicked location.
         */
        const handlePinClick = (locationData) => {
            popupTitle.innerHTML = locationData.name; // Set the title of the popup
            popupInfo.innerHTML = locationData.info;   // Set the information content of the popup
            popupOverlay.classList.add('active');      // Add 'active' class to show the popup (CSS handles visibility)
        };

        /**
         * Closes the popup by removing the 'active' class from the overlay.
         */
        const closePopup = () => {
            popupOverlay.classList.remove('active'); // Remove 'active' class to hide the popup
        };

        // Add event listener for the popup close button
        popupClose.addEventListener('click', closePopup);

        // Add event listener to close the popup when clicking anywhere on the overlay
        // that is *not* the popup content itself.
        popupOverlay.addEventListener('click', (event) => {
            if (event.target === popupOverlay) { // Check if the click was directly on the overlay
                closePopup();
            }
        });

        /**
         * Handles resizing of the map and re-positions all pinpoints accordingly.
         * This ensures the pinpoints remain correctly placed on different screen sizes.
         */
        const handleResize = () => {
            // Only proceed if the map image has finished loading and has valid dimensions.
            // This prevents errors if the image hasn't rendered yet.
            if (urzikstanMap.offsetWidth > 0 && urzikstanMap.offsetHeight > 0) {
                createPinpoints(); // Recreate all pinpoints with new dimensions
            }
        };

        // Set up an event listener for when the map image has fully loaded.
        // This is crucial for initial positioning of pinpoints.
        urzikstanMap.onload = handleResize;

        // Add a global resize listener to the window, DEBOUNCED for performance.
        // This will trigger pinpoint re-positioning whenever the browser window size changes.
        window.addEventListener('resize', debounce(handleResize));

        // Edge case: If the image is already in the browser's cache, the 'onload' event might not fire.
        // In this scenario, we manually call handleResize to ensure pinpoints are created.
        if (urzikstanMap.complete) {
            handleResize();
        }
    });
    
