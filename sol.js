const puppeteer = require('puppeteer');
const fs = require('fs');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

async function detectEnvironment() {
    const isRailway = process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID;
    const isCodespace = process.env.CODESPACES || process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN;
    const isReplit = process.env.REPL_ID || process.env.REPLIT_DB_URL;
    const isGlitch = process.env.PROJECT_REMIX_CHAIN;
    
    return {
        isRailway,
        isCodespace,
        isReplit,
        isGlitch,
        isCloud: !!(isRailway || isCodespace || isReplit || isGlitch)
    };
}

async function getBrowserConfig() {
    const env = await detectEnvironment();
    
    if (env.isCloud) {
        console.log(`Detected cloud environment: ${env.isRailway ? 'Railway' : env.isCodespace ? 'Codespace' : env.isReplit ? 'Replit' : 'Glitch'}`);
        
        return {
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu',
                '--disable-features=VizDisplayCompositor',
                '--disable-extensions',
                '--disable-plugins',
                '--disable-images',
                '--disable-web-security',
                '--disable-features=site-per-process',
                '--single-process',
                '--no-default-browser-check',
                '--disable-background-networking',
                '--disable-background-timer-throttling',
                '--disable-renderer-backgrounding',
                '--disable-backgrounding-occluded-windows',
                '--disable-client-side-phishing-detection',
                '--disable-sync',
                '--disable-translate',
                '--hide-scrollbars',
                '--mute-audio',
                '--disable-ipc-flooding-protection',
                '--memory-pressure-off',
                '--max_old_space_size=4096'
            ],
            defaultViewport: { width: 1280, height: 720 },
            ignoreDefaultArgs: ['--disable-extensions'],
            timeout: 0
        };
    } else {
        return {
            headless: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage'
            ],
            defaultViewport: null,
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser'
        };
    }
}

async function handleCloudflareCaptcha() {
    const targetUrl = await askQuestion('Nhập URL cần test: ');
    
    const browserConfig = await getBrowserConfig();
    const browser = await puppeteer.launch(browserConfig);

    try {
        const page = await browser.newPage();
        
        await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        });

        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (req.resourceType() === 'image' || req.resourceType() === 'font') {
                req.abort();
            } else {
                req.continue();
            }
        });

        console.log(`Accessing: ${targetUrl}`);
        await page.goto(targetUrl, { 
            waitUntil: 'domcontentloaded',
            timeout: 60000 
        });

        await page.waitForTimeout(3000);
        
        const cloudflareSelectors = [
            'input[type="checkbox"][id*="challenge"]',
            'input[type="checkbox"][name*="cf"]',
            '.cf-turnstile input[type="checkbox"]',
            '#cf-challenge-stage input',
            '.challenge-form input[type="checkbox"]',
            'iframe[src*="challenges.cloudflare.com"]',
            'iframe[src*="turnstile"]',
            '.cf-browser-verification',
            '#challenge-form',
            '[data-ray]',
            '.ray-id',
            '#cf-wrapper',
            '.cf-error-overview',
            'body:contains("Checking your browser")',
            'body:contains("Please wait")',
            'body:contains("DDoS protection")'
        ];

        let captchaFound = false;
        let captchaElement = null;
        let usedSelector = null;

        for (const selector of cloudflareSelectors) {
            try {
                if (selector.includes(':contains')) {
                    const hasText = await page.evaluate((text) => {
                        return document.body.innerText.toLowerCase().includes(text.toLowerCase());
                    }, selector.split(':contains("')[1].replace('")', ''));
                    
                    if (hasText) {
                        console.log(`Detected Cloudflare text: ${selector}`);
                        captchaFound = true;
                        usedSelector = selector;
                        break;
                    }
                } else {
                    const element = await page.$(selector);
                    if (element) {
                        console.log(`Detected Cloudflare element: ${selector}`);
                        captchaElement = element;
                        usedSelector = selector;
                        captchaFound = true;
                        break;
                    }
                }
            } catch (error) {
                continue;
            }
        }

        if (captchaFound) {
            console.log('Processing captcha...');
            
            try {
                if (usedSelector && usedSelector.includes('iframe')) {
                    const iframe = await page.$(usedSelector);
                    const frame = await iframe.contentFrame();
                    
                    if (frame) {
                        await frame.waitForTimeout(2000);
                        const checkbox = await frame.$('input[type="checkbox"]');
                        if (checkbox) {
                            await checkbox.click();
                            console.log('Clicked checkbox in iframe');
                        }
                    }
                } else if (captchaElement) {
                    await captchaElement.click();
                    console.log('Clicked captcha element');
                } else {
                    console.log('Waiting for automatic processing...');
                }
            } catch (clickError) {
                console.log('Click failed, waiting for auto-solve...');
            }

            console.log('Waiting for processing...');
            
            let resolved = false;
            for (let i = 0; i < 30; i++) {
                await page.waitForTimeout(2000);
                
                try {
                    const currentUrl = page.url();
                    const bodyText = await page.evaluate(() => document.body.innerText.toLowerCase());
                    
                    if (!bodyText.includes('challenge') && 
                        !bodyText.includes('checking') &&
                        !bodyText.includes('verifying') &&
                        !bodyText.includes('please wait')) {
                        console.log('Challenge completed');
                        resolved = true;
                        break;
                    }
                    
                    if (i % 5 === 0) {
                        console.log(`Still processing... ${i * 2}s`);
                    }
                } catch (error) {
                    continue;
                }
            }
            
            if (!resolved) {
                console.log('Timeout waiting for challenge resolution');
            }
        } else {
            console.log('No Cloudflare challenge detected');
        }

        const cookies = await page.cookies();
        
        console.log('\n=== COOKIES ===');
        cookies.forEach(cookie => {
            console.log(`${cookie.name}: ${cookie.value.substring(0, 50)}${cookie.value.length > 50 ? '...' : ''}`);
            console.log(`Domain: ${cookie.domain}, Secure: ${cookie.secure}, HttpOnly: ${cookie.httpOnly}`);
            console.log('---');
        });

        const timestamp = Date.now();
        const cookieFile = `cookies_${timestamp}.json`;
        
        if (!fs.existsSync('./output')) {
            fs.mkdirSync('./output');
        }
        
        const cookiePath = path.join('./output', cookieFile);
        fs.writeFileSync(cookiePath, JSON.stringify(cookies, null, 2));
        console.log(`Cookies saved: ${cookiePath}`);

        const localStorage = await page.evaluate(() => {
            const items = {};
            try {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    items[key] = localStorage.getItem(key);
                }
            } catch (e) {}
            return items;
        });
        
        const sessionStorage = await page.evaluate(() => {
            const items = {};
            try {
                for (let i = 0; i < sessionStorage.length; i++) {
                    const key = sessionStorage.key(i);
                    items[key] = sessionStorage.getItem(key);
                }
            } catch (e) {}
            return items;
        });

        if (Object.keys(localStorage).length > 0) {
            console.log('\n=== LOCAL STORAGE ===');
            console.log(JSON.stringify(localStorage, null, 2));
        }
        
        if (Object.keys(sessionStorage).length > 0) {
            console.log('\n=== SESSION STORAGE ===');
            console.log(JSON.stringify(sessionStorage, null, 2));
        }

        try {
            const response = await page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 });
            const headers = response.headers();
            
            console.log('\n=== CLOUDFLARE HEADERS ===');
            Object.keys(headers).forEach(key => {
                if (key.toLowerCase().includes('cf-') || 
                    key.toLowerCase().includes('cloudflare') ||
                    key.toLowerCase().includes('ray') ||
                    key.toLowerCase().includes('server')) {
                    console.log(`${key}: ${headers[key]}`);
                }
            });
        } catch (error) {
            console.log('Cannot fetch headers');
        }

        const screenshotFile = `screenshot_${timestamp}.png`;
        const screenshotPath = path.join('./output', screenshotFile);
        await page.screenshot({ 
            path: screenshotPath, 
            fullPage: true,
            clip: { x: 0, y: 0, width: 1280, height: 720 }
        });
        console.log(`Screenshot saved: ${screenshotPath}`);

        const pageTitle = await page.title();
        const finalUrl = page.url();
        
        console.log(`\nFinal URL: ${finalUrl}`);
        console.log(`Page Title: ${pageTitle}`);

        const summary = {
            timestamp,
            targetUrl,
            finalUrl,
            pageTitle,
            captchaDetected: captchaFound,
            cookieCount: cookies.length,
            environment: await detectEnvironment()
        };
        
        const summaryPath = path.join('./output', `summary_${timestamp}.json`);
        fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
        console.log(`Summary saved: ${summaryPath}`);

    } catch (error) {
        console.error('Error:', error.message);
        
        const errorLog = {
            timestamp: Date.now(),
            error: error.message,
            stack: error.stack,
            environment: await detectEnvironment()
        };
        
        if (!fs.existsSync('./output')) {
            fs.mkdirSync('./output');
        }
        
        fs.writeFileSync(path.join('./output', 'error.json'), JSON.stringify(errorLog, null, 2));
    } finally {
        await browser.close();
        rl.close();
    }
}

