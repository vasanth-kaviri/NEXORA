/**
 * Real GitHub REST API Integration.
 * Fetches real open-source repositories and portfolio templates for students.
 */

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

export const githubApi = {
  /**
   * Fetches real open-source repositories from GitHub
   * @param {string} topic - e.g. 'react', 'machine-learning', 'distributed-systems'
   * @param {number} limit - maximum results (default 6)
   */
  async getTrendingProjects(topic = 'web-development', limit = 6) {
    try {
      const headers = {
        Accept: 'application/vnd.github.v3+json'
      };
      if (GITHUB_TOKEN) {
        headers.Authorization = `token ${GITHUB_TOKEN}`;
      }

      const query = encodeURIComponent(`topic:${topic} stars:>200`);
      const url = `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=${limit}`;

      const res = await fetch(url, { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          return {
            success: true,
            isLive: true,
            projects: data.items.map((repo) => ({
              id: `gh_${repo.id}`,
              title: repo.name,
              fullName: repo.full_name,
              desc: repo.description || 'Open-source system architecture reference repository.',
              tags: repo.topics && repo.topics.length > 0 ? repo.topics.slice(0, 4) : [repo.language || 'Code'],
              stars: (repo.stargazers_count / 1000).toFixed(1) + 'k',
              rawStars: repo.stargazers_count,
              forks: repo.forks_count,
              url: repo.html_url,
              owner: {
                name: repo.owner.login,
                avatar: repo.owner.avatar_url
              },
              language: repo.language,
              difficulty: repo.stargazers_count > 5000 ? 'Advanced' : (repo.stargazers_count > 1000 ? 'Intermediate' : 'Beginner'),
              duration: '2–3 weeks'
            }))
          };
        }
      }
    } catch (err) {
      console.warn('[githubApi] GitHub public API rate-limit or network notice:', err.message);
    }

    return { success: false, isLive: false, projects: [] };
  }
};

export default githubApi;
