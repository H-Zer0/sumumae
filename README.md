# スムマエ｜住む。前に。答え合わせ

初めての一人暮らしでも「やらかさない」物件選びができる診断ツール

## 概要

『スムマエ｜住む。前に。答え合わせ』は、初めての一人暮らしを始める方向けの物件診断Webアプリケーションです。物件の専門用語を「生活リスク」に翻訳し、親の懸念も可視化することで、後悔しない物件選びをサポートします。

## 主な機能

### 🏠 物件リスクを翻訳
- 専門用語を「生活リスク」に変換
- 初心者でも理解できる言葉で説明

### 👨‍👩‍👧 親安心度を可視化
- 親が心配するポイントを整理
- 説得材料として活用可能

### 💡 内見チェックリスト
- 不動産屋が言わない確認ポイント
- 後悔しないための実践的アドバイス

## デモ

GitHub Pagesでデモを公開予定:
https://h-zer0.github.io/sumumae/

## 使い方

1. リポジトリをクローン
```bash
git clone https://github.com/H-Zer0/sumumae.git
cd sumumae
```

2. ブラウザで`index.html`を開く
```bash
open index.html
```

または、ローカルサーバーを起動
```bash
# Pythonの場合
python -m http.server 8000

# Node.jsの場合
npx http-server
```

3. ブラウザで `http://localhost:8000` にアクセス

## ファイル構成

```
sumumae/
├── index.html      # メインHTML
├── styles.css      # スタイルシート
├── app.js          # アプリケーションロジック
├── data.js         # ナレッジベース・データ
└── README.md       # このファイル
```

## 技術スタック

- **HTML5**: セマンティックマークアップ
- **CSS3**: CSS変数、レスポンシブデザイン
- **JavaScript (Vanilla)**: フレームワークなし
- **LocalStorage**: 診断結果の一時保存

## デザインコンセプト

- **カラーパレット**: 
  - メイン: #4A7AFF（信頼・安心）
  - サブ: #6ED0A3（生活感・安心感）
- **フォント**: Noto Sans JP（日本語）、Inter（英数字）
- **トーン**: 不安を煽らず、冷静で親切

## ナレッジベース

以下の情報を統合:
- 物件スペック ⇄ 生活リスク変換マスタ
- 初期費用・ランニングコスト判定
- 内見チェックリスト
- リアルな後悔パターン
- 親安心度スコア算出

## ライセンス

MIT License

## 作者

H-Zer0

## 貢献

プルリクエストを歓迎します！

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## お問い合わせ

質問や提案がある場合は、Issuesでお知らせください。
