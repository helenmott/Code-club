---
name: code-review
description: Review code changes for bugs, security issues, and best practices
user-invocable: true
disable-model-invocation: false
---

## Code Review

Analyze the current diff or changed files for:
- **Correctness**: Logic errors, edge cases, type safety
- **Security**: Injection vulnerabilities, auth issues, data leaks
- **Performance**: Inefficient algorithms, N+1 queries
- **Best practices**: Code style, test coverage, maintainability

## Invoke with

`/code-review` - Review the current working diff
`/code-review high` - Thorough review, includes style suggestions
`/code-review security` - Focus on security vulnerabilities
