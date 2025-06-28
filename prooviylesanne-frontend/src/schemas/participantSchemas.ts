import { z } from 'zod';

export const eraisikSchema = z.object({
	eesnimi: z.string().min(1, 'Eesnimi on kohustuslik'),
	perekonnanimi: z.string().min(1, 'Perekonnanimi on kohustuslik'),
	isikukood: z
		.string()
		.min(11, 'Isikukood peab olema vähemalt 11 märki')
		.max(11, 'Isikukood peab olema täpselt 11 märki'),
	maksmiseViis: z.string().min(1, 'Maksmisviis on kohustuslik'),
	lisainfo: z.string().optional(),
});

export const ettevoteSchema = z.object({
	nimi: z.string().min(1, 'Nimi on kohustuslik'),
	registrikood: z
		.string()
		.min(8, 'Registrikood on kohustuslik')
		.max(8, 'Registrikood peab olema täpselt 8 märki'),
	osavotjateArv: z.string().min(1, 'Osavõtjate arv on kohustuslik'),
	maksmiseViis: z.string().min(1, 'Maksmisviis on kohustuslik'),
	lisainfo: z.string().optional(),
});

export type EraisikFormData = z.infer<typeof eraisikSchema>;
export type EttevoteFormData = z.infer<typeof ettevoteSchema>;
