const { Worker } = require('bullmq');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const redisConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

/**
 * Renders HTML/URL to PDF with Hover Simulation
 */
async function renderPage(jobData) {
  const { 
    url, 
    content, 
    hoverSelectors = [], 
    waitForEvent,
    format = 'A4' 
  } = jobData;

  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox', 
      '--disable-dev-shm-usage'
    ]
  });

  try {
    const page = await browser.newPage();
    
    // 1. Load Content
    if (url) {
      console.log(`Navigating to ${url}...`);
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    } else if (content) {
      console.log(`Setting content...`);
      await page.setContent(content, { waitUntil: 'networkidle0' });
    }

    // 2. Advanced Wait Strategy
    if (waitForEvent) {
      console.log(`Waiting for event: ${waitForEvent}...`);
      try {
        await page.waitForFunction(`window.${waitForEvent} === true`, { timeout: 10000 });
      } catch (e) {
        console.warn('Wait event timed out, proceeding with capture...');
      }
    }

    // 3. Hover Simulation Strategy
    if (hoverSelectors.length > 0) {
      for (const selector of hoverSelectors) {
        try {
          const element = await page.$(selector);
          if (element) {
            // Method A: CDP Force State
            await page._client().send('CSS.forcePseudoState', {
              nodeId: (await element.asElement()._remoteObject).objectId,
              forcedPseudoClasses: ['hover']
            });
            
            // Method B: Fallback Class Injection
            await page.evaluate((sel) => {
               const el = document.querySelector(sel);
               if(el) el.classList.add('renderforge-hover');
            }, selector);
          }
        } catch (err) {
          console.error(`Failed to hover ${selector}:`, err.message);
        }
      }
      // Brief wait for animations to settle
      await new Promise(r => setTimeout(r, 500));
    }

    // 4. Canvas Stabilization
    await page.evaluate(() => {
      document.querySelectorAll('canvas').forEach(canvas => {
        const img = document.createElement('img');
        img.src = canvas.toDataURL();
        img.style.cssText = canvas.style.cssText;
        img.className = canvas.className;
        canvas.parentNode.replaceChild(img, canvas);
      });
    });

    // 5. Output Generation
    let buffer;
    
    if (format === 'png') {
        buffer = await page.screenshot({ fullPage: true, type: 'png' });
    } else if (format === 'docx') {
        const html = await page.content();
        // Dynamic import or require if strict CommonJS
        const htmlDocx = require('html-docx-js'); 
        buffer = htmlDocx.asBlob(html);
        // html-docx-js likely returns a Blob or Buffer? 
        // Checking library commonly returns Buffer in node or Blob in browser. 
        // Actually the node version usually returns buffer.
        // If it throws "Blob is not defined", we might need polyfill or verify library usage.
        // Assuming standard node usage for now. If failure, we'll debug.
        if (buffer instanceof Blob) {
            // Convert Blob to Buffer if needed (node 18+ has global Blob)
            buffer = Buffer.from(await buffer.arrayBuffer());
        }
    } else {
        // Default to PDF
        buffer = await page.pdf({
            format: format === 'A4' || format === 'Letter' ? format : 'A4',
            printBackground: true,
            margin: { top: '20px', bottom: '20px' }
        });
    }

    return buffer;

  } catch (error) {
    throw new Error(`Rendering failed: ${error.message}`);
  } finally {
    await browser.close();
  }
}

const worker = new Worker('render-queue', async job => {
  console.log(`Processing job ${job.id}`);
  try {
    const pdfBuffer = await renderPage(job.data);
    
    const { format = 'pdf' } = job.data;
    const ext = format === 'docx' ? 'docx' : (format === 'png' ? 'png' : 'pdf');

    // Save to disk (Mock Storage)
    const fileName = `render-${job.id}.${ext}`;
    const outputPath = path.join('/app/output', fileName);
    
    // Ensure output directory exists
    if (!fs.existsSync('/app/output')) {
         fs.mkdirSync('/app/output', { recursive: true });
    }

    fs.writeFileSync(outputPath, pdfBuffer);
    console.log(`Job ${job.id} completed. Saved to ${outputPath}`);
    
    return `/output/${fileName}`; 

  } catch (err) {
    console.error(`Job ${job.id} failed:`, err);
    throw err;
  }
}, { connection: redisConnection });

worker.on('completed', job => {
  console.log(`${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
});

console.log('Worker started, listening for jobs...');

// Graceful Shutdown
async function shutdown() {
  console.log('Worker shutting down...');
  await worker.close();
  console.log('Worker connection closed.');
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
