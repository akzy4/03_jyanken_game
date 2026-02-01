"use client";

import { useState, useEffect, useCallback } from "react";

export type Theme = "light" | "dark";

interface UseThemeReturn {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const THEME_STORAGE_KEY = "theme";

/**
 * システム設定から初期テーマを取得
 */
function getInitialTheme(): Theme {
  // クライアントサイドでのみ実行
  if (typeof window === "undefined") {
    return "light";
  }

  // localStorageから保存されたテーマを取得
  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }
  } catch (error) {
    // localStorageが利用できない場合（プライベートモードなど）
    console.warn("localStorage is not available:", error);
  }

  // システム設定を検出
  try {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
  } catch (error) {
    console.warn("matchMedia is not available:", error);
  }

  // デフォルトはライトモード
  return "light";
}

/**
 * テーマを適用する（document.documentElementにdarkクラスを追加/削除）
 */
function applyTheme(theme: Theme) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

/**
 * テーマ管理カスタムフック
 *
 * 機能:
 * - テーマ状態の管理（light/dark）
 * - localStorageへの保存と読み込み
 * - システム設定（prefers-color-scheme）の検出
 * - 複数タブ間の同期
 * - document.documentElementへのクラス適用
 */
export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>("light");

  // テーマを設定し、localStorageに保存
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);

    // localStorageに保存
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.warn("Failed to save theme to localStorage:", error);
    }
  }, []);

  // テーマを切り替え
  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  // 初期化: クライアントサイドでテーマを読み込み適用
  useEffect(() => {
    // マウント時に確実にテーマを適用
    const initialTheme = getInitialTheme();
    setThemeState(initialTheme);
    // 即座に適用（次のレンダリングを待たない）
    applyTheme(initialTheme);
  }, []);

  // テーマ変更時にdocument.documentElementを更新
  useEffect(() => {
    if (typeof document !== "undefined") {
      applyTheme(theme);
    }
  }, [theme]);

  // 複数タブ間の同期: storageイベントをリッスン
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY && e.newValue) {
        const newTheme = e.newValue as Theme;
        if (newTheme === "light" || newTheme === "dark") {
          setThemeState(newTheme);
          applyTheme(newTheme);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // システム設定の変更を検知（オプション）
  useEffect(() => {
    // localStorageに保存されたテーマがない場合のみ、システム設定の変更を検知
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      try {
        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        // 保存されたテーマがない場合のみ、システム設定に従う
        if (!storedTheme) {
          const systemTheme: Theme = mediaQuery.matches ? "dark" : "light";
          setThemeState(systemTheme);
          applyTheme(systemTheme);
        }
      } catch (error) {
        console.warn("Failed to handle system theme change:", error);
      }
    };

    // モダンブラウザではaddEventListener、古いブラウザではaddListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleSystemThemeChange);
      return () => {
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
      };
    } else {
      // フォールバック（古いブラウザ対応）
      mediaQuery.addListener(handleSystemThemeChange);
      return () => {
        mediaQuery.removeListener(handleSystemThemeChange);
      };
    }
  }, []);

  return {
    theme,
    setTheme,
    toggleTheme,
  };
}
