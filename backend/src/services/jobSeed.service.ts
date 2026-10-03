import fs from 'fs';
import path from 'path';
import { Job } from '../models/job.model';
import { logger } from '../utils/logger';

/**
 * Automatically seeds 50+ real-world industry jobs into MongoDB Atlas if the collection is empty.
 */
export const seedJobsDatabase = async (): Promise<void> => {
  try {
    const existingCount = await Job.countDocuments();
    if (existingCount > 0) {
      logger.info(`[JobSeedEngine] MongoDB 'jobs' collection already hydrated with ${existingCount} industry roles.`);
      return;
    }

    logger.info('[JobSeedEngine] Jobs collection is empty. Reading exhaustive global taxonomy dataset...');
    
    // Resolve path to globalTaxonomy.json
    const taxonomyPath = path.resolve(__dirname, '../data/globalTaxonomy.json');
    if (!fs.existsSync(taxonomyPath)) {
      logger.warn(`[JobSeedEngine] Taxonomy file not found at: ${taxonomyPath}`);
      return;
    }

    const rawData = fs.readFileSync(taxonomyPath, 'utf8');
    const taxonomyJobs = JSON.parse(rawData);

    if (!Array.isArray(taxonomyJobs) || taxonomyJobs.length === 0) {
      logger.warn('[JobSeedEngine] Global taxonomy JSON was empty or malformed.');
      return;
    }

    const preparedJobs = taxonomyJobs.map((item: any) => ({
      ...item,
      deadline: item.deadline ? new Date(item.deadline) : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    }));

    const result = await Job.insertMany(preparedJobs);
    logger.info(`[JobSeedEngine] Successfully hydrated MongoDB with ${result.length} real-world industry jobs across 6 engineering sectors.`);
  } catch (err: unknown) {
    logger.error('[JobSeedEngine] Error seeding jobs collection:', err);
  }
};

export default seedJobsDatabase;
