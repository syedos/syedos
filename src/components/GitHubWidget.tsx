import { useState, useEffect, useCallback, useMemo } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { differenceInDays } from "date-fns";
import ScrambleText from "@/components/ScrambleText";

const USERNAME = "syedos";
const START_DATE = new Date(2026, 1, 8); // Feb 8, 2026
const CACHE_KEY = "github-widget-stats-cache";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
let fetchInFlight = false;

interface GitHubWidgetProps {
  infected: boolean;
}

interface GitHubStats {
  contributions: number;
  commits: number;
  streak: number;
}

interface CachedGitHubStats extends GitHubStats {
  timestamp: number;
}

const getCachedStats = (): CachedGitHubStats | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<CachedGitHubStats>;
    if (
      typeof parsed.contributions === "number" &&
      typeof parsed.commits === "number" &&
      typeof parsed.streak === "number" &&
      typeof parsed.timestamp === "number"
    ) {
      return parsed as CachedGitHubStats;
    }
  } catch {
    // Ignore malformed cache
  }

  return null;
};

const setCachedStats = (stats: GitHubStats) => {
  if (typeof window === "undefined") return;

  try {
    const payload: CachedGitHubStats = { ...stats, timestamp: Date.now() };
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage write failures
  }
};

const GitHubWidget = ({ infected }: GitHubWidgetProps) => {
  const [stats, setStats] = useState<GitHubStats>(() => {
    const cached = getCachedStats();
    return cached
      ? { contributions: cached.contributions, commits: cached.commits, streak: cached.streak }
      : { contributions: 0, commits: 0, streak: 0 };
  });

  const daysActive = useMemo(() => Math.max(1, differenceInDays(new Date(), START_DATE)), []);
  const avgPerDay = useMemo(() => Math.round(stats.contributions / daysActive), [stats.contributions, daysActive]);

  useEffect(() => {
    if (fetchInFlight) return;
    fetchInFlight = true;

    const fetchStats = async () => {
      const cached = getCachedStats();
      let contributions = cached?.contributions ?? 0;
      let commits = cached?.commits ?? 0;
      let streak = cached?.streak ?? 0;
      let latestContributionTotal = 0;

      try {
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`);
        if (res.ok) {
          const data = await res.json();

          const startStr = START_DATE.toISOString().split("T")[0];
          const contributionRows: Array<{ date: string; count: number }> = data.contributions || [];

          const filtered = contributionRows.filter((c) => c.date >= startStr);
          const total = filtered.reduce((sum, c) => sum + c.count, 0);
          latestContributionTotal = total;

          let nextStreak = 0;
          const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date));
          for (const day of sorted) {
            if (day.count > 0) nextStreak++;
            else break;
          }

          if (total > 0) {
            contributions = total;
            streak = nextStreak;
          }
        }

        const shouldFetchCommits = !cached || Date.now() - cached.timestamp > CACHE_TTL_MS || cached.commits === 0;

        if (shouldFetchCommits) {
          try {
            const commitRes = await fetch(`https://api.github.com/search/commits?q=author:${USERNAME}`, {
              headers: { Accept: "application/vnd.github.cloak-preview+json" },
            });

            // Skip on rate-limit — keep cached value
            if (commitRes.status === 403 || commitRes.status === 429) {
              // rate-limited, keep existing commits value
            } else if (commitRes.ok) {
              const commitData = await commitRes.json();
              const apiCommits = Number(commitData.total_count) || 0;
              if (apiCommits > 0) commits = apiCommits;
            }
          } catch {
            // Keep cached commits value on failure
          }
        }

        if (commits === 0) {
          const fallbackCommits = Math.max(contributions, latestContributionTotal, cached?.commits ?? 0);
          if (fallbackCommits > 0) commits = fallbackCommits;
        }

        const nextStats = { contributions, commits, streak };

        if (nextStats.contributions > 0 || nextStats.commits > 0 || nextStats.streak > 0) {
          setStats(nextStats);
          setCachedStats(nextStats);
        }
      } catch {
        // Keep cached stats on failure
      } finally {
        fetchInFlight = false;
      }
    };

    fetchStats();
  }, []);

  const filterFromStart = useCallback((contributions: Array<{ date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }>) => {
    const startStr = START_DATE.toISOString().split("T")[0];
    return contributions.filter((c) => c.date >= startStr);
  }, []);

  const theme: { dark: [string, string] } = {
    dark: ["hsl(0, 0%, 12%)", "hsl(120, 70%, 50%)"],
  };

  return (
    <a
      href={`https://github.com/${USERNAME}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-2 cursor-pointer"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 mb-3 text-xs font-mono text-muted-foreground">
        <span className="w-2 h-2 rounded-full bg-accent-icon animate-pulse" />
        <ScrambleText text={`github/${USERNAME}`} infected={infected} />
      </div>

      {/* Calendar */}
      <div className="overflow-hidden mb-3 [&_.react-activity-calendar]:!overflow-hidden">
        <GitHubCalendar
          username={USERNAME}
          transformData={filterFromStart}
          showColorLegend={false}
          showMonthLabels={false}
          showTotalCount={false}
          blockSize={7}
          blockMargin={1}
          fontSize={10}
          colorScheme="dark"
          theme={theme}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[11px]">
        <div className="text-muted-foreground">
          <ScrambleText text="contributions:" infected={infected} />
        </div>
        <div className="text-foreground">
          <ScrambleText text={String(stats.contributions)} infected={infected} />
        </div>
        <div className="text-muted-foreground">
          <ScrambleText text="streak:" infected={infected} />
        </div>
        <div className="text-foreground">
          <ScrambleText text={`${stats.streak} days`} infected={infected} />
        </div>
        <div className="text-muted-foreground">
          <ScrambleText text="active:" infected={infected} />
        </div>
        <div className="text-foreground">
          <ScrambleText text={`${daysActive} days`} infected={infected} />
        </div>
        <div className="text-muted-foreground">
          <ScrambleText text="avg:" infected={infected} />
        </div>
        <div className="text-accent-icon">
          <ScrambleText text={`${avgPerDay}/day`} infected={infected} />
        </div>
      </div>
    </a>
  );
};

export default GitHubWidget;

