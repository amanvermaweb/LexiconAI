# Contributing to LexiconAI

Thank you for your interest in contributing to LexiconAI.

This project is open to improvements, bug fixes, documentation updates, and well-scoped new features that improve the developer experience or the functionality of the platform.

Please follow [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) in all project interactions.

## Ways to Contribute

You can contribute by:

- Reporting bugs
- Suggesting new features
- Improving documentation
- Fixing issues
- Adding new AI provider integrations
- Improving UI or performance

## Development Setup

1. Fork the repository.

2. Clone your fork.

    ```bash
    git clone https://github.com/amanvermaweb/lexiconai.git
    cd lexiconai
    ```

3. Install dependencies.

    ```bash
    npm install
    ```

4. Create environment variables.

    ```bash
    cp .env.example .env.local
    ```

    Fill in the required values before running the project.

5. Start the development server.

    ```bash
    npm run dev
    ```

6. Before opening a pull request, verify the project locally.

    ```bash
    npm run lint
    npm run build
    ```

## Branch Naming

Use clear branch names:

```text
feature/add-provider
fix/chat-history-bug
docs/update-readme
```

## Commit Messages

Write clear commit messages.

Examples:

```text
Add Gemini provider support
Fix chat sidebar rendering issue
Improve API key validation
Update README installation guide
```

## Pull Requests

Before submitting a pull request:

- Ensure `npm run lint` and `npm run build` both succeed
- Follow the existing code style
- Write clear commit messages
- Explain the purpose of the change
- Keep pull requests focused on a single change when practical
- Update documentation when behavior, setup, or supported providers change

## Code Style

- Follow the existing project structure
- Keep components modular
- Avoid adding unnecessary dependencies
- Write clear and readable code

## Reporting Bugs

If you find a bug, open an issue and include:

- A clear description of the problem
- Steps to reproduce
- Expected behavior
- Screenshots or logs if relevant

## Feature Requests

If you want to suggest a feature:

- Describe the feature clearly
- Explain why it would improve the project
- Provide examples or references if possible

## Scope Notes

- Provider integrations should include both UI and server-side support before being documented as supported.
- Avoid committing secrets, API keys, or `.env.local` contents.

## Questions

If you have questions about the project, open a GitHub issue.

Thanks for helping improve LexiconAI.
