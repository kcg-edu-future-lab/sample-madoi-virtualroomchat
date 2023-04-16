# sample-skyway-react

仮想ルームでのチャットを実装したサンプルプログラムです。React, TypeScriptと[分散共有オブジェクト管理基盤Madoi](https://ken.ieice.org/ken/paper/20210827ICFO/)を使用しています。

※このサンプルコードはまだ開発中です。

## 環境構築

以下のソフトウェアが必要です。

* nodejs
* yarn

## 起動方法

Madoiのキーを取得し(未来環境ラボのSlackまたは @takawitter まで連絡してください)，srcディレクトリに`keys.ts`という名前のファイルを作成して以下の内容を書き込んでください。
```
export const madoiKey = "YOUR_API_KEY";
```
次に以下のコマンドを実行すると，アプリケーションが起動します。
```
yarn install
yarn start
```
