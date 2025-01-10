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
    }

    // Callback that will replace document content with readable version
    var MakeReadable = function() {
        var doclone = document.cloneNode(true);
        var article = new Readability(doclone).parse();
        // Strip stray styling from the html tag itself
        var htmltag = document.getElementsByTagName("html")[0];
        htmltag.removeAttribute("class");
        htmltag.removeAttribute("style");
        // Reset head to nothing but our stylesheets
        document.head.innerHTML = "";
        LoadStylesheet('//eink-reader.netlify.app/columnate.css');
        LoadStylesheet('//eink-reader.netlify.app/appearance.css');
        document.title = article.title;
        // Reset body html to nothing but reformatted content
        document.body.removeAttribute("class");
        document.body.removeAttribute("style");
        document.body.innerHTML = "<h1>" + article.title + "</h1>" + article.content;
        console.log('Document made readable and styles applied.');
        // After content is ready, load the navigation.js script
        loadNavigationScript();
    };

    // Function to load the navigation.js script
    var loadNavigationScript = function() {
        var navScript = document.createElement('script');
        navScript.type = 'text/javascript';
        navScript.src = '//eink-reader.netlify.app/navigation.js'; // Replace with actual path to navigation.js
        navScript.onload = function() {
            console.log('navigation.js loaded and ready!');
            // Call the main function of navigation.js if it has one
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
    cmjs.src = '//anoved.github.io/Columnate/readability/Readability.js';
    cmjs.onreadystatechange = MakeReadable;
    cmjs.onload = MakeReadable;
    cmjs.onerror = function() {
        console.error('Failed to load Readability.js');
    };
    document.getElementsByTagName('head')[0].appendChild(cmjs);
    console.log('Readability script loading initiated.');
}
