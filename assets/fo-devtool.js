(function() {
    function showWarning() {
        document.body.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, #ff4757, #ff3838); display: flex; justify-content: center; align-items: center; font-family: Arial, sans-serif; z-index: 999999;">
                <div style="text-align: center; color: white; animation: shake 0.5s ease-in-out infinite alternate;">
                    <h1 style="font-size: 48px; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); user-select: none; pointer-events: none;">Quay Dau La Bo</h1>
                    <p style="font-size: 24px; margin: 20px 0; user-select: none; pointer-events: none;">Mau Tat Dev Tool</p>
                </div>
            </div>
            <style>@keyframes shake { 0% { transform: translateX(0px); } 100% { transform: translateX(10px); } }</style>`;
        setTimeout(() => window.location.replace("https://cloudflare.com"), 2000);
    }

    function detectDevTools() {
        let devtools = {open: false, orientation: null};
        let threshold = 160;
        
        setInterval(() => {
            if (window.outerHeight - window.innerHeight > threshold || window.outerWidth - window.innerWidth > threshold) {
                if (!devtools.open) {
                    devtools.open = true;
                    showWarning();
                }
            }
        }, 500);

        let element = new Image();
        Object.defineProperty(element, 'id', {
            get: function() {
                showWarning();
            }
        });
        console.log(element);

        let startTime = performance.now();
        debugger;
        let endTime = performance.now();
        if (endTime - startTime > 100) {
            showWarning();
        }
    }

    document.addEventListener("contextmenu", e => e.preventDefault());
    
    document.addEventListener("keydown", e => {
        if (e.key === "F12" || 
            (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "C")) || 
            (e.ctrlKey && e.key === "U") ||
            e.keyCode === 123) {
            e.preventDefault();
            showWarning();
        }
    });

    detectDevTools();
})();
