'use server';

/**
 * @fileOverview Generate parking tips AI agent.
 *
 * - generateParkingTips - A function that handles the generate parking tips process.
 * - GenerateParkingTipsInput - The input type for the generateParkingTips function.
 * - GenerateParkingTipsOutput - The return type for the generateParkingTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateParkingTipsInputSchema = z.object({
  userBookingHistory: z
    .string()
    .describe('The past booking behavior of the user.'),
});
export type GenerateParkingTipsInput = z.infer<typeof GenerateParkingTipsInputSchema>;

const GenerateParkingTipsOutputSchema = z.object({
  parkingTip: z.string().describe('The AI generated parking tip for the user.'),
});
export type GenerateParkingTipsOutput = z.infer<typeof GenerateParkingTipsOutputSchema>;

export async function generateParkingTips(input: GenerateParkingTipsInput): Promise<GenerateParkingTipsOutput> {
  return generateParkingTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateParkingTipsPrompt',
  input: {schema: GenerateParkingTipsInputSchema},
  output: {schema: GenerateParkingTipsOutputSchema},
  prompt: `You are an expert parking assistant AI, and you will generate parking tips based on the user's past booking behavior.

User Booking History: {{{userBookingHistory}}}

Based on this information, generate a concise and helpful parking tip to the user.`,
});

const generateParkingTipsFlow = ai.defineFlow(
  {
    name: 'generateParkingTipsFlow',
    inputSchema: GenerateParkingTipsInputSchema,
    outputSchema: GenerateParkingTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
