# メモ

## 修正依頼

### ブラウザアプリケーションを作って欲しい

今のままだとブラウザで動くことを確認できないので、React + Viteで、今実装したバックエンドのコードを実行するクライアントアプリケーションを作って欲しい。

### モックは使わない

テスト場合だけモックを使うように実装されている。

```ts
if (process.env.NODE_ENV === "test" || typeof window === "undefined") {
  dbClient = createMockSQLiteWorkerAPI();
} else {
}
```

> 主にバックエンドの処理のテストを行います。モックなどを使用せず、実装のデータベース処理を行うテストを作成します。ただし、`sqlite3Worker1Promiser`を使う限りは、テスト環境でOPFSからインメモリデータベースに切り替えることは許容するものとします。

モックは使わないように修正する必要があります。そうするとテストする意味がないからです。

### sqlite3Worker1Promiserの型を書く

とりあえず実行できるアプリケーションを作れてから進めるといい気はしますが。Issueは今から確認します。

[Missing typing for sqlite3Worker1Promiser · Issue #53 · sqlite/sqlite-wasm](https://github.com/sqlite/sqlite-wasm/issues/53)

まだ完全な型は書かれていませんが、現在のPull Requestの差分を取り込めば良さそうな気はします。
