/**
 * Adzuna & Curated Job Search Integration.
 * Provides unified job listings with real API connectivity and offline fallback.
 */

const ADZUNA_APP_ID = import.meta.env.VITE_ADZUNA_APP_ID;
const ADZUNA_APP_KEY = import.meta.env.VITE_ADZUNA_APP_KEY;

export const jobsApi = {
  isConfigured() {
    return Boolean(ADZUNA_APP_ID && ADZUNA_APP_KEY);
  },

  /**
   * Fetches real jobs from Adzuna API or fallback curated listings
   * @param {object} params - { query, location, country, page }
   * @param {Array} fallbackJobs - Existing curated jobs
   * @returns {Promise<{ jobs: Array, isLive: boolean, total: number }>}
   */
  async searchJobs(params = {}, fallbackJobs = []) {
    const { query = 'software engineer', location = '', country = 'in', page = 1 } = params;

    if (ADZUNA_APP_ID && ADZUNA_APP_KEY) {
      try {
        const targetCountry = country.toLowerCase() === 'us' ? 'us' : (country.toLowerCase() === 'gb' ? 'gb' : 'in');
        const url = `https://api.adzuna.com/v1/api/jobs/${targetCountry}/search/${page}?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&what=${encodeURIComponent(query)}&where=${encodeURIComponent(location)}&content-type=application/json`;

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.results && data.results.length > 0) {
            const mapped = data.results.map((item, idx) => ({
              id: `adzuna_${item.id || idx}`,
              title: item.title ? item.title.replace(/<\/?[^>]+(>|$)/g, '') : 'Software Engineer',
              company: item.company?.display_name || 'Technology Company',
              logo: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(item.company?.display_name || 'Tech')}`,
              location: item.location?.display_name || 'Remote',
              salary: item.salary_min && item.salary_max 
                ? `$${Math.round(item.salary_min / 1000)}k - $${Math.round(item.salary_max / 1000)}k / yr`
                : (item.salary_is_predicted ? 'Competitive Market Rate' : 'Salary Disclosed Upon Match'),
              type: item.contract_time === 'part_time' ? 'Part-Time' : 'Full-Time',
              batch: '2026 Batch',
              match: Math.floor(88 + Math.random() * 11),
              remote: item.location?.display_name?.toLowerCase().includes('remote') || false,
              deadline: 'Open Application',
              tags: [item.category?.label || 'Engineering', 'Software', 'Full-Stack'],
              desc: item.description ? item.description.replace(/<\/?[^>]+(>|$)/g, '').slice(0, 320) + '...' : 'Exciting software engineering role at a fast-growing technology organization.',
              responsibilities: [
                'Build robust services following clean architecture principles.',
                'Collaborate cross-functionally with product managers and senior engineers.',
                'Ensure high automated test coverage and zero regressions.'
              ],
              requirements: [
                'Bachelor degree in Computer Science or related quantitative field.',
                'Proficiency in modern programming languages and distributed systems.',
                'Demonstrated problem solving ability and strong collaboration skills.'
              ],
              applyUrl: item.redirect_url
            }));

            return { jobs: mapped, isLive: true, total: data.count || mapped.length };
          }
        }
      } catch (err) {
        console.warn('[jobsApi] Adzuna live search failed (falling back to curated jobs):', err.message);
      }
    }

    // Curated Fallback
    await new Promise((r) => setTimeout(r, 300));
    let filtered = [...fallbackJobs];
    if (query && query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(j => 
        j.title?.toLowerCase().includes(q) || 
        j.company?.toLowerCase().includes(q) ||
        j.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    return { jobs: filtered, isLive: false, total: filtered.length };
  }
};

export default jobsApi;
