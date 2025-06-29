import { z } from 'zod';

// Eesti isikukoodi valideerimine
const validateIsikukood = (isikukood: string): boolean => {
	// Kontrolli, kas on täpselt 11 numbrit
	if (!/^\d{11}$/.test(isikukood)) {
		return false;
	}

	const digits = isikukood.split('').map(Number);

	// 1. Kontrolli soo ja sajandi numbrit (1-6)
	const genderCentury = digits[0];
	if (genderCentury < 1 || genderCentury > 6) {
		return false;
	}

	// 2-3. Sünniaasta viimased kaks numbrit (00-99) - alati kehtiv
	const yearDigits = digits[1] * 10 + digits[2];

	// 4-5. Sünnikuu (01-12)
	const month = digits[3] * 10 + digits[4];
	if (month < 1 || month > 12) {
		return false;
	}

	// 6-7. Sünnikaeg (01-31)
	const day = digits[5] * 10 + digits[6];
	if (day < 1 || day > 31) {
		return false;
	}

	// Põhiline kuupäeva valideerimine (kontrolli kehtivat päeva kuus)
	const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	if (day > daysInMonth[month - 1]) {
		return false;
	}

	// Lisavalideerimine veebruari jaoks liigaastate puhul
	if (month === 2 && day > 28) {
		// Määra täisaasta soo/sajandi numbri põhjal
		let fullYear;
		if (genderCentury === 1 || genderCentury === 2) {
			fullYear = 1800 + yearDigits;
		} else if (genderCentury === 3 || genderCentury === 4) {
			fullYear = 1900 + yearDigits;
		} else if (genderCentury === 5 || genderCentury === 6) {
			fullYear = 2000 + yearDigits;
		}

		// Kontrolli, kas on liigaasta
		const isLeapYear =
			fullYear &&
			fullYear % 4 === 0 &&
			(fullYear % 100 !== 0 || fullYear % 400 === 0);
		if (day === 29 && !isLeapYear) {
			return false;
		}
	}

	// 8-10. Järjekorranumber (000-999) - alati kehtiv, kuna on lihtsalt numbrid

	// 11. Kontrollnumbri valideerimine kasutades Eesti "Moodul 11" algoritmi
	const weights1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
	const weights2 = [3, 4, 5, 6, 7, 8, 9, 1, 2, 3];

	// Esimese etapi arvutamine
	let sum = 0;
	for (let i = 0; i < 10; i++) {
		sum += digits[i] * weights1[i];
	}

	let checkDigit = sum % 11;

	// Kui jääk on väiksem kui 10, siis see on kontrollnumber
	if (checkDigit < 10) {
		return checkDigit === digits[10];
	}

	// Kui jääk võrdub 10-ga, kasuta teise etapi kaalusid
	sum = 0;
	for (let i = 0; i < 10; i++) {
		sum += digits[i] * weights2[i];
	}
	checkDigit = sum % 11;

	// Kui jääk on väiksem kui 10, siis see on kontrollnumber
	// Kui jääk võrdub 10-ga, siis kontrollnumber on 0
	if (checkDigit < 10) {
		return checkDigit === digits[10];
	} else {
		return digits[10] === 0;
	}
};

export const eraisikSchema = z.object({
	eesnimi: z.string().min(1, 'Eesnimi on kohustuslik'),
	perekonnanimi: z.string().min(1, 'Perekonnanimi on kohustuslik'),
	isikukood: z
		.string()
		.min(11, 'Isikukood peab olema täpselt 11 märki')
		.max(11, 'Isikukood peab olema täpselt 11 märki')
		.refine(validateIsikukood, {
			message: 'Vigane isikukood. Palun kontrollige sisestatud andmeid.',
		}),
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
