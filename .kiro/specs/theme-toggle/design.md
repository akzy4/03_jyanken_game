# Design: theme-toggle

## 概要

ライトモードとダークモードを切り替えられるテーマ機能の設計。Tailwind CSS 4のダークモード機能を活用し、React 19のクライアントコンポーネントで実装する。

## アーキテクチャ

### コンポーネント構造

```
app/
  ├── components/
  │   ├── Navigation.tsx          # サーバーコンポーネント（既存）
  │   └── ThemeToggle.tsx         # クライアントコンポーネント（新規）
  ├── hooks/
  │   └── useTheme.ts            # テーマ管理カスタムフック（新規）
  ├── layout.tsx                 # ルートレイアウト（更新）
  └── globals.css                # グローバルスタイル（更新）
```

### データフロー

1. **初期化**: `useTheme`フックが`localStorage`と`prefers-color-scheme`をチェック
2. **状態管理**: Reactの`useState`でテーマ状態を管理
3. **永続化**: テーマ変更時に`localStorage`に保存
4. **適用**: `document.documentElement`に`dark`クラスを追加/削除
5. **スタイリング**: Tailwind CSSの`dark:`プレフィックスでダークモードスタイルを適用

## コンポーネント設計

### 1. ThemeToggle コンポーネント

**ファイル**: `app/components/ThemeToggle.tsx`

**責任**:
- テーマ切り替えボタンのUI表示
- クリックイベントの処理
- 現在のテーマ状態の視覚的表示

**実装詳細**:
- クライアントコンポーネント（`"use client"`）
- `useTheme`フックを使用してテーマ状態を取得
- アイコンまたは絵文字でライト/ダークモードを表示
- アクセシビリティ対応（ARIAラベル、キーボード操作）

**Props**: なし（フックから状態を取得）

**スタイル**:
- Tailwind CSSクラスを使用
- ダークモード対応の色設定
- ホバー効果とトランジション

### 2. useTheme カスタムフック

**ファイル**: `app/hooks/useTheme.ts`

**責任**:
- テーマ状態の管理
- `localStorage`との連携
- システム設定（`prefers-color-scheme`）の検出
- `document.documentElement`へのクラス適用

**API**:
```typescript
type Theme = "light" | "dark";

interface UseThemeReturn {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

function useTheme(): UseThemeReturn
```

**実装詳細**:
- `useState`でテーマ状態を管理
- `useEffect`で初期化と`localStorage`の読み込み
- `useEffect`で`document.documentElement.className`を更新
- `localStorage`のキー: `"theme"`
- システム設定の検出: `window.matchMedia("(prefers-color-scheme: dark)")`

**副作用**:
- `document.documentElement.classList.toggle("dark", theme === "dark")`
- `localStorage.setItem("theme", theme)`

### 3. Navigation コンポーネントの更新

**ファイル**: `app/components/Navigation.tsx`

**変更内容**:
- `ThemeToggle`コンポーネントをインポート
- ナビゲーションバーの右側に`ThemeToggle`を配置
- モバイルメニューにも`ThemeToggle`を追加

**レイアウト**:
- デスクトップ: ナビゲーションリンクの右側
- モバイル: メニューの上部または下部

### 4. Root Layout の更新

**ファイル**: `app/layout.tsx`

**変更内容**:
- `html`要素に`suppressHydrationWarning`を追加（SSRとクライアントの不一致を防ぐ）
- `ThemeProvider`コンポーネントでラップ（オプション、必要に応じて）

**注意**: Next.jsのSSRでは、初期レンダリング時に`localStorage`にアクセスできないため、`suppressHydrationWarning`が必要。

## スタイリング設計

### Tailwind CSS設定

**ファイル**: `tailwind.config.ts`（作成または更新）

**設定内容**:
```typescript
export default {
  darkMode: "class", // クラスベースのダークモード
  // ... 他の設定
}
```

### グローバルスタイル

**ファイル**: `app/globals.css`

**変更内容**:
1. 既存の`@media (prefers-color-scheme: dark)`を削除または無効化
2. `.dark`クラスベースのスタイルに移行
3. CSS変数の更新:
   ```css
   :root {
     --background: #ffffff;
     --foreground: #171717;
   }
   
   .dark {
     --background: #0a0a0a;
     --foreground: #ededed;
   }
   ```
