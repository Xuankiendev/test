(function() {
    var pageUrl = window.location.href;
    var storageKey = 'pageViewCounter_' + btoa(pageUrl).replace(/[^a-zA-Z0-9]/g, '');
    
    function getPageViews() {
        try {
            return parseInt(localStorage.getItem(storageKey)) || 0;
        } catch(e) {
            return 0;
        }
    }
    
    function incrementPageViews() {
        try {
            var currentViews = getPageViews();
            var newViews = currentViews + 1;
            localStorage.setItem(storageKey, newViews);
            return newViews;
        } catch(e) {
            return 1;
        }
    }
    
    function showPageViewAlert() {
        var viewCount = incrementPageViews();
        alert('Page View: ' + viewCount);
    }
    
    var originalFetch = window.fetch;
    window.fetch = function() {
        showPageViewAlert();
        return originalFetch.apply(this, arguments);
    };
    
    var originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        showPageViewAlert();
        return originalXhrOpen.apply(this, arguments);
    };
    
    if (typeof jQuery !== 'undefined') {
        var originalAjax = jQuery.ajax;
        jQuery.ajax = function() {
            showPageViewAlert();
            return originalAjax.apply(this, arguments);
        };
    }
    
    if (typeof axios !== 'undefined') {
        axios.interceptors.request.use(function(config) {
            showPageViewAlert();
            return config;
        });
    }
    
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    var node = mutation.addedNodes[i];
                    if (node.nodeType === 1) {
                        if (node.tagName === 'SCRIPT' || node.tagName === 'IMG' || node.tagName === 'IFRAME') {
                            showPageViewAlert();
                            break;
                        }
                    }
                }
            }
        });
    });
    
    observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true
    });
    
    ['load', 'beforeunload', 'hashchange', 'popstate'].forEach(function(eventType) {
        window.addEventListener(eventType, showPageViewAlert);
    });
    
    var originalPushState = history.pushState;
    history.pushState = function() {
        showPageViewAlert();
        return originalPushState.apply(this, arguments);
    };
    
    var originalReplaceState = history.replaceState;
    history.replaceState = function() {
        showPageViewAlert();
        return originalReplaceState.apply(this, arguments);
    };
    
    showPageViewAlert();
})();
