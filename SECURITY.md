# Security Policy

## Supported Versions

Security fixes are applied to the `main` branch.

## Reporting a Vulnerability

Do not open a public issue for suspected security vulnerabilities.

Use GitHub's private vulnerability reporting feature if it is enabled for the repository. If it is not available, contact the maintainer directly through GitHub.

When reporting a security issue, include:

- A clear description of the issue
- Steps to reproduce the problem
- The affected routes, files, or components
- Any proof-of-concept details needed to validate the report

Please avoid public disclosure until a fix is available and users have had time to update.

## Secrets and Local Development

- Never commit `.env.local` or real API keys.
- Use `.env.example` for documented placeholders only.
- Rotate any secret immediately if it is exposed in git history, logs, screenshots, or shared environments.
