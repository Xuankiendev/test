// DVSTEAM Browser Checker - Optimized Version
(function() {
    // Create CSS styles
    const styles = `
        <style>
        *{user-select:none}
        body{background:#111;margin:0;padding:5px;font-family:Arial;color:#fff;text-align:center;border:2px double #ccc;border-radius:20px;animation:glow 1s infinite}
        @keyframes glow{30%{border-color:#666}60%{border-color:#999}90%{border-color:#ccc}}
        .container{margin-top:10vh}
        .logo{width:120px;height:120px;border-radius:15%;margin:20px auto;background:url('https://i.gifer.com/origin/05/05bd96100762b05b616fb2a6e5c223b4_w200.gif');background-size:cover}
        h1{font-size:24px;color:#fff;margin:20px 0}
        .info{color:#d8d8d8;margin:15px 0}
        .pulse{display:flex;justify-content:center;gap:8px;margin:20px 0}
        .dot{width:12px;height:12px;background:violet;border-radius:50%;animation:pulse 0.4s infinite alternate}
        .dot:nth-child(2){animation-delay:0.2s}
        .dot:nth-child(3){animation-delay:0.4s}
        @keyframes pulse{from{opacity:1;transform:scale(1)}to{opacity:0.25;transform:scale(0.75)}}
        a{color:#a690d6;text-decoration:none}
        @media(max-width:768px){.container{margin-top:15vh}h1{font-size:20px}}
        </style>
    `;

    // Create HTML content
    const content = `
        ${styles}
        <div class="container">
            <div class="logo"></div>
            <h1>HỆ THỐNG API BANK DVSTEAM</h1>
            <div class="info">
                Đang Kiểm Tra Trình Duyệt Của Bạn<br>
                Vui lòng đợi giây lát
            </div>
            <div class="info">
                <strong>Power by <a href="https://m.facebook.com/admin.dvsteam.net" target="_blank">DVSTEAM.VN</a></strong>
            </div>
            <h2 style="color:silver;font-size:20px;margin:30px 0 10px">- Waiting Security -</h2>
            <div class="pulse">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        </div>
    `;

    // Apply to page
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            document.documentElement.innerHTML = `<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Hệ Thống API BANK DVSTEAM</title></head><body>${content}</body>`;
        });
    } else {
        document.documentElement.innerHTML = `<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Hệ Thống API BANK DVSTEAM</title></head><body>${content}</body>`;
    }
})();
