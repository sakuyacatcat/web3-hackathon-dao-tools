# web3-one-stop-idea-wiki

## Feature

- 新規事業のアイデアを匿名で気軽に投稿できます。
- 投稿されたアイデアは wiki の様に他ユーザーとカイゼンを重ねられます。
- 投稿されたアイデアは他のユーザーから共感を受けることができます。
- 共感がしきい値を超えたアイデアは投資家ロールのユーザーから投資を受けられます。

## Usage

### For local development

**Install package**

```
> npm install
> cd {root}/contracts
> npm install
```

**Start hardhat node**

```
> cd {root}/contracts
> npm run start:node
```

**Deploy smart contract**

```
> cd {root}/contracts
> npm run build
> npm run test
> npm run deploy:local
```

**Create new Firebase Project**

<https://console.firebase.google.com/>

`Authentication`, `Firestore Database` を作成。
`{root}/.env.local_sample` をコピーして `{root}/.env.local` を作成。
必要な環境変数を自分のプロジェクトからコピーしてセット。

**Start nextjs node**

```
> cd {root}
> npm run dev
```

`http://localhost:3000` へ!!
