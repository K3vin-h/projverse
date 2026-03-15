import { NextResponse } from "next/server";

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  html_url: string;
  author?: {
    login: string;
    avatar_url: string;
  };
}

interface GitHubRepo {
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
  description: string;
  topics: string[];
  open_issues_count: number;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  try {
    const { owner, repo } = await params;

    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }

    const [repoRes, commitsRes, languagesRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers }),
      fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits?per_page=10`,
        { headers }
      ),
      fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, {
        headers,
      }),
    ]);

    if (!repoRes.ok) {
      return NextResponse.json(
        { error: "Repository not found" },
        { status: 404 }
      );
    }

    const repoData: GitHubRepo = await repoRes.json();
    const commitsData: GitHubCommit[] = commitsRes.ok
      ? await commitsRes.json()
      : [];
    const languagesData: Record<string, number> = languagesRes.ok
      ? await languagesRes.json()
      : {};

    const totalBytes = Object.values(languagesData).reduce(
      (a, b) => a + b,
      0
    );
    const languages = Object.entries(languagesData).map(([name, bytes]) => ({
      name,
      percentage: Math.round((bytes / totalBytes) * 100),
    }));

    const commits = commitsData.map((c) => ({
      sha: c.sha.substring(0, 7),
      fullSha: c.sha,
      message: c.commit.message.split("\n")[0],
      author: c.commit.author.name,
      authorLogin: c.author?.login,
      authorAvatar: c.author?.avatar_url,
      date: c.commit.author.date,
      url: c.html_url,
    }));

    return NextResponse.json({
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      mainLanguage: repoData.language,
      lastUpdate: repoData.updated_at,
      description: repoData.description,
      topics: repoData.topics,
      openIssues: repoData.open_issues_count,
      languages,
      commits,
    });
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub data" },
      { status: 500 }
    );
  }
}
