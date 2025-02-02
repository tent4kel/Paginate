function Columnate() {
    // Apply columnate stylesheets to document
    var LoadStylesheet = function(url) {
        var c = document.createElement('link');
        c.rel = 'stylesheet';
        c.type = 'text/css';
        c.media = 'all';
        c.href = url;
        document.getElementsByTagName('head')[0].appendChild(c);
        console.log('Stylesheet loaded: ' + url);
    };

    // Function to clean problematic attributes
    var CleanHTML = function(doc) {
        var elements = doc.querySelectorAll('*');
        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            var attributes = el.attributes;
            for (var j = attributes.length - 1; j >= 0; j--) {
                var attr = attributes[j];
                if (attr.name.indexOf('@') === 0 || attr.name.indexOf('v-') === 0 || attr.name.indexOf(':') !== -1) {
                    el.removeAttribute(attr.name);
                }
            }
        }
        console.log('HTML cleaned of problematic attributes.');
    };

    var UnfoldSections = function(doc) {
        try {
            // Remove 'hidden="until-found"' attributes
            var hiddenElements = doc.querySelectorAll('[hidden="until-found"]');
            for (var i = 0; i < hiddenElements.length; i++) {
                hiddenElements[i].removeAttribute('hidden');
                console.log('Removed hidden="until-found" attribute:', hiddenElements[i]);
            }

            // Handle Wikipedia-specific collapsible toggles
            var collapsibleToggles = doc.getElementsByClassName("mw-collapsible-toggle-collapsed");
            for (var j = 0; j < collapsibleToggles.length; j++) {
                var toggle = collapsibleToggles[j];
                if (toggle.childNodes[1] && typeof toggle.childNodes[1].click === "function") {
                    toggle.childNodes[1].click();
                    console.log("Clicked to expand a collapsible section:", toggle);
                }
            }

            // Handle other generic collapsible elements
            var unfoldSelectors = [
                '.collapse',       // Bootstrap-style collapsible content
                '.expandable',     // Generic expandable content
                '[aria-expanded="false"]' // ARIA attributes for collapsed sections
            ];

            for (var k = 0; k < unfoldSelectors.length; k++) {
                var elements = doc.querySelectorAll(unfoldSelectors[k]);
                for (var l = 0; l < elements.length; l++) {
                    var el = elements[l];
                    if (el.getAttribute('aria-expanded') === 'false') {
                        el.setAttribute('aria-expanded', 'true');
                    }
                    if (typeof el.click === 'function') {
                        el.click();
                    }
                    console.log("Expanded section:", el);
                }
            }

            console.log("Collapsible sections unfolded.");
        } catch (error) {
            console.error("Error unfolding sections:", error);
        }
    };

    // Function to force load all images
    var LoadAllImages = function(doc) {
        var images = doc.querySelectorAll('img');
        images.forEach(function(img) {
            img.setAttribute('loading', 'eager');
            img.src = img.src; // Trigger image load
        });
        console.log('All images set to load eagerly.');
    };

    // Function to set the color scheme based on the time
    var SetColorScheme = function() {
        var hour = new Date().getHours();
        var prefersDark = (hour >= 18 || hour < 6);
        if (prefersDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
        console.log('Color scheme set based on time: ' + (prefersDark ? 'dark' : 'light'));
    };

    // Callback that will replace document content with readable version
    var MakeReadable = function() {
        // Unfold collapsible sections
        UnfoldSections(document);

        // Force load all images
        LoadAllImages(document);


        var doclone = document.cloneNode(true);

        // Clean problematic attributes from the document clone
        CleanHTML(doclone);


        try {
            var article = new Readability(doclone).parse();

            // Strip stray styling from the html tag itself
            var htmltag = document.getElementsByTagName("html")[0];
            htmltag.removeAttribute("class");
            htmltag.removeAttribute("style");

            // Reset head to nothing but our stylesheets
            document.head.innerHTML = "";

            // Add the meta tag for viewport settings
            var metaTag = document.createElement('meta');
            metaTag.name = 'viewport';
            metaTag.content = 'width=device-width, initial-scale=1.0, user-scalable=no';
            document.head.appendChild(metaTag);

            // Load stylesheets
            LoadStylesheet('//paginate-reader.netlify.app/columnate.css');
            LoadStylesheet('//paginate-reader.netlify.app/appearance.css');
            // Set color scheme based on time
            SetColorScheme();
            document.title = article.title;

            // Reset body html to nothing but reformatted content
            document.body.removeAttribute("class");
            document.body.removeAttribute("style");
            document.body.innerHTML = "<h1 id='article-title'>" + article.title + "</h1><h2 id='article-byline'>" + article.byline + "</h2><h3 id='article-excerpt'>" + article.excerpt + "</h3>" + article.content;
            console.log('Document made readable and styles applied.');

            // After content is ready, load the navigation.js script
            loadNavigationScript();
        } catch (error) {
            console.error('Error parsing document with Readability:', error);
        }
    };

    // Function to load the navigation.js script
    var loadNavigationScript = function() {
        var navScript = document.createElement('script');
        navScript.type = 'text/javascript';
        navScript.src = '//paginate-reader.netlify.app/navigation.js'; // Replace with actual path to navigation.js
        navScript.onload = function() {
            console.log('navigation.js loaded and ready!');
            if (typeof initNavigation === 'function') {
                console.log('Executing initNavigation...');
                initNavigation();
            } else {
                console.log('initNavigation function not found in navigation.js');
            }
        };
        navScript.onerror = function() {
            console.error('Failed to load navigation.js');
        };
        document.getElementsByTagName('head')[0].appendChild(navScript);
    };

    // Load readability script and set it to be applied when loaded
    var cmjs = document.createElement('script');
    cmjs.type = 'text/javascript';
    cmjs.src = '//paginate-reader.netlify.app/Readability.js';
    cmjs.onreadystatechange = MakeReadable;
    cmjs.onload = MakeReadable;
    cmjs.onerror = function() {
        console.error('Failed to load Readability.js');
    };
    document.getElementsByTagName('head')[0].appendChild(cmjs);
    console.log('Readability script loading initiated.');
}
