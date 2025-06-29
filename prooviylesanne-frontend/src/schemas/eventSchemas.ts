import { z } from 'zod';

export const eventSchema = z.object({
	nimi: z.string().min(1, 'Ürituse nimi on kohustuslik'),
	aeg: z
		.string()
		.min(1, 'Toimumisaeg on kohustuslik')
		.refine((value) => {
			const selectedDate = new Date(value);
			const now = new Date();
			return selectedDate > now;
		}, 'Toimumisaeg peab olema tulevikus'),
	koht: z.string().min(1, 'Koht on kohustuslik'),
	lisainfo: z.string().optional(),
});

export type EventFormData = z.infer<typeof eventSchema>;
