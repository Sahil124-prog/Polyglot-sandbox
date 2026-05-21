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


if (!fs.existsSync('/app/temp')) {
    fs.mkdirSync('/app/temp', { recursive: true });
}

app.post('/execute', (req, res) => {
    const { language, code } = req.body;

    
    const fileId = crypto.randomBytes(16).toString('hex');
    const ext = language === 'python' ? 'py' : 'js';
    const filename = `${fileId}.${ext}`;
    
    
    const localPath = path.join('/app/temp', filename);
    fs.writeFileSync(localPath, code);

    
    const containerImage = `sandbox-${language}`;
    const runnerCmd = language === 'python' ? 'python' : 'node';

    
    const dockerCmd =
        `docker run --rm --memory=256m --cpus=0.5 ` +
        `-v sandbox-temp:/app/temp ` +
        `${containerImage} ${runnerCmd} /app/temp/${filename}`;

    
    exec(dockerCmd, { timeout: 5000 }, (error, stdout, stderr) => {
        
        
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