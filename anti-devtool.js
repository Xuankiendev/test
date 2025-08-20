/**
 * Enhanced Anti-Developer Tools Protection
 * - Multi-layer detection and prevention
 * - Mobile browser support (Kiwi, etc.)
 * - Advanced obfuscation techniques
 */

(function() {
    'use strict';
    
    // Obfuscated variables
    const _0x1a2b = {
        detected: false,
        methods: [],
        intervals: [],
        counters: { attempts: 0, blocked: 0 }
    };
    
    // Advanced console detection
    function _0x3c4d() {
        const _methods = ['log', 'debug', 'info', 'warn', 'error', 'trace', 'dir', 'dirxml', 'group', 'groupEnd', 'time', 'timeEnd', 'profile', 'profileEnd', 'clear'];
        let _devtools = false;
        
        // Method 1: Console timing detection
        const _start = performance.now();
        console.profile();
        console.profileEnd();
        console.clear();
        const _end = performance.now();
        
        if (_end - _start > 100) _devtools = true;
        
        // Method 2: Console properties inspection
        let _element = new Image();
        Object.defineProperty(_element, 'id', {
            get: function() {
                _devtools = true;
                return 'devtools-detected';
            }
        });
        console.log(_element);
        
        // Method 3: toString trap
        let _func = function() {};
        _func.toString = function() {
            _devtools = true;
            return 'function() { [native code] }';
        };
        console.log('%c', _func);
        
        return _devtools;
    }
    
    // Window size detection (enhanced for mobile)
    function _0x5e6f() {
        const _threshold = window.innerWidth < 768 ? 50 : 160; // Mobile threshold
        const _widthDiff = window.outerWidth - window.innerWidth;
        const _heightDiff = window.outerHeight - window.innerHeight;
        
        // Additional mobile checks
        const _orientation = window.orientation !== undefined;
        const _mobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const _kiwi = navigator.userAgent.includes('Chrome') && _mobile;
        
        if (_kiwi || _orientation) {
            // Mobile-specific detection
            return (_widthDiff > 50 || _heightDiff > 100 || 
                   (window.innerWidth < window.screen.width * 0.8));
        }
        
        return (_widthDiff > _threshold || _heightDiff > _threshold);
    }
    
    // Advanced debugger detection
    function _0x7g8h() {
        let _detected = false;
        
        // Method 1: Multiple debugger statements with timing
        for (let i = 0; i < 3; i++) {
            const _start = Date.now();
            eval('debugger;');
            const _duration = Date.now() - _start;
            if (_duration > 100) _detected = true;
        }
        
        // Method 2: Function constructor debugger
        try {
            (function() {
                return (function() {}.constructor('debugger')());
            })();
        } catch (e) {
            _detected = true;
        }
        
        // Method 3: setInterval debugger trap
        let _intervalId = setInterval(function() {
            const _before = Date.now();
            eval('debugger;');
            const _after = Date.now();
            if (_after - _before > 100) {
                _detected = true;
                clearInterval(_intervalId);
            }
        }, 500);
        
        setTimeout(() => clearInterval(_intervalId), 1000);
        
        return _detected;
    }
    
    // Network inspection detection
    function _0x9i0j() {
        // Detect if network tab is being monitored
        const _xhr = new XMLHttpRequest();
        const _start = performance.now();
        
        _xhr.open('GET', 'data:text/plain,test', false);
        try {
            _xhr.send();
        } catch (e) {}
        
        const _duration = performance.now() - _start;
        return _duration > 50; // Network monitoring adds delay
    }
    
    // DOM manipulation detection
    function _0xklmn() {
        let _detected = false;
        
        // Create trap elements
        const _trap = document.createElement('div');
        _trap.style.display = 'none';
        _trap.innerHTML = '<span data-test="inspector-trap">test</span>';
        document.body.appendChild(_trap);
        
        // Monitor for inspection
        const _observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && 
                    mutation.target.dataset.test === 'inspector-trap') {
                    _detected = true;
                }
            });
        });
        
        _observer.observe(_trap, { attributes: true, subtree: true });
        
        setTimeout(() => {
            _observer.disconnect();
            document.body.removeChild(_trap);
        }, 1000);
        
        return _detected;
    }
    
    // Handle detection
    function _0xpqrs() {
        if (_0x1a2b.detected) return;
        
        _0x1a2b.detected = true;
        _0x1a2b.counters.blocked++;
        
        // Clear page content
        document.documentElement.innerHTML = `
            <html><head><title>Anti Developer Tool - Vũ Xuân Kiên</title></head>
            <body style="background:#000;color:#ff0000;font-family:monospace;text-align:center;padding-top:20%;">
                <h1>Chú Em Định Làm Gì Vậy 🤣</h1>
                <p>Quay Đầu Là Bờ</p>
                <p>Mau Tắt Developer Tool</p>
                <script>
                    // Prevent reload
                    window.addEventListener('beforeunload', function(e) {
                        e.preventDefault();
                        return 'Access denied';
                    });
                    // Redirect after delay
                    setTimeout(function() {
                        window.location.href = 'about:blank';
                    }, 3000);
                </script>
            </body></html>
        `;
        
        // Clear storage
        try {
            localStorage.clear();
            sessionStorage.clear();
        } catch (e) {}
        
        // Block further interactions
        window.stop && window.stop();
        throw new Error('DevTools detected - Access terminated');
    }
    
    // Override protection bypass attempts
    function _0xtuv() {
        // Protect against tampermonkey-like scripts
        
        // Override Function constructor
        const _origConstructor = Function.prototype.constructor;
        Function.prototype.constructor = new Proxy(_origConstructor, {
            apply: function(target, thisArg, args) {
                const _code = args[0] || '';
                if (_code.includes('debugger') || _code.includes('console') || 
                    _code.includes('devtools') || _code.includes('bypass')) {
                    _0xpqrs();
                    return function() {};
                }
                return Reflect.apply(target, thisArg, args);
            }
        });
        
        // Protect eval
        const _origEval = window.eval;
        window.eval = new Proxy(_origEval, {
            apply: function(target, thisArg, args) {
                const _code = args[0] || '';
                if (typeof _code === 'string' && 
                    (_code.includes('debugger') || _code.includes('bypass') || 
                     _code.includes('tampermonkey') || _code.includes('greasemonkey'))) {
                    _0xpqrs();
                    return;
                }
                return Reflect.apply(target, thisArg, args);
            }
        });
        
        // Protect against property redefinition
        const _origDefineProperty = Object.defineProperty;
        Object.defineProperty = new Proxy(_origDefineProperty, {
            apply: function(target, thisArg, args) {
                const _obj = args[0];
                const _prop = args[1];
                
                if ((_obj === window || _obj === console) && 
                    (_prop === 'outerWidth' || _prop === 'outerHeight' || 
                     _prop === 'debugger' || _prop.includes('console'))) {
                    _0xpqrs();
                    return;
                }
                return Reflect.apply(target, thisArg, args);
            }
        });
        
        // Protect against script injection
        const _origCreateElement = document.createElement;
        document.createElement = new Proxy(_origCreateElement, {
            apply: function(target, thisArg, args) {
                const _element = Reflect.apply(target, thisArg, args);
                if (args[0] === 'script') {
                    const _origSetAttribute = _element.setAttribute;
                    _element.setAttribute = function(name, value) {
                        if (name === 'src' && (value.includes('tampermonkey') || 
                            value.includes('greasemonkey') || value.includes('bypass'))) {
                            _0xpqrs();
                            return;
                        }
                        return _origSetAttribute.call(this, name, value);
                    };
                }
                return _element;
            }
        });
    }
    
    // Keyboard event blocking (enhanced)
    function _0xwxy() {
        document.addEventListener('keydown', function(e) {
            const _blocked = [
                e.keyCode === 123, // F12
                e.keyCode === 116, // F5
                (e.ctrlKey && e.shiftKey && e.keyCode === 73), // Ctrl+Shift+I
                (e.ctrlKey && e.shiftKey && e.keyCode === 74), // Ctrl+Shift+J
                (e.ctrlKey && e.shiftKey && e.keyCode === 67), // Ctrl+Shift+C
                (e.ctrlKey && e.keyCode === 85), // Ctrl+U
                (e.ctrlKey && e.keyCode === 83), // Ctrl+S
                (e.metaKey && e.altKey && e.keyCode === 73), // Cmd+Option+I (Mac)
                (e.metaKey && e.altKey && e.keyCode === 74), // Cmd+Option+J (Mac)
                (e.metaKey && e.keyCode === 85) // Cmd+U (Mac)
            ];
            
            if (_blocked.some(Boolean)) {
                e.preventDefault();
                e.stopImmediatePropagation();
                _0x1a2b.counters.attempts++;
                
                if (_0x1a2b.counters.attempts > 3) {
                    _0xpqrs();
                }
                return false;
            }
        }, true);
        
        // Block right-click on specific elements
        document.addEventListener('contextmenu', function(e) {
            if (e.ctrlKey || e.shiftKey || 
                ['HTML', 'BODY', 'DIV', 'IMG', 'VIDEO', 'CANVAS'].includes(e.target.tagName)) {
                e.preventDefault();
                return false;
            }
        }, true);
    }
    
    // Mobile-specific protections
    function _0xz123() {
        // Detect mobile devtools (Kiwi browser, etc.)
        if (/Mobile|Android|iPhone|iPad/i.test(navigator.userAgent)) {
            
            // Touch event monitoring
            let _touchCount = 0;
            document.addEventListener('touchstart', function(e) {
                _touchCount++;
                if (e.touches.length > 2) { // 3+ finger touch might indicate dev gesture
                    _0x1a2b.counters.attempts++;
                }
            });
            
            // Orientation change detection
            window.addEventListener('orientationchange', function() {
                setTimeout(function() {
                    if (_0x5e6f()) {
                        _0xpqrs();
                    }
                }, 100);
            });
            
            // Viewport manipulation detection
            let _initialViewport = {
                width: window.innerWidth,
                height: window.innerHeight
            };
            
            setInterval(function() {
                const _current = {
                    width: window.innerWidth,
                    height: window.innerHeight
                };
                
                const _widthChange = Math.abs(_current.width - _initialViewport.width);
                const _heightChange = Math.abs(_current.height - _initialViewport.height);
                
                if (_widthChange > 100 && _heightChange > 100) {
                    if (_0x5e6f()) _0xpqrs();
                }
            }, 1000);
        }
    }
    
    // Initialize all protections
    function _0x456() {
        try {
            // Set up bypass protection first
            _0xtuv();
            
            // Set up keyboard blocking
            _0xwxy();
            
            // Set up mobile protections
            _0xz123();
            
            // Start continuous monitoring
            _0x1a2b.intervals = [
                setInterval(_0x3c4d, 1000),    // Console detection
                setInterval(_0x5e6f, 800),     // Window size detection
                setInterval(_0x7g8h, 1500),    // Debugger detection
                setInterval(_0x9i0j, 2000),    // Network detection
                setInterval(_0xklmn, 3000),    // DOM detection
            ];
            
            // Check if any detection method returns true
            _0x1a2b.intervals.forEach((interval, index) => {
                const _methods = [_0x3c4d, _0x5e6f, _0x7g8h, _0x9i0j, _0xklmn];
                setInterval(() => {
                    if (_methods[index] && _methods[index]()) {
                        _0xpqrs();
                    }
                }, [1000, 800, 1500, 2000, 3000][index]);
            });
            
            // Immediate check on load
            setTimeout(() => {
                if (_0x3c4d() || _0x5e6f() || _0x7g8h()) {
                    _0xpqrs();
                }
            }, 100);
            
        } catch (e) {
            // Silent error handling to avoid detection
            _0xpqrs();
        }
    }
    
    // Self-protection and initialization
    (function() {
        // Immediate initialization
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', _0x456);
        } else {
            _0x456();
        }
        
        // Backup initialization
        window.addEventListener('load', _0x456);
        setTimeout(_0x456, 0);
    })();
    
})();
