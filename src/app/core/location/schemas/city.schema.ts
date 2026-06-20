import { z } from 'zod';

export const citySchema = z.object({
  id: z.number(),
  country: z.string(),
  city: z.string(),
  population: z.number(),
});

export type City = z.infer<typeof citySchema>;
