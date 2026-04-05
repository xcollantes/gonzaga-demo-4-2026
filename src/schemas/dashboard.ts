/**
 * Dashboard Zod Schemas
 *
 * This file defines Zod schemas for dashboard-related data validation.
 * These schemas are used to validate dashboard data from forms and API requests.
 */

import { z } from 'zod';

export const dashboardLayoutPropsSchema = z.object({
  children: z.any()
});

export type DashboardLayoutPropsSchema = z.infer<typeof dashboardLayoutPropsSchema>;