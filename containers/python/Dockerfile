FROM python:3.9-alpine
# Create a non-root user named 'sandbox'
RUN adduser -D sandbox
USER sandbox
WORKDIR /app
# Command defaults to running a script mounted at /app/code.py
CMD ["python", "code.py"]