(function(){
  var originalHtml = document.documentElement.innerHTML;
  var sessionKey = 'securityCheckpoint_allowedIps';
  var sessionDuration = 3600000;
  
  function getUserIpHash() {
    var userAgent = navigator.userAgent;
    var screenRes = screen.width + 'x' + screen.height;
    var timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    var language = navigator.language;
    var platform = navigator.platform;
    
    var fingerprint = userAgent + screenRes + timezone + language + platform;
    var hash = 0;
    for(var i = 0; i < fingerprint.length; i++) {
      var char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return 'ip_' + Math.abs(hash).toString(36);
  }
  
  function isIpAllowed() {
    try {
      var allowedIps = JSON.parse(sessionStorage.getItem(sessionKey) || '{}');
      var currentIp = getUserIpHash();
      var currentTime = Date.now();
      
      if(allowedIps[currentIp] && (currentTime - allowedIps[currentIp]) < sessionDuration) {
        return true;
      }
      
      Object.keys(allowedIps).forEach(function(ip) {
        if((currentTime - allowedIps[ip]) >= sessionDuration) {
          delete allowedIps[ip];
        }
      });
      
      sessionStorage.setItem(sessionKey, JSON.stringify(allowedIps));
      return false;
    } catch(e) {
      return false;
    }
  }
  
  function addIpToAllowlist() {
    try {
      var allowedIps = JSON.parse(sessionStorage.getItem(sessionKey) || '{}');
      var currentIp = getUserIpHash();
      allowedIps[currentIp] = Date.now();
      sessionStorage.setItem(sessionKey, JSON.stringify(allowedIps));
    } catch(e) {}
  }
  
  function checkUserAgent() {
    var userAgent = navigator.userAgent.toLowerCase();
    var suspiciousKeywords = [
      'headless', 'phantom', 'selenium', 'automated', 'python-requests',
      'curl/', 'wget/', 'httpclient', 'okhttp', 'urllib', 'scrapy'
    ];
    return suspiciousKeywords.some(keyword => userAgent.includes(keyword));
  }
  
  function checkBrowserFeatures() {
    try {
      return typeof navigator.languages !== 'undefined' && 
             navigator.languages.length > 0 &&
             screen.width > 0 && 
             screen.height > 0 &&
             typeof document !== 'undefined' &&
             typeof window.history !== 'undefined';
    } catch(e) {
      return false;
    }
  }
  
  function checkTimingAttack() {
    try {
      var startTime = performance.now();
      for(var i = 0; i < 50000; i++) Math.random();
      return (performance.now() - startTime) > 5;
    } catch(e) {
      return true;
    }
  }
  
  function isBot() {
    var suspiciousCount = 0;
    
    if(checkUserAgent()) suspiciousCount++;
    if(!checkBrowserFeatures()) suspiciousCount++;
    if(!checkTimingAttack()) suspiciousCount++;
    if(navigator.webdriver === true) suspiciousCount++;
    if(window.callPhantom || window._phantom) suspiciousCount++;
    if(window.Buffer && typeof window.process !== 'undefined') suspiciousCount++;
    
    return suspiciousCount >= 2;
  }
  
  function showSecurityCheck() {
    document.documentElement.innerHTML = `
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Multi Language Coder Security Check Point</title>
    </head>
    <body>
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
        .success{color:#fff;font-size:18px;margin-top:15px;display:none}
      </style>
      <div class="container">
        <div class="logo"></div>
        <h1>Security Check Point</h1>
        <div class="info">Đang Kiểm Tra Trình Duyệt Của Bạn<br>Vui lòng đợi giây lát</div>
        <div class="info"><strong>Power by <a href="https://xuankien.qzz.io/" target="_blank">VXK1997Dev</a></strong></div>
        <h2 style="color:silver;font-size:20px;margin:30px 0 10px">- Waiting Security -</h2>
        <div class="pulse"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
        <div class="success" id="successMsg"><b>✅ Xác thực thành công.</b></div>
      </div>
    </body>`;
  }
  
  if(isIpAllowed()) {
    return;
  }
  
  showSecurityCheck();
  
  setTimeout(function(){
    if(isBot()) {
      window.location.href = 'https://cloudflare.com';
      return;
    }
    
    addIpToAllowlist();
    document.getElementById("successMsg").style.display = "block";
    
    setTimeout(function(){
      document.documentElement.innerHTML = originalHtml;
    }, 2000);
  }, Math.random() * 2000 + 3000);
})();
