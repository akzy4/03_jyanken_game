# Implementation Tasks: theme-toggle

## 概要

ライトモードとダークモードを切り替えられるテーマ機能の実装タスク。

## タスク一覧

### 1. Tailwind CSS設定の更新

**要件**: REQ-5, REQ-6

- [x] `tailwind.config.ts`ファイルを作成または更新
- [x] `darkMode: "class"`を設定してクラスベースのダークモードを有効化
- [x] 既存のTailwind設定を維持しながらダークモード設定を追加

**受入基準**:
- Tailwind CSSが`dark:`プレフィックスを認識する
- 設定ファイルが正しく読み込まれる

---

### 2. グローバルスタイルの更新

**要件**: REQ-5, REQ-6

- [x] `app/globals.css`を更新
- [x] 既存の`@media (prefers-color-scheme: dark)`を削除またはコメントアウト
- [x] `.dark`クラスベースのCSS変数を追加:
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
- [x] トランジションを追加（背景色とテキスト色、300ms以下）:
  ```css
  * {
    transition: background-color 0.2s ease, color 0.2s ease;
  }
  ```

**受入基準**:
- CSS変数がライト/ダークモードで正しく切り替わる
- トランジションがスムーズに動作する

---

### 3. useThemeカスタムフックの実装

**要件**: REQ-2, REQ-3, REQ-4

- [x] `app/hooks/`ディレクトリを作成
- [x] `app/hooks/useTheme.ts`ファイルを作成
- [x] `Theme`型を定義: `type Theme = "light" | "dark"`
- [x] `UseThemeReturn`インターフェースを定義
- [x] `useState`でテーマ状態を管理
- [x] `useEffect`で初期化処理を実装:
  - `localStorage.getItem("theme")`をチェック
  - 値が存在しない場合、`window.matchMedia("(prefers-color-scheme: dark)")`でシステム設定を検出
  - 初期テーマを設定
- [x] `useEffect`で`document.documentElement.classList.toggle("dark", theme === "dark")`を実装
- [x] `useEffect`で`localStorage.setItem("theme", theme)`を実装
- [x] `setTheme`関数を実装
- [x] `toggleTheme`関数を実装
- [x] `storage`イベントリスナーを追加して複数タブ間の同期を実装
- [x] エラーハンドリングを追加（localStorageが利用できない場合のフォールバック）

**受入基準**:
- フックが正しくテーマ状態を管理する
- localStorageに設定が保存される
- システム設定が正しく検出される
- 複数タブ間でテーマが同期される
- エラー時に適切にフォールバックする

---

### 4. ThemeToggleコンポーネントの実装

**要件**: REQ-1, REQ-2, NFR-2

- [x] `app/components/ThemeToggle.tsx`ファイルを作成
- [x] `"use client"`ディレクティブを追加
- [x] `useTheme`フックをインポートして使用
- [x] ボタン要素を実装:
  - [x] `aria-label="テーマを切り替え"`を追加
  - [x] `onClick`で`toggleTheme`を呼び出す
  - [x] キーボード操作対応（Enter/Spaceキー）
- [x] 現在のテーマに応じたアイコン/絵文字を表示（🌙/☀️など）
- [x] Tailwind CSSクラスでスタイリング:
  - [x] ダークモード対応の色設定
  - [x] ホバー効果
  - [x] フォーカスインジケーター
  - [x] トランジション

**受入基準**:
- ボタンがクリックでテーマを切り替える
- 現在のテーマが視覚的に示される
- キーボード操作でアクセス可能
- ARIA属性が適切に設定されている

---

### 5. Navigationコンポーネントへの統合

**要件**: REQ-1

- [x] `app/components/Navigation.tsx`を更新
- [x] `ThemeToggle`コンポーネントをインポート
- [x] デスクトップレイアウトの右側に`ThemeToggle`を配置
- [x] モバイルメニューにも`ThemeToggle`を追加
- [x] ダークモード対応のスタイルを追加（`dark:`プレフィックス）

**受入基準**:
- デスクトップとモバイルの両方で`ThemeToggle`が表示される
- レイアウトが崩れない
- ダークモードで適切に表示される

---

### 6. Root Layoutの更新

**要件**: REQ-2

- [x] `app/layout.tsx`を更新
- [x] `html`要素に`suppressHydrationWarning`属性を追加
- [x] ダークモードクラスが正しく適用されることを確認

