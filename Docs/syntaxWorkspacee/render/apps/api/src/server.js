const express = require('express');
const { Queue } = require('bullmq');
const { z } = require('zod');
const multer = require('multer');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Redis Connection
const redisConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

// Queue Setup
const renderQueue = new Queue('render-queue', { connection: redisConnection });

// Input Validation Schema
const renderSchema = z.object({
  inputType: z.enum(['url', 'html']),
  content: z.string(),
  options: z.object({
    format: z.string().optional(),
    printBackground: z.boolean().optional(),
    hoverSelectors: z.array(z.string()).optional(),
    waitForEvent: z.string().optional(),
  }).optional(),
});

// Routes

// POST /api/v1/render
app.post('/api/v1/render', async (req, res) => {
  try {
    const validatedData = renderSchema.parse(req.body);
    
    // Create Job
    const job = await renderQueue.add('render-job', validatedData, {
      removeOnComplete: false, // Keep for status check/download
      removeOnFail: false,
    });

    res.json({ jobId: job.id, status: 'queued' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('Job submission failed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/v1/status/:id
app.get('/api/v1/status/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const job = await renderQueue.getJob(id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const state = await job.getState();
    const result = job.returnvalue; // Assuming worker returns a path or metadata

    res.json({ 
      id: job.id, 
      state, 
      result: state === 'completed' ? result : null,
      error: job.failedReason 
    });
  } catch (error) {
    console.error('Status check failed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/v1/download/:id
// Note: In a real/cloud scenario, this would redirect to S3 presigned URL.
// For this POC, we can try to serve the file if the worker saved it to a shared volume,
// or wait for further instructions. For now, we will return the path info.
app.get('/api/v1/download/:id', async (req, res) => {
   // Placeholder: To be implemented properly once Worker logic for "storage" is defined.
   // Assuming Worker returns a file path or URL.
   const { id } = req.params;
   try {
    const job = await renderQueue.getJob(id);
    if (!job || await job.getState() !== 'completed') {
        return res.status(404).json({ error: 'Result not ready or job not found' });
    }
    // Simplistic handling: Just return what the worker returned for now
    res.json({ downloadUrl: job.returnvalue }); 
   } catch(error) {
       res.status(500).json({error: error.message});
   }
});

// GET /health
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const server = app.listen(port, () => {
  console.log(`API Gateway listening at http://localhost:${port}`);
});

// Graceful Shutdown
async function shutdown() {
  console.log('Shutting down gracefully...');
  server.close(async () => {
    console.log('HTTP server closed.');
    await renderQueue.close();
    console.log('Redis connection closed.');
    process.exit(0);
  });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
