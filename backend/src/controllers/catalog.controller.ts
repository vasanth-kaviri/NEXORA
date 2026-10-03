import { Request, Response } from 'express';
import { Resource, Hackathon, Scholarship } from '../models/catalog.model';
import { sendSuccess, sendError } from '../utils/appResponse';
import { logger } from '../utils/logger';

// Seed initial catalogs if empty
const seedCatalogsIfNeeded = async (): Promise<void> => {
  const resourceCount = await Resource.countDocuments();
  if (resourceCount === 0) {
    await Resource.create([
      {
        title: 'System Design Primer & High-Throughput Microservices',
        category: 'System Design',
        type: 'Course & Architecture Guide',
        duration: '12h 45m',
        link: 'https://github.com/donnemartin/system-design-primer',
        description: 'Comprehensive roadmap for designing reliable, scalable, and maintainable systems under massive load.',
        tags: ['System Design', 'Scalability', 'Microservices', 'Caching'],
        rating: 4.9,
        featured: true,
      },
      {
        title: 'Advanced React 19 Patterns & TypeScript Concurrency',
        category: 'Frontend',
        type: 'Interactive Video Lab',
        duration: '6h 30m',
        link: 'https://react.dev',
        description: 'Master server components, suspense boundaries, transitions, and memory-safe custom hooks.',
        tags: ['React', 'TypeScript', 'Frontend', 'Next.js'],
        rating: 4.8,
        featured: true,
      },
      {
        title: 'Distributed Event-Driven Node.js with Kafka & Redis',
        category: 'Backend',
        type: 'Production Lab',
        duration: '8h 15m',
        link: 'https://nodejs.org',
        description: 'Build idempotent event streams, handle backpressure, and implement zero-downtime clustering.',
        tags: ['Node.js', 'Redis', 'Kafka', 'Backend'],
        rating: 4.9,
        featured: true,
      },
      {
        title: 'PostgreSQL Index Tuning & Query Optimization Blueprint',
        category: 'Database',
        type: 'Interactive Guide',
        duration: '4h 10m',
        link: 'https://postgresql.org',
        description: 'Analyze EXPLAIN ANALYZE execution trees, resolve lock contention, and construct partial indexes.',
        tags: ['PostgreSQL', 'SQL', 'Indexing', 'Performance'],
        rating: 4.7,
        featured: false,
      },
      {
        title: 'Production RAG Architectures with LangChain & Vector Embeddings',
        category: 'AI',
        type: 'Deep Dive Course',
        duration: '10h 00m',
        link: 'https://huggingface.co',
        description: 'Construct multi-modal retrieval pipelines, semantic chunking, and reciprocal rank fusion.',
        tags: ['AI/ML', 'RAG', 'Vector DB', 'LLM'],
        rating: 4.9,
        featured: true,
      },
    ]);
    logger.info('[CatalogController] Seeded initial Resource Vault items.');
  }

  const hackathonCount = await Hackathon.countDocuments();
  if (hackathonCount === 0) {
    await Hackathon.create([
      {
        title: 'Smart India Hackathon (SIH 2026)',
        organizer: 'Ministry of Education & AICTE',
        domain: 'Open Innovation & Public Tech',
        prizePool: '₹1,00,00,000 (~$120,000)',
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 35),
        location: 'Hybrid (India)',
        registeredTeams: 12500,
        tags: ['AICTE', 'GovTech', 'Hardware/Software', 'Nationwide'],
        applyUrl: 'https://sih.gov.in',
        featured: true,
      },
      {
        title: 'ETHIndia 2026',
        organizer: 'Devfolio & Ethereum Foundation',
        domain: 'Web3 & Decentralized Systems',
        prizePool: '$100,000 + Venture Grants',
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 48),
        location: 'Bengaluru, India',
        registeredTeams: 3200,
        tags: ['Ethereum', 'DeFi', 'Zero-Knowledge', 'Web3'],
        applyUrl: 'https://ethindia.co',
        featured: true,
      },
      {
        title: 'Google Solution Challenge 2026',
        organizer: 'Google Developer Student Clubs',
        domain: 'AI/ML & Social Impact',
        prizePool: '$12,000 + Google Mentorship',
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
        location: 'Global (Online)',
        registeredTeams: 8400,
        tags: ['Google Cloud', 'Flutter', 'TensorFlow', 'UN Goals'],
        applyUrl: 'https://developers.google.com',
        featured: true,
      },
      {
        title: 'MIT HackMIT 2026',
        organizer: 'Massachusetts Institute of Technology',
        domain: 'AI, Hardware & Future of Computing',
        prizePool: '$35,000',
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 72),
        location: 'Cambridge, MA & Virtual',
        registeredTeams: 1800,
        tags: ['MIT', 'Robotics', 'DeepTech', 'Hackathon'],
        applyUrl: 'https://hackmit.org',
        featured: false,
      },
    ]);
    logger.info('[CatalogController] Seeded premier global & national Hackathons.');
  }

  const scholarshipCount = await Scholarship.countDocuments();
  if (scholarshipCount === 0) {
    await Scholarship.create([
      {
        title: 'Generation Google Scholarship (APAC & Global)',
        provider: 'Google',
        amount: '$2,500 - $10,000',
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 40),
        eligibility: 'Women and underrepresented students enrolled in Computer Science or Gaming',
        targetDomain: 'Computer Science & Software Engineering',
        country: 'Global & APAC',
        applyUrl: 'https://buildyourfuture.withgoogle.com',
        featured: true,
      },
      {
        title: 'Adobe Research Women-in-Technology Fellowship',
        provider: 'Adobe Systems',
        amount: '$10,000 + 1-Year Adobe Creative Cloud + Mentorship',
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 55),
        eligibility: 'Female undergraduate and master students in Computing and Creative Tech',
        targetDomain: 'Artificial Intelligence & Computer Vision',
        country: 'Global',
        applyUrl: 'https://research.adobe.com',
        featured: true,
      },
      {
        title: 'Palantir Global Future Scholarship',
        provider: 'Palantir Technologies',
        amount: '$7,000 + Summer Internship Interview',
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 65),
        eligibility: 'Undergraduate students pursuing STEM degrees',
        targetDomain: 'Data Engineering & Cybersecurity',
        country: 'North America, UK, Europe, India',
        applyUrl: 'https://palantir.com/students',
        featured: true,
      },
      {
        title: 'Inlaks Shivdasani Foundation Scholarships',
        provider: 'Inlaks Foundation',
        amount: 'Up to $100,000 (Full Tuition + Living Costs)',
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 80),
        eligibility: 'Top Indian students admitted to premier universities in US, UK, and Europe',
        targetDomain: 'All STEM & Advanced Engineering Disciplines',
        country: 'India (International Study)',
        applyUrl: 'https://inlaksfoundation.org',
        featured: false,
      },
    ]);
    logger.info('[CatalogController] Seeded premier STEM Scholarships.');
  }
};

