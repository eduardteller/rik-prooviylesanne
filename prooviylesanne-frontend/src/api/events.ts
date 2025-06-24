import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface Event {
	id: number;
	nimi: string;
	aeg: string;
	koht: string;
	lisainfo: string;
	isikudCount: number;
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
