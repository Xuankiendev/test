/**
 * Anti-Developer Tools Protection by https://dunia.it.com
 * - Detects and responds to developer tools being opened
 * - Preserves right-click functionality
 * - Shows warning message in console
 */

(function() {
    // Console warning message
    const warningMessage = `
    ⚠️ WARNING ⚠️
    
    This website is protected against unauthorized inspection.
    Any attempt to analyze, copy, or modify the code may result in service disruption.
    
    If you're a developer or security researcher, please contact us for proper authorization.
    `;
    
    // Show warning in console
    console.log(warningMessage);
    
    // Variables to track states
    let devToolsOpen = false;
    let debuggerEnabled = false;
    
    // Function to detect DevTools by console timing
    function detectDevTools() {
        const startTime = performance.now();
        
        // Using console methods triggers debugger pausing which takes time
        console.profile();
        console.profileEnd();
        
        // If devtools is open, console methods take longer than normal
        if (performance.now() - startTime > 100) {
            handleDevToolsOpen();
            return true;
        }
        
        return false;
    }
    
    // Function to handle DevTools detection
    function handleDevToolsOpen() {
        if (!devToolsOpen) {
            devToolsOpen = true;
            
            // You can customize this response:
            // Option 1: Just log a message (less intrusive)
            console.error("Developer tools detected. Some functionality may be restricted.");
            
            // Option 2: Clear local storage (moderate)
            // This could log the user out or reset app state
            // localStorage.clear();
            // sessionStorage.clear();
            
            // Option 3: Redirect (most intrusive - careful with this)
            // window.location.href = "error.html";
        }
    }
    
    // Detect DevTools via resize method (works in some browsers)
    window.addEventListener('resize', function() {
        // Check if window dimensions indicate devtools is open
        const widthThreshold = window.outerWidth - window.innerWidth > 160;
        const heightThreshold = window.outerHeight - window.innerHeight > 160;
        
        if (widthThreshold || heightThreshold) {
            handleDevToolsOpen();
        }
    });
    
    // Detect debugger usage
    function detectDebugger() {
        const start = new Date().getTime();
        debugger; // This pauses execution when debugger is open
        const end = new Date().getTime();
        
        // If debugger is active, time difference will be significant
        if (end - start > 100) {
            debuggerEnabled = true;
            console.error("Debugger detected. Please disable debugging tools.");
        }
    }
    
    // Override common developer methods and properties
    function overrideDevMethods() {
        // Make it harder to access and modify page elements
        try {
            // Override some properties that devtools might use
            Object.defineProperty(window, 'console', {
                get: function() {
                    // Still allow console, but log access
                    detectDevTools();
                    return window._console;
                }
            });
            
            // Store original console
            window._console = window.console;
            
            // Make source view more difficult
            document.addEventListener('contextmenu', function(e) {
                // Allow right-click, but detect if it's being used to inspect
                if (e.target.nodeName === 'HTML' || e.target.nodeName === 'BODY') {
                    detectDevTools();
                }
                // We don't prevent default, allowing normal right-click functionality
            });
            
            // Disable keyboard shortcuts for developer tools
            document.addEventListener('keydown', function(e) {
                // Prevent F12 key
                if (e.keyCode === 123) {
                    e.preventDefault();
                    return false;
                }
                
                // Prevent Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
                if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
                    e.preventDefault();
                    return false;
                }
                
                // Prevent Ctrl+U (view source)
                if (e.ctrlKey && e.keyCode === 85) {
                    e.preventDefault();
                    return false;
                }
            });
        } catch (err) {
            // Silent error handling
        }
    }
    
    // Self-protection mechanism to make the script harder to modify
    function obfuscateScript() {
        // Add some garbage collectors and dummy functions to confuse script analysis
        window._x = function() { return Math.random().toString(36); };
        window._y = { a: 1, b: 2, toString: function() { detectDevTools(); return ""; }};
        Object.defineProperty(window, "_z", { 
            get: function() { detectDevTools(); return Date.now(); }, 
            configurable: false 
        });
    }
    
    // Initialize protections
    function initProtection() {
        // Set up initial protections
        overrideDevMethods();
        obfuscateScript();
        
        // Periodic checks for devtools
        setInterval(detectDevTools, 1000);
        setInterval(detectDebugger, 2000);
    }
    
    // Start protection
    initProtection();
})();
