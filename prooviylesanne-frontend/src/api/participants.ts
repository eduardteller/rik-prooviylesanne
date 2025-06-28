import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface EraisikRequest {
	eesnimi: string;
	perekonnanimi: string;
	isikukood: string;
	maksmiseViis: string;
	lisainfo?: string;
	yritusId?: string;
}

export interface EttevoteRequest {
	nimi: string;
	registrikood: string;
	osavotjateArv: string;
	maksmiseViis: string;
	lisainfo?: string;
	yritusId?: string;
}

const addEraisik = async (data: EraisikRequest): Promise<void> => {
	const response = await fetch(
		'http://localhost:8080/api/isikud/add-fyysiline-isik',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		}
	);

	if (!response.ok) {
		throw new Error('Failed to add eraisik');
	}
};

const addEttevote = async (data: EttevoteRequest): Promise<void> => {
	const response = await fetch(
		'http://localhost:8080/api/isikud/add-juriidiline-isik',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		}
	);

	if (!response.ok) {
		throw new Error('Failed to add ettevote');
	}
};

export const useAddEraisik = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addEraisik,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['participants'] });
			if (variables.yritusId) {
				queryClient.invalidateQueries({
					queryKey: ['event', variables.yritusId],
				});
			}
		},
	});
};

export const useAddEttevote = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addEttevote,
		onSuccess: (_, variables) => {
			// Invalidate and refetch participants after successful creation
			queryClient.invalidateQueries({ queryKey: ['participants'] });
			// Also invalidate the specific event to update participant count
			if (variables.yritusId) {
				queryClient.invalidateQueries({
					queryKey: ['event', variables.yritusId],
				});
			}
		},
	});
};