// --- Get Resources ------------------------------------------------------------
export const getResources = async (req: Request, res: Response): Promise<void> => {
  try {
    await seedCatalogsIfNeeded();
    const { category, type, search } = req.query;
    const query: any = {};

    if (category && category !== 'all') {
      query.category = new RegExp(String(category), 'i');
    }
    if (type && type !== 'all') {
      query.type = new RegExp(String(type), 'i');
    }
    if (search) {
      query.$or = [
        { title: new RegExp(String(search), 'i') },
        { description: new RegExp(String(search), 'i') },
        { tags: { $in: [new RegExp(String(search), 'i')] } },
      ];
    }

    const resources = await Resource.find(query).sort({ featured: -1, rating: -1 }).lean();
    res.status(200).json(sendSuccess({ resources, count: resources.length }, 'Resources fetched successfully.'));
  } catch (err: any) {
    logger.error('[CatalogController] Error fetching resources:', err?.message || err);
    res.status(500).json(sendError('Failed to fetch resources.', 500));
  }
};

// --- Get Hackathons -----------------------------------------------------------
export const getHackathons = async (req: Request, res: Response): Promise<void> => {
  try {
    await seedCatalogsIfNeeded();
    const { domain, search } = req.query;
    const query: any = {};

    if (domain && domain !== 'all') {
      query.domain = new RegExp(String(domain), 'i');
    }
    if (search) {
      query.$or = [
        { title: new RegExp(String(search), 'i') },
        { organizer: new RegExp(String(search), 'i') },
        { tags: { $in: [new RegExp(String(search), 'i')] } },
      ];
    }

    const hackathons = await Hackathon.find(query).sort({ featured: -1, deadline: 1 }).lean();
    res.status(200).json(sendSuccess({ hackathons, count: hackathons.length }, 'Hackathons fetched successfully.'));
  } catch (err: any) {
    logger.error('[CatalogController] Error fetching hackathons:', err?.message || err);
    res.status(500).json(sendError('Failed to fetch hackathons.', 500));
  }
};

// --- Get Scholarships ---------------------------------------------------------
export const getScholarships = async (req: Request, res: Response): Promise<void> => {
  try {
    await seedCatalogsIfNeeded();
    const { country, search } = req.query;
    const query: any = {};

    if (country && country !== 'all') {
      query.country = new RegExp(String(country), 'i');
    }
    if (search) {
      query.$or = [
        { title: new RegExp(String(search), 'i') },
        { provider: new RegExp(String(search), 'i') },
        { targetDomain: new RegExp(String(search), 'i') },
      ];
    }

    const scholarships = await Scholarship.find(query).sort({ featured: -1, deadline: 1 }).lean();
    res.status(200).json(sendSuccess({ scholarships, count: scholarships.length }, 'Scholarships fetched successfully.'));
  } catch (err: any) {
    logger.error('[CatalogController] Error fetching scholarships:', err?.message || err);
    res.status(500).json(sendError('Failed to fetch scholarships.', 500));
  }
};