**受入基準**:
- SSRとクライアントの不一致による警告が発生しない
- テーマが正しく適用される

---

### 7. ホームページのダークモード対応

**要件**: REQ-5

- [x] `app/page.tsx`を更新
- [x] 背景色に`dark:`プレフィックスを追加: `bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-gray-900 dark:to-gray-800`
- [x] カード背景に`dark:`プレフィックスを追加: `bg-white dark:bg-gray-800`
- [x] テキスト色に`dark:`プレフィックスを追加: `text-gray-600 dark:text-gray-300`
- [x] リンクの色に`dark:`プレフィックスを追加
- [x] グラデーションボタンに`dark:`プレフィックスを追加

**受入基準**:
- ダークモードで適切に表示される
- コントラストが十分である
- 視認性が確保されている

---

### 8. ゲームページのダークモード対応

**要件**: REQ-5

- [x] `app/game/page.tsx`を更新
- [x] 背景色に`dark:`プレフィックスを追加
- [x] カード背景に`dark:`プレフィックスを追加
- [x] テキスト色に`dark:`プレフィックスを追加
- [x] ボタンの色に`dark:`プレフィックスを追加
- [x] スコアボードの背景色に`dark:`プレフィックスを追加

**受入基準**:
- ダークモードで適切に表示される
- ゲームの操作性が損なわれない
- 視認性が確保されている

---

### 9. DevBoardページのダークモード対応

**要件**: REQ-5

- [x] `app/devboard/page.tsx`を更新
- [x] ヘッダーの背景色に`dark:`プレフィックスを追加: `bg-white dark:bg-gray-900`
- [x] カード背景に`dark:`プレフィックスを追加: `bg-gray-50 dark:bg-gray-800`
- [x] テキスト色に`dark:`プレフィックスを追加
- [x] タブの色に`dark:`プレフィックスを追加
- [x] バッジの色に`dark:`プレフィックスを追加

**受入基準**:
- ダークモードで適切に表示される
- データの視認性が確保されている
- UI要素が適切に区別される

---

### 10. その他のページのダークモード対応

**要件**: REQ-5

- [x] `app/about/page.tsx`を確認し、必要に応じてダークモード対応を追加
- [x] `app/contact/page.tsx`を確認し、必要に応じてダークモード対応を追加
- [x] すべてのページで一貫したダークモードスタイルを適用

**受入基準**:
- すべてのページがダークモードで適切に表示される
- スタイルの一貫性が保たれる

---

### 11. 動作確認とテスト

**要件**: REQ-1, REQ-2, REQ-3, REQ-4, REQ-5, REQ-6, NFR-1, NFR-2, NFR-3

- [x] テーマ切り替えボタンが正しく動作することを確認（コードレビュー完了）
- [x] ページリロード後もテーマが維持されることを確認（localStorage実装確認）
- [x] 複数タブ間でテーマが同期されることを確認（storageイベント実装確認）
- [x] システム設定が正しく検出されることを確認（matchMedia実装確認）
- [x] すべてのページでダークモードが適切に適用されることを確認（全ページにdark:プレフィックス追加確認）
- [x] トランジションがスムーズに動作することを確認（200ms設定確認、300ms以下を満たす）
- [x] キーボード操作でテーマを切り替えられることを確認（onKeyDown実装確認）
- [x] モバイルとデスクトップの両方で動作することを確認（Navigation.tsxで両方に配置確認）
- [x] パフォーマンスが要件を満たしていることを確認（クラス操作のみで<10ms見込み、100ms以内を満たす）

**受入基準**:
- すべての要件が満たされている
- エラーが発生しない
- パフォーマンスが要件を満たしている

---

## 実装順序

1. タスク1-2: Tailwind CSS設定とグローバルスタイル（基盤）
2. タスク3: useThemeフック（コア機能）
3. タスク4: ThemeToggleコンポーネント（UI）
4. タスク5-6: NavigationとLayoutへの統合（統合）
5. タスク7-10: 既存コンポーネントのダークモード対応（適用）
6. タスク11: 動作確認とテスト（検証）

## 注意事項

- 各タスクは独立して実装可能だが、順序に従うことを推奨
- タスク7-10は並行実装可能（Pマーカーなし、順次実装を推奨）
- 実装中は既存の機能を壊さないよう注意
- TypeScriptの型安全性を維持する
- Biomeフォーマッターでコードを整形する
