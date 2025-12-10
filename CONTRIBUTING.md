# Contributing to @nam088/chemical-balancer

Thank you for your interest in contributing to this project! We welcome contributions from the community.

## Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally:
    ```bash
    git clone https://github.com/Nam088/chemical-balancer.git
    cd chemical-balancer
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```

## Development Workflow

1.  **Create a new branch** for your feature or fix:
    ```bash
    git checkout -b feature/my-new-feature
    ```
2.  **Make your changes**. Ensure code quality and style match the existing codebase.
3.  **Run tests** to ensure no regressions:
    ```bash
    npm test
    ```
    If adding a new feature, please add corresponding test cases in `src/real-world.spec.ts` or other spec files.

## Commit Guidelines

We follow **Conventional Commits**. This is important for our automated release process.

-   `feat: ...` -> Triggers a **Minor** release (e.g., 1.1.0).
-   `fix: ...` -> Triggers a **Patch** release (e.g., 1.0.1).
-   `docs: ...`, `chore: ...`, `test: ...` -> No release trigger (unless specified).

Example:
```bash
git commit -m "feat: add support for ion charge balancing"
```

## Pull Requests

1.  Push your branch to GitHub.
2.  Open a Pull Request against the `main` branch.
3.  Describe your changes clearly.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
