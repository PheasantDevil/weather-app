# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

# Claude や ChatGPT にリポジトリを丸ごと読み込ませるコマンド

以下のコマンドを実行することでリポジトリ一式をテキストファイル（`repopack-output.txt`）を出力することができます。

```
npx repopack
```

chat へ最初に取り込ませることでコード修正に役立ちます。

## 読み込ませるポイント

ファイルと合わせて以下のプロンプトで始めるとスムーズに改修を始めやすい

```
このファイルはリポジトリのファイルを1つにしたものです。コードのリファクタなどをしたいのでまず添付のコードを確認してください。
```

# About setting to "Renovate"

## 説明:

- extends: ["config:base"]: デフォルト設定に基づきます。
- labels: ["dependencies"]: すべての PR に "dependencies" ラベルが付与されます。
- packageRules:
  - minor と patch の自動マージ: 自動的に PR がマージされます（automergeType: "pr"）。
  - 大規模なマイナー変更（特定のパッケージ）やメジャーアップデートは自動マージされません\*\*。
- prConcurrentLimit: 一度に開かれる PR の上限(number)。

この設定で、メジャーアップデートと大規模なマイナー変更は手動でマージすることができ、それ以外の更新は自動的にマージされます。
