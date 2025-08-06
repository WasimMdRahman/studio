'use server';

/**
 * @fileOverview Parking tip AI agent.
 *
 * - parkingTips - A function that handles the parking tips process.
 * - ParkingTipsInput - The input type for the parkingTips function.
 * - ParkingTipsOutput - The return type for the parkingTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParkingTipsInputSchema = z.object({
  userBookingHistory: z
    .string()
    .describe('The past booking behavior of the user.'),
  currentSlotAvailability: z
    .string()
    .describe('The current availability of parking slots.'),
});
export type ParkingTipsInput = z.infer<typeof ParkingTipsInputSchema>;

const ParkingTipsOutputSchema = z.object({
  parkingTip: z.string().describe('The parking tip for the user.'),
});
export type ParkingTipsOutput = z.infer<typeof ParkingTipsOutputSchema>;

export async function parkingTips(input: ParkingTipsInput): Promise<ParkingTipsOutput> {
  return parkingTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parkingTipsPrompt',
  input: {schema: ParkingTipsInputSchema},
  output: {schema: ParkingTipsOutputSchema},
  prompt: `You are an expert parking assistant, and you will provide parking tips based on the user's past booking behavior and current slot availability.\n\nUser Booking History: {{{userBookingHistory}}}\nCurrent Slot Availability: {{{currentSlotAvailability}}}\n\nBased on this information, provide a concise and helpful parking tip to the user.`,
});

const parkingTipsFlow = ai.defineFlow(
  {
    name: 'parkingTipsFlow',
    inputSchema: ParkingTipsInputSchema,
    outputSchema: ParkingTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
