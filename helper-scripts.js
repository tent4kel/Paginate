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

var UnfoldSections = function(doc) {
    try {
        var hiddenElements = doc.querySelectorAll('[hidden="until-found"]');
        for (var i = 0; i < hiddenElements.length; i++) {
            hiddenElements[i].removeAttribute('hidden');
            console.log('Removed hidden="until-found" attribute:', hiddenElements[i]);
        }

        var collapsibleToggles = doc.getElementsByClassName("mw-collapsible-toggle-collapsed");
        for (var j = 0; j < collapsibleToggles.length; j++) {
            var toggle = collapsibleToggles[j];
            if (toggle.childNodes[1] && typeof toggle.childNodes[1].click === "function") {
                toggle.childNodes[1].click();
                console.log("Clicked to expand a collapsible section:", toggle);
            }
        }

        var unfoldSelectors = [
            '.collapse',
            '.expandable',
            '[aria-expanded="false"]' 
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
       // img.src = img.src;
    });
    console.log('All images set to load eagerly.');
};

var LoadMissingImages = function(doc) {
    var images = doc.querySelectorAll('img[data-src], img[srcset]');
    images.forEach(function(img) {
        var largestSrc = img.getAttribute('data-src');
        if (img.hasAttribute('srcset')) {
            var srcset = img.getAttribute('srcset').split(',').map(function(item) {
                var parts = item.trim().split(' ');
                return {
                    url: parts[0],
                    resolution: parseFloat(parts[1].replace('x', ''))
                };
            });
            srcset.sort(function(a, b) {
                return b.resolution - a.resolution;
            });
            largestSrc = srcset[0].url;
        }
        img.setAttribute('src', largestSrc);
        img.setAttribute('loading', 'eager');
    });
    console.log('All missing images set to load with the largest variant.');
};




var getHeroImage = function(document) {
    console.log('Starting hero image extraction.');
    var images = document.querySelectorAll('img:not([src$=".svg"])');
    var heroImage = null;

    var largeDimensions = { width: 600, height: 300 };
    var prominentClasses = ['hero', 'featured', 'main-image'];
    var descriptiveAltKeywords = ['article', 'hero'];
    var exclusionClasses = ['logo', 'icon', 'thumbnail', 'header', 'footer', 'sidebar'];
    var exclusionPatterns = ['logo', 'icon', 'thumbnail', 'doubleclick'];

    var candidates = Array.from(images).map(function(img) {
        var width = img.naturalWidth;
        var height = img.naturalHeight;
        var altText = img.alt.toLowerCase();
        var src = img.src.toLowerCase();
        var className = img.className.toLowerCase();
        var id = img.id.toLowerCase();

        var isLarge = width > largeDimensions.width && height > largeDimensions.height;
        var isProminent = prominentClasses.some(function(cls) { return className.includes(cls) || id.includes(cls); });
        var hasDescriptiveAlt = descriptiveAltKeywords.some(function(keyword) { return altText.includes(keyword); }) || altText.length > 10;

        var isSmall = width < 300 || height < 200;
        var isRepetitive = exclusionPatterns.some(function(pattern) { return src.includes(pattern); });
        var isInNonContentArea = exclusionClasses.some(function(cls) { return className.includes(cls); });
        var isSVG = src.startsWith('data:image/svg+xml');

        var passCount = (isLarge ? 1 : 0) + (isProminent ? 1 : 0) + (hasDescriptiveAlt ? 1 : 0);
        var failCount = (isSmall ? 1 : 0) + (isRepetitive ? 1 : 0) + (isInNonContentArea ? 1 : 0) + (isSVG ? 1 : 0);

        console.log('Image analysis:', { src: img.src, width: width, height: height, altText: altText, className: className, id: id, isLarge: isLarge, isProminent: isProminent, hasDescriptiveAlt: hasDescriptiveAlt });

        return { img: img, passCount: passCount, failCount: failCount };
    });

    candidates = candidates.filter(function(candidate) { return candidate.failCount === 0; });
    candidates.sort(function(a, b) { return b.passCount - a.passCount; });

    if (candidates.length > 0) {
        heroImage = candidates[0].img;
        var figure = document.createElement('figure');
        figure.classList.add('hero-figure');
        heroImage.parentNode.insertBefore(figure, heroImage);
        figure.appendChild(heroImage);

        heroImage.classList.add('hero-image', 'featured-image', 'article-image', 'main');
        console.log('Hero image classes added:', heroImage.className);

        var caption = heroImage.getAttribute('title') || "No caption available";
        var credit = heroImage.getAttribute('data-credit') || "No credit available";
        var alt = heroImage.getAttribute('alt') || "No alt text available";

        var htmlString = `<figure class="hero-figure">
                            <img src="${heroImage.src}" class="${heroImage.className}" alt="${alt}" title="${caption}" data-credit="${credit}">
                            <figcaption>${caption} - ${credit}</figcaption>
                          </figure>`;
        console.log('HTML string for hero image:', htmlString);
        return htmlString;
    } else {
        console.log('No suitable hero image found.');
    }

    console.log('Hero image extraction completed. Hero image:', heroImage ? heroImage.src : 'None');
    return null;
};

function levenshteinDistance(a, b) {
    const matrix = [];
    let i;
    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    let j;
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
            }
        }
    }

    return matrix[b.length][a.length];
}

var insertHeroImage = function(heroImageString, articleContent) {
    if (heroImageString) {
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = heroImageString;
        var heroImage = tempDiv.querySelector('img');

        var existingImages = articleContent.querySelectorAll('img');
        var alreadyPresent = Array.from(existingImages).some(function(img) {
            var srcMatch = img.src.split('?')[0] === heroImage.src.split('?')[0]; // Ignore query parameters
            var altMatch = levenshteinDistance(img.alt, heroImage.alt) < 5; // Allow slight variations
            var titleMatch = levenshteinDistance(img.title, heroImage.title) < 5; // Allow slight variations
            var dimensionsMatch = img.width === heroImage.width && img.height === heroImage.height;
            return srcMatch || (altMatch && titleMatch && dimensionsMatch);
        });

        if (!alreadyPresent) {
            document.getElementById('hero-container').innerHTML = heroImageString;
        } else {
            console.log('Hero image already present in article content, aborting insertion.');
        }
    }
};
