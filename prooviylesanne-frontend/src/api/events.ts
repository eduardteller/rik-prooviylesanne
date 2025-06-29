import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface Event {
	id: number;
	nimi: string;
	aeg: string;
	koht: string;
	lisainfo: string;
	isikudCount: number;
}

export interface CreateEventRequest {
	nimi: string;
	aeg: string;
	koht: string;
	lisainfo: string;
}

const fetchEvents = async (): Promise<Event[]> => {
	const response = await fetch('http://localhost:8080/get-yritused');

	if (!response.ok) {
		throw new Error('Failed to fetch events');
	}

	return response.json();
};

const deleteEvent = async (id: number): Promise<void> => {
	const response = await fetch(`http://localhost:8080/delete-yritus?id=${id}`, {
		method: 'GET',
	});

	if (!response.ok) {
		throw new Error('Failed to delete event');
	}
};

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

const fetchEvent = async (id: string): Promise<Event> => {
	const response = await fetch(`http://localhost:8080/get-yritused?id=${id}`);

	if (!response.ok) {
		throw new Error('Failed to fetch event');
	}

	return response.json();
};

export const useEvents = () => {
	return useQuery({
		queryKey: ['events'],
		queryFn: fetchEvents,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
};

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

export const useEvent = (id: string) => {
	return useQuery({
		queryKey: ['event', id],
		queryFn: () => fetchEvent(id),
		enabled: !!id, // Only run query if id is provided
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
};

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

export const formatDate = (dateString: string): string => {
	const date = new Date(dateString);
	return date.toLocaleDateString('et-EE', {
		day: '2-digit',
		month: '2-digit',
		year: '2-digit',
	});
};
