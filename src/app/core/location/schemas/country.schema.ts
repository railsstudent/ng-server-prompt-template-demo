import { z } from 'zod';

export const countrySchema = z.object({
  name: z.string(),
  code: z.string(),
});

export type Country = z.infer<typeof countrySchema>;
