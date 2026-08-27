# Maintenance loop

readmeproof evolves from minimal, harmless Markdown fixtures and explicit execution policy.

1. A user submits a parsing mismatch through the issue form.
2. A maintainer replaces commands with harmless equivalents and adds a regression test.
3. The change must pass Node.js 20, 22, and 24 and dogfood this README in strict Bash mode.
4. Conventional commits feed a Release Please PR and changelog when a maintainer or scheduled Codex review starts a release cycle.
5. A human reviews and merges releases. Bots must not auto-merge or publish packages.

## Triage order

Prioritize unintended execution, sandbox escapes, hangs, parser crashes, and false opt-ins. Syntax coverage and display improvements come afterward.

## Automation boundary

Scheduled agents may read public issues, add harmless fixtures, harden parsing, and open focused pull requests. They may not weaken the explicit opt-in rule, run destructive examples, merge their own PRs, publish to npm, or create credentials.