4. トランジション追加:
   ```css
   * {
     transition: background-color 0.2s ease, color 0.2s ease;
   }
   ```

### 既存コンポーネントのダークモード対応

**対象コンポーネント**:
- `app/page.tsx` - ホームページ
- `app/game/page.tsx` - ゲームページ
- `app/devboard/page.tsx` - DevBoardページ
- `app/components/Navigation.tsx` - ナビゲーション

**対応方法**:
- Tailwind CSSの`dark:`プレフィックスを使用
- 例: `bg-white dark:bg-gray-900`
- グラデーション: `from-orange-100 dark:from-orange-900`
- テキスト色: `text-gray-600 dark:text-gray-300`

## 状態管理設計

### テーマ状態の保存

**ストレージ**: `localStorage`
**キー**: `"theme"`
**値**: `"light"` | `"dark"`

### 初期値の決定ロジック

1. `localStorage.getItem("theme")`をチェック
2. 値が存在する場合、その値を使用
3. 存在しない場合、`window.matchMedia("(prefers-color-scheme: dark)")`をチェック
4. システム設定がダークモードの場合、`"dark"`を返す
5. それ以外は`"light"`を返す

### 状態の同期

- 同一ブラウザの複数タブ間で`storage`イベントをリッスン
- `window.addEventListener("storage", ...)`で他のタブの変更を検知
- 変更を検知したらテーマを更新

## パフォーマンス最適化

### 1. 初期レンダリングの最適化

- `useEffect`でクライアントサイドでのみ`localStorage`にアクセス
- SSR時はデフォルトテーマ（ライト）を使用
- ハイドレーション後に実際のテーマを適用

### 2. トランジションの最適化

- CSSトランジションを使用（JavaScriptアニメーションは使用しない）
- `transition`プロパティを適切に設定（背景色とテキスト色のみ）
- `will-change`プロパティは使用しない（パフォーマンスオーバーヘッド）

### 3. レンダリングの最適化

- `ThemeToggle`コンポーネントのみをクライアントコンポーネント化
- 他のコンポーネントは可能な限りサーバーコンポーネントのまま
- `useTheme`フックは必要最小限のコンポーネントでのみ使用

## アクセシビリティ設計

### ARIA属性

- `ThemeToggle`ボタンに`aria-label="テーマを切り替え"`
- `aria-pressed`で現在の状態を示す（オプション）

### キーボード操作

- `Enter`キーまたは`Space`キーでテーマを切り替え
- `Tab`キーでフォーカス可能
- フォーカスインジケーターを表示

### 視覚的フィードバック

- 現在のテーマを明確に示すアイコン
- ホバー時の視覚的変化
- フォーカス時のアウトライン

## エラーハンドリング

### localStorage へのアクセスエラー

- `localStorage`が利用できない場合（プライベートモードなど）のフォールバック
- エラーをキャッチして、メモリ内の状態のみで動作

### システム設定の検出エラー

- `window.matchMedia`が利用できない場合のフォールバック
- デフォルトでライトモードを使用

## テスト戦略

### 単体テスト

- `useTheme`フックのテスト
- `localStorage`の読み書きのテスト
- システム設定の検出のテスト

### 統合テスト

- `ThemeToggle`コンポーネントのテスト
- テーマ切り替えの動作確認
- 複数タブ間の同期確認

### E2Eテスト

- テーマ切り替えのユーザーフロー
- ページリロード後のテーマ維持
- モバイルとデスクトップの両方での動作確認

## 実装順序

1. **Phase 1**: Tailwind CSS設定とグローバルスタイルの更新
2. **Phase 2**: `useTheme`カスタムフックの実装
3. **Phase 3**: `ThemeToggle`コンポーネントの実装
4. **Phase 4**: `Navigation`コンポーネントへの統合
5. **Phase 5**: 既存コンポーネントのダークモード対応
6. **Phase 6**: テストと調整

## 次のステップ

設計が承認されたら、`/kiro/spec-tasks theme-toggle` を実行して実装タスクを生成してください。
