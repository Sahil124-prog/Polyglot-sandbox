import express from 'express';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Ensure the temp directory exists inside the volume
if (!fs.existsSync('/app/temp')) {
    fs.mkdirSync('/app/temp', { recursive: true });
}

app.post('/execute', (req, res) => {
    const { language, code } = req.body;

    // 1. Generate unique filename
    const fileId = crypto.randomBytes(16).toString('hex');
    const ext = language === 'python' ? 'py' : 'js';
    const filename = `${fileId}.${ext}`;
    
    // 2. Write to the shared Docker Named Volume
    const localPath = path.join('/app/temp', filename);
    fs.writeFileSync(localPath, code);

    // 3. Setup Runner execution
    const containerImage = `sandbox-${language}`;
    const runnerCmd = language === 'python' ? 'python' : 'node';

    // 4. The Magic: Use the named volume "sandbox-temp" instead of host paths
    const dockerCmd =
        `docker run --rm --memory=256m --cpus=0.5 ` +
        `-v sandbox-temp:/app/temp ` +
        `${containerImage} ${runnerCmd} /app/temp/${filename}`;

    // 5. Execute!
    exec(dockerCmd, { timeout: 5000 }, (error, stdout, stderr) => {
        
        // Cleanup temp file
        if (fs.existsSync(localPath)) {
            fs.unlinkSync(localPath);
        }

        if (error) {
            return res.status(400).json({
                status: 'error',
                output: stderr || error.message
            });
        }

        res.json({
            status: 'success',
            output: stdout
        });
    });
});

app.listen(3000, () => {
    console.log('Polyglot API running on port 3000');
});