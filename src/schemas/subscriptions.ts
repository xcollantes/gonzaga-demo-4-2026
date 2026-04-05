/**
 * Subscription schemas and types.
 */

// Subscription tier enum
export enum SubscriptionTier {
  FREE = "FREE",
  PREMIUM = "PREMIUM",
  // ADD_TIER: Add new subscription tiers here
}

// Type for Stripe plan prices
export type PlanPrice = {
  priceId: string;
  currency: string;
  unitAmount: number;
  interval: string | null;
  intervalCount: number | null;
};

// Type for plans from Stripe
export type StripePlan = {
  planId: string;
  displayName: string;
  description: string | null;
  metadata: Record<string, string>;
  prices: PlanPrice[];
  taglines?: string[] | null;
  adsEnabled?: boolean;
  subscriptionTier?: SubscriptionTier;
  // Additional fields used in the component
  price?: number;
  interval?: 'month' | 'year';
  features?: string[];
  priceId?: string;
};

// Available plans can be either from Stripe or local enum
export type AvailablePlansType = Record<string, StripePlan>;

// Usage metrics type
export type UsageMetrics = {
  adsEnabled: boolean;
};

// Usage response type
export type UsageResponseType = {
  nextDailyRefreshTs: string;
  planId: string;
  usage_metrics: UsageMetrics;
};

// Purchase links types
export type PurchasePackage = {
  identifier: string;
  offering: string | null;
  title: string | null;
  description: string | null;
  price: number;
  webCheckoutUrl: string | null;
};

export type PurchaseLinksType = {
  packages: PurchasePackage[] | null;
};