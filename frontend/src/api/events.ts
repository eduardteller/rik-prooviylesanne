import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * Ürituse andmete tüüp, mis sisaldab kogu vajalikku infot ürituse kohta
 */
export interface Event {
	id: number;
	nimi: string;
	aeg: string;
	koht: string;
	lisainfo: string;
	isikudCount: number;
}

/**
 * Uue ürituse loomise andmete tüüp
 */
export interface CreateEventRequest {
	nimi: string;
	aeg: string;
	koht: string;
	lisainfo: string;
}

/**
 * Kõikide ürituste andmete pärimine serverist
 */
const fetchEvents = async (): Promise<Event[]> => {
	const response = await fetch('http://localhost:8080/get-yritused');

	if (!response.ok) {
		throw new Error('Failed to fetch events');
	}

	return response.json();
};

/**
 * Konkreetse ürituse kustutamine ID järgi
 */
const deleteEvent = async (id: number): Promise<void> => {
	const response = await fetch(`http://localhost:8080/delete-yritus?id=${id}`, {
		method: 'GET',
	});

	if (!response.ok) {
		throw new Error('Failed to delete event');
	}
};

/**
 * Uue ürituse loomine serveris
 */
const createEvent = async (eventData: CreateEventRequest): Promise<void> => {
	const response = await fetch('http://localhost:8080/add-yritus', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(eventData),
	});

	if (!response.ok) {
		throw new Error('Failed to create event');
	}
};

/**
 * Konkreetse ürituse andmete pärimine ID järgi
 */
const fetchEvent = async (id: string): Promise<Event> => {
	const response = await fetch(`http://localhost:8080/get-yritused?id=${id}`);

	if (!response.ok) {
		throw new Error('Failed to fetch event');
	}

	return response.json();
};

/**
 * React Query hook kõikide ürituste andmete laadimiseks
 * Sisaldab automaatset vahemällu salvestamist ja uuendamist
 */
export const useEvents = () => {
	return useQuery({
		queryKey: ['events'],
		queryFn: fetchEvents,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
};

/**
 * React Query mutatsioon ürituse kustutamiseks
 * Pärast edukat kustutamist uuendab automaatselt ürituste nimekirja
 */
export const useDeleteEvent = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteEvent,
		onSuccess: () => {
			// Invalidate and refetch events after successful deletion
			queryClient.invalidateQueries({ queryKey: ['events'] });
		},
	});
};

/**
 * React Query mutatsioon uue ürituse loomiseks
 * Pärast edukat loomist uuendab automaatselt ürituste nimekirja
 */
export const useCreateEvent = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createEvent,
		onSuccess: () => {
			// Invalidate and refetch events after successful creation
			queryClient.invalidateQueries({ queryKey: ['events'] });
		},
	});
};

/**
 * React Query hook konkreetse ürituse andmete laadimiseks
 * Käivitub ainult siis, kui ID on olemas
 */
export const useEvent = (id: string) => {
	return useQuery({
		queryKey: ['event', id],
		queryFn: () => fetchEvent(id),
		enabled: !!id, // Only run query if id is provided
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
};

/**
 * Ürituste jaotamine tulevasteks ja toimunud üritusteks
 * Tagastab mõlemad nimekirjad kuupäeva järgi sorteerituna
 */
export const categorizeEvents = (events: Event[]) => {
	const now = new Date();

	const upcomingEvents = events.filter((event) => new Date(event.aeg) > now);
	const pastEvents = events.filter((event) => new Date(event.aeg) <= now);

	return {
		upcomingEvents: upcomingEvents.sort(
			(a, b) => new Date(a.aeg).getTime() - new Date(b.aeg).getTime()
		),
		pastEvents: pastEvents.sort(
			(a, b) => new Date(b.aeg).getTime() - new Date(a.aeg).getTime()
		),
	};
};

/**
 * Kuupäeva vormindamine eesti keelse kuupäeva kuvamiseks
 */
export const formatDate = (dateString: string): string => {
	const date = new Date(dateString);
	return date.toLocaleDateString('et-EE', {
		day: '2-digit',
		month: '2-digit',
		year: '2-digit',
	});
};