async function listOutputFiles() {
    try {
        if (!fs.existsSync('./output')) {
            console.log('No output directory found');
            return;
        }
        
        const files = fs.readdirSync('./output');
        console.log('\n=== OUTPUT FILES ===');
        files.forEach(file => console.log(file));
    } catch (error) {
        console.log('Cannot list files');
    }
}

async function loadCookiesTest() {
    await listOutputFiles();
    const cookieFile = await askQuestion('Enter cookie file name: ');
    const testUrl = await askQuestion('Enter URL to test: ');
    
    const browserConfig = await getBrowserConfig();
    const browser = await puppeteer.launch(browserConfig);
    const page = await browser.newPage();
    
    try {
        const cookiePath = path.join('./output', cookieFile);
        const cookiesString = fs.readFileSync(cookiePath, 'utf8');
        const cookies = JSON.parse(cookiesString);
        
        await page.setCookie(...cookies);
        console.log('Cookies loaded successfully');
        
        await page.goto(testUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        console.log('Page loaded with cookies');
        
        const title = await page.title();
        console.log(`Page title: ${title}`);
        
        await page.waitForTimeout(3000);
        
    } catch (error) {
        console.error('Cookie test error:', error.message);
    } finally {
        await browser.close();
        rl.close();
    }
}

async function main() {
    const env = await detectEnvironment();
    console.log(`Environment: ${env.isCloud ? 'Cloud Platform' : 'Local'}`);
    
    console.log('\nOptions:');
    console.log('1. Run captcha handler');
    console.log('2. Test saved cookies');
    console.log('3. List output files');

    const choice = await askQuestion('Choose option (1, 2, or 3): ');
    
    if (choice === '1') {
        await handleCloudflareCaptcha();
    } else if (choice === '2') {
        await loadCookiesTest();
    } else if (choice === '3') {
        await listOutputFiles();
        rl.close();
    } else {
        console.log('Invalid option');
        rl.close();
    }
}

main().catch(console.error);
