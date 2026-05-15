#  Polyglot Sandbox Automator

A secure, containerized, remote code-execution platform (similar to a simplified LeetCode or Replit backend). 

This project provides a TypeScript REST API that receives untrusted code (Python or Node.js) and executes it securely inside isolated, ephemeral Docker containers. It leverages **Docker-out-of-Docker (DooD)** and **Docker Named Volumes** to orchestrate workloads dynamically.

##  Features
* **Multi-Language Support**: Executes Python and Node.js code seamlessly.
* **Isolated Runners**: Untrusted code runs in minimal Alpine Linux environments as a non-root `sandbox` user.
* **Resource Limits**: Containers are restricted in CPU and Memory usage to prevent malicious infinite loops or crashes.
* **Docker-out-of-Docker**: The API container communicates directly with the host's Docker engine to spawn worker containers.
* **Named Volumes**: Securely passes execution files between the API and runner containers without relying on fragile host OS file paths.
* **PowerShell Automation**: Full CI/CD lifecycle managed via a single `manage.ps1` CLI script.

---

##  Project Structure

```text
polyglot-sandbox/
├── containers/
│   ├── api/                ← API Dockerfile (Node.js, tsx, Docker CLI)
│   ├── nodejs/             ← Node.js runner Dockerfile (Secure, non-root)
│   └── python/             ← Python runner Dockerfile (Secure, non-root)
├── scripts/
│   └── manage.ps1          ← Windows PowerShell automation CLI
├── src/
│   ├── index.ts            ← TypeScript Express Server
│   ├── package.json        ← API dependencies
│   └── tsconfig.json       ← TypeScript configuration
├── docker-compose.yml      ← Orchestrates the API, Redis, and Shared Volumes
└── README.md               ← You are here