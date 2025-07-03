# testing-sqlite3-wasm-app

## プロジェクトの目的

このプロジェクトの目的は、[sqlite-wasm](https://github.com/sqlite/sqlite-wasm)を使ったWebアプリケーションを、Vitestでテストするための検証を行うことです。

## sqlite-wasmの3つの初期化方法

sqlite-wasmには以下の3つの使い方があり、1番目の方法が推奨されています。また、OPFSを使うことができるのは1番目と2番目の方法です。

- in the main thread with a wrapped worker (🏆 preferred option)
- in a worker
- in the main thread

今回はOPFSを使いたいので、推奨されている1番目の方法で実装します。この方法での実装は、sqlite-wasmプロジェクトの以下のデモ実装を参考にしてください。

https://github.com/sqlite/sqlite-wasm/blob/main/demo/wrapped-worker.js

## sqlite3Worker1Promiserの型定義について

推奨されている方法では、`sqlite3Worker1Promiser`関数を使ってデータベースクライアントを作成します。しかし、`sqlite3Worker1Promiser`には型定義が用意されていないという問題があります。

この問題については、以下のIssueで議論されているので、これを参考に解決してください。私はまだ読めていませんが、おそらく型定義ファイルを追加してオーバーライドする必要があると思います。

[Missing typing for sqlite3Worker1Promiser · Issue #53 · sqlite/sqlite-wasm](https://github.com/sqlite/sqlite-wasm/issues/53)

## 作成するアプリケーションについて

簡易的なタスク管理アプリケーションを作成することにしましょう。必要な機能は

- タスクの登録
- タスクの削除
- タスクのチェック・アンチェック

などです。他に必要な機能があれば追加で実装してください。

## テスト内容について

主にバックエンドの処理のテストを行います。モックなどを使用せず、実装のデータベース処理を行うテストを作成します。ただし、`sqlite3Worker1Promiser`を使う限りは、テスト環境でOPFSからインメモリデータベースに切り替えることは許容するものとします。

具体的なバックエンドの処理のテストについて、タスクの登録を例に考えます。

```ts
// task.ts
import { dbClinet } from "./db-client" // sqlite3Worker1Promiserを使ったデータベースクライアント

function addTask({ name }: { name: string }): Promise<{ id: string, name: string}> {
  // 実装はイメージなので、動作しない可能性が高いです
  const createdTask = dbClient.exec('insert into tasks (name) values (?) returning *', [name]);

  return createdTask;
}

```

```ts
// task.test.ts
import { dbClient } from "./db-client"
import { addTask } from "./task"

describe("addTask", () => {
  test("タスクを追加できること", () => {
    // 実際のデータベース接続を使ってタスクを登録する
    const task = await addTask({ name: "タスク1" });

    expect(task).toEqual({ id: 1, name: "タスク1" });
    const taskCount = await dbClient.exec("select count(*) as count from tasks");
    expect(taskCount.count).toBe(1);
  })
})
