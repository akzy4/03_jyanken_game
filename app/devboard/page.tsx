"use client";

import { useState, useEffect, useCallback } from "react";

type Commit = {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  author: {
    login: string;
    avatar_url: string;
  };
};

type Issue = {
  id: number;
  number: number;
  title: string;
  state: string;
  created_at: string;
  updated_at: string;
  user: {
    login: string;
  };
  labels: Array<{ name: string; color: string }>;
};

type PullRequest = {
  id: number;
  number: number;
  title: string;
  state: string;
  created_at: string;
  updated_at: string;
  user: {
    login: string;
  };
  merged_at: string | null;
};

type ActivityItem = {
  id: string;
  type: "commit" | "issue" | "pull_request";
  title: string;
  date: string;
  author: string;
  avatar?: string;
  data: Commit | Issue | PullRequest;
};

export default function DevBoard() {
  const [activeTab, setActiveTab] = useState<"kanban" | "recent">("recent");
  const [commits, setCommits] = useState<Commit[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [owner, setOwner] = useState("akzy4");
  const [repo, setRepo] = useState("jyanken");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [commitsRes, issuesRes, pullsRes] = await Promise.all([
        fetch(`/api/github/commits?owner=${owner}&repo=${repo}`),
        fetch(`/api/github/issues?owner=${owner}&repo=${repo}`),
        fetch(`/api/github/pulls?owner=${owner}&repo=${repo}`),
      ]);

      if (commitsRes.ok) {
        const commitsData = await commitsRes.json();
        // エラーオブジェクトでないことを確認
        if (Array.isArray(commitsData)) {
          setCommits(commitsData);
        } else if (commitsData.error) {
          console.error("Commits API error:", commitsData);
          setError(`コミットの取得エラー: ${commitsData.error}`);
        }
      } else {
        const errorData = await commitsRes.json().catch(() => ({ error: `HTTP ${commitsRes.status}` }));
        console.error("Commits API error:", errorData);
        setError(`コミットの取得エラー: ${errorData.error || commitsRes.statusText}`);
      }

      if (issuesRes.ok) {
        const issuesData = await issuesRes.json();
        if (Array.isArray(issuesData)) {
          setIssues(issuesData);
        }
      }

      if (pullsRes.ok) {
        const pullsData = await pullsRes.json();
        if (Array.isArray(pullsData)) {
          setPullRequests(pullsData);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(`データの取得に失敗しました: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  }, [owner, repo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "今日";
    if (diffDays === 1) return "1日前";
    return `${diffDays}日前`;
  };

  // すべてのアクティビティを時系列で統合
  const getActivities = (): ActivityItem[] => {
    const activities: ActivityItem[] = [];

    // Commits
    commits.forEach((commit) => {
      activities.push({
        id: `commit-${commit.sha}`,
        type: "commit",
        title: commit.commit?.message?.split("\n")[0] || "No message",
        date: commit.commit?.author?.date || new Date().toISOString(),
        author: commit.author?.login || commit.commit?.author?.name || "Unknown",
        avatar: commit.author?.avatar_url,
        data: commit,
      });
    });

    // Issues
    issues.forEach((issue) => {
      activities.push({
        id: `issue-${issue.id}`,
        type: "issue",
        title: issue.title || "No title",
        date: issue.updated_at || issue.created_at || new Date().toISOString(),
        author: issue.user?.login || "Unknown",
        data: issue,
      });
    });

    // Pull Requests
    pullRequests.forEach((pr) => {
      activities.push({
        id: `pr-${pr.id}`,
        type: "pull_request",
        title: pr.title || "No title",
        date: pr.updated_at || pr.created_at || new Date().toISOString(),
        author: pr.user?.login || "Unknown",
        data: pr,
      });
    });

    // 日付でソート（新しい順）
    return activities.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  };

  const activities = getActivities();

  const getStatusBadge = (state: string, mergedAt: string | null) => {
    if (mergedAt) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
          マージ済み
        </span>
      );
    }
    if (state === "open") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
          未対応
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
        クローズ済み
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ヘッダー */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-900 dark:bg-gray-100 rounded flex items-center justify-center">
                <div className="grid grid-cols-3 gap-0.5">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-white dark:bg-gray-900 rounded" />
                  ))}
                </div>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">DevBoard</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition-colors flex items-center gap-2">
                <span>+</span>
                <span>リポジトリ追加</span>
              </button>
              <div className="w-8 h-8 rounded-full bg-purple-500 dark:bg-purple-600 flex items-center justify-center text-white font-semibold">
                R
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 統計情報 */}
        <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          <span>総数 {activities.length}</span>
          <span className="mx-2">|</span>
          <span>コミット {commits.length}</span>
          <span className="mx-2">|</span>
          <span>Issues {issues.length}</span>
          <span className="mx-2">|</span>
          <span>Pull Requests {pullRequests.length}</span>
        </div>

        {/* タブ */}
        <div className="flex gap-4 mb-6 border-b dark:border-gray-700">
          <button
            onClick={() => setActiveTab("kanban")}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              activeTab === "kanban"
                ? "border-green-500 dark:border-green-400 text-green-600 dark:text-green-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <span>📦</span>
              <span>カンバン</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("recent")}
            className={`pb-3 px-1 border-b-2 transition-colors relative ${
              activeTab === "recent"
                ? "border-green-500 dark:border-green-400 text-green-600 dark:text-green-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <span>🔔</span>
              <span>最近の更新</span>
              {issues.length + pullRequests.length > 0 && (
                <span className="w-5 h-5 bg-green-500 dark:bg-green-600 text-white rounded-full text-xs flex items-center justify-center">
                  {issues.length + pullRequests.length}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* コンテンツ */}
        {activeTab === "recent" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              最近のアクティビティ
            </h2>

            {loading ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                読み込み中...
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                <div className="text-red-800 dark:text-red-300 font-medium mb-2">エラーが発生しました</div>
                <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
                <button
                  onClick={fetchData}
                  className="mt-4 px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
                >
                  再試行
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {activities.length > 0 ? (
                  activities.map((activity) => {
                    if (activity.type === "commit") {
                      const commit = activity.data as Commit;
                      return (
                        <div
                          key={activity.id}
                          className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex items-start gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex-shrink-0">
                            {activity.avatar ? (
                              <img
                                src={activity.avatar}
                                alt={activity.author}
                                className="w-8 h-8 rounded-full"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs text-gray-600 dark:text-gray-300">
                                {activity.author?.charAt(0)?.toUpperCase() || "?"}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-blue-500 dark:text-blue-400 text-sm">💬</span>
                              <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                {activity.title}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {activity.author} • {formatDate(activity.date)} • {owner}/{repo}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    if (activity.type === "issue") {
                      const issue = activity.data as Issue;
                      return (
                        <div
                          key={activity.id}
                          className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex items-start justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <span className="text-orange-500 dark:text-orange-400 text-xl flex-shrink-0">⏰</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {activity.title}
                                </span>
                                {issue.labels.length > 0 && (
                                  <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full flex-shrink-0">
                                    {issue.labels[0].name}
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {owner}/{repo} #{issue.number} • {activity.author} • {formatDate(activity.date)}
                              </div>
                            </div>
                          </div>
                          <div className="flex-shrink-0 ml-4">
                            {getStatusBadge(issue.state, null)}
                          </div>
                        </div>
                      );
                    }

                    if (activity.type === "pull_request") {
                      const pr = activity.data as PullRequest;
                      return (
                        <div
                          key={activity.id}
                          className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex items-start justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <span className="text-purple-500 dark:text-purple-400 text-xl flex-shrink-0">🔄</span>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 dark:text-gray-100 mb-1 truncate">
                                {activity.title}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {owner}/{repo} #{pr.number} • {activity.author} • {formatDate(activity.date)}
                              </div>
                            </div>
                          </div>
                          <div className="flex-shrink-0 ml-4">
                            {getStatusBadge(pr.state, pr.merged_at)}
                          </div>
                        </div>
                      );
                    }

                    return null;
                  })
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    データがありません
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "kanban" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">カンバン</h2>
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              カンバンビューは準備中です
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
