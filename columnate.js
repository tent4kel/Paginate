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

    var MakeReadable = function() {
    // Ensure helper scripts are loaded
    if (typeof UnfoldSections === 'undefined' || 
        typeof LoadAllImages === 'undefined' || 
        typeof CleanHTML === 'undefined' || 
        typeof getHeroImage === 'undefined') {
        console.error('Helper scripts not loaded.');
        return;
    }

    UnfoldSections(document);
    LoadAllImages(document);

    var doclone = document.cloneNode(true);
    CleanHTML(doclone);

    try {
        var article = new Readability(doclone).parse();
        var heroImageSrc = getHeroImage(document, article);

        var htmltag = document.getElementsByTagName("html")[0];
        htmltag.removeAttribute("class");
        htmltag.removeAttribute("style");

        document.head.innerHTML = "";
        var metaTag = document.createElement('meta');
        metaTag.name = 'viewport';
        metaTag.content = 'width=device-width, initial-scale=1.0, user-scalable=no';
        document.head.appendChild(metaTag);

        LoadStylesheet('//paginate-wip.netlify.app/columnate.css');
        LoadStylesheet('//paginate-wip.netlify.app/appearance.css');

        SetColorScheme();
        document.title = article.title;

        document.body.removeAttribute("class");
        document.body.removeAttribute("style");

        //var heroImageHTML = heroImageSrc ? "<img src='" + heroImageSrc + "' alt='Hero Image'>" : "";
        var heroImageHTML = "<img src='https://www.golem.de/2502/192969-491790-491789_rc.jpg' alt='Hero Image'>"; 
        document.body.innerHTML = heroImageHTML + "<h1 id='article-title'>" + article.title + "</h1><h2 id='article-byline'>" + article.byline + "</h2><h3 id='article-excerpt'>" + article.excerpt + "</h3>" + article.content;

        if (heroImageSrc) {
            console.log('Hero image source:', heroImageSrc);
        } else {
            console.log('No hero image found.');
        }

        console.log('Document made readable and styles applied.');

        loadNavigationScript();
    } catch (error) {
        console.error('Error parsing document with Readability:', error);
    }
};

    var loadNavigationScript = function() {
        var navScript = document.createElement('script');
        navScript.type = 'text/javascript';
        navScript.src = '//paginate-wip.netlify.app/navigation.js';
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

    var loadHelperScripts = function(callback) {
        var helperScript = document.createElement('script');
        helperScript.type = 'text/javascript';
        helperScript.src = '//paginate-wip.netlify.app/helper-scripts.js';
        helperScript.onload = callback;
        helperScript.onerror = function() {
            console.error('Failed to load helper-scripts.js');
        };
        document.getElementsByTagName('head')[0].appendChild(helperScript);
    };

    var cmjs = document.createElement('script');
    cmjs.type = 'text/javascript';
    cmjs.src = '//paginate-wip.netlify.app/Readability.js';
    cmjs.onreadystatechange = function() { if (cmjs.readyState === 'complete') loadHelperScripts(MakeReadable); };
    cmjs.onload = function() { loadHelperScripts(MakeReadable); };
    cmjs.onerror = function() {
        console.error('Failed to load Readability.js');
    };
    document.getElementsByTagName('head')[0].appendChild(cmjs);
    console.log('Readability script loading initiated.');
}
