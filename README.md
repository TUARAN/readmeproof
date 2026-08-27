# readmeproof

> Your README says it works. Prove it in CI.

`readmeproof` finds shell snippets in Markdown, syntax-checks every block, and only executes blocks that explicitly opt in. Documentation examples become tests without turning every README paste into arbitrary code execution.

```text
$ npx github:TUARAN/readmeproof README.md

  readmeproof  README.md
  ────────────────────────────────────────────────────────
  ✓ lines 18   syntax ok · dry only
  ✓ lines 31   syntax ok · opted in

  2 shell block(s), 1 opted in. Nothing executed.
```

## Mark a block as runnable

Add `readmeproof` after the fence language:

````markdown
```bash readmeproof
node --version
npm test
```
````

Then run:

```bash
npx github:TUARAN/readmeproof README.md         # syntax only; executes nothing
npx github:TUARAN/readmeproof README.md --run   # runs opted-in blocks only
```

Execution uses Bash strict mode, the README's directory as cwd, and a two-minute timeout per block. Requires Node.js 20+. Zero dependencies.

## 中文

`readmeproof` 会检查 README 中 shell 代码块的语法；只有标记为 `bash readmeproof` 的代码块才允许在 `--run` 时执行。这样安装命令和快速开始示例可以进入 CI，同时默认保持安全的只读检查。

## Development

```bash readmeproof
npm test
```

MIT © 2026 TUARAN
