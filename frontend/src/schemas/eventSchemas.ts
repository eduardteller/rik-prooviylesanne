import { z } from 'zod';

/**
 * Ürituse andmete valideerimise skeem
 * Määrab reeglid ürituse loomise ja muutmise vormi jaoks
 */
export const eventSchema = z.object({
	nimi: z.string().min(1, 'Ürituse nimi on kohustuslik'),
	aeg: z
		.string()
		.min(1, 'Toimumisaeg on kohustuslik')
		// Kontrollime, et valitud kuupäev on tulevikus
		.refine((value) => {
			const selectedDate = new Date(value);
			const now = new Date();
			return selectedDate > now;
		}, 'Toimumisaeg peab olema tulevikus'),
	koht: z.string().min(1, 'Koht on kohustuslik'),
	lisainfo: z.string().optional(),
});

/**
 * Ürituse vormi andmete tüüp
 * Tuletatud automaatselt valideerimise skeemist
 */
export type EventFormData = z.infer<typeof eventSchema>;
