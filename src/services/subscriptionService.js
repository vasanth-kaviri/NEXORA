import db from './db';

/**
 * Subscription and Billing Service.
 * Formatted for Stripe Checkout & Razorpay webhook integration.
 */

const SUBSCRIPTION_STORAGE_KEY = 'nexora_user_subscription';

export const PLANS = {
  FREE: {
    id: 'free',
    name: 'Free Starter',
    price: 0,
    interval: 'forever',
    features: ['Standard Roadmap Access', '5 AI Mentor Prompts/day', 'Explore Jobs & Hackathons', 'Basic Resume Check']
  },
  PRO: {
    id: 'pro',
    name: 'NEXORA Pro Career',
    price: 12,
    interval: 'month',
    features: [
      'Unlimited AI Mentor Chats',
      'AI Mock Interview Simulator with Live Scoring',
      'Direct Recruiter Match & Priority Job Feed',
      'Full Resume Deep ATS Scan & Optimizer',
      'Verified Certificate of Completion'
    ]
  },
  CAMPUS: {
    id: 'campus',
    name: 'University Campus Pass',
    price: 29,
    interval: 'semester',
    features: [
      'All Pro Features Included',
      'Cohort Peer Projects & Hackathon Teams',
      'Exclusive 1-on-1 Mentor Office Hours',
      'Alumni Referral Pipeline'
    ]
  }
};

export const subscriptionService = {
  /**
   * Retrieves current active subscription tier
   */
  getCurrentSubscription() {
    try {
      const stored = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn(e);
    }
    return {
      tier: 'free',
      status: 'active',
      plan: PLANS.FREE,
      startedAt: new Date().toISOString()
    };
  },

  /**
   * Simulates checkout flow with payment gateway latency
   */
  async upgradePlan(planId) {
    const targetPlan = Object.values(PLANS).find((p) => p.id === planId) || PLANS.PRO;

    // Simulate Stripe checkout redirection and latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    const subscription = {
      tier: targetPlan.id,
      status: 'active',
      plan: targetPlan,
      startedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      transactionId: `txn_${Date.now()}`
    };

    localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(subscription));

    // Update user profile badge
    const user = db.getCurrentUser();
    if (user) {
      user.plan = targetPlan.id;
      db.updateUserProfile(user);
    }

    window.dispatchEvent(new Event('nexora_subscription_updated'));
    return { success: true, subscription };
  },

  /**
   * Cancels active subscription
   */
  async cancelSubscription() {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const freeSub = {
      tier: 'free',
      status: 'active',
      plan: PLANS.FREE,
      startedAt: new Date().toISOString()
    };
    localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(freeSub));
    window.dispatchEvent(new Event('nexora_subscription_updated'));
    return { success: true };
  }
};

export default subscriptionService;
