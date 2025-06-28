import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface MaksmiseViis {
	id: number;
	maksmiseViis: string;
}

export interface FyysilineIsik {
	id: number;
	eesnimi: string;
	perekonnanimi: string;
	isikukood: string;
	maksmiseViis: MaksmiseViis;
	lisainfo: string;
}

export interface JuriidilineIsik {
	id: number;
	nimi: string;
	registrikood: string;
	osavotjateArv: string;
	maksmiseViis: MaksmiseViis;
	lisainfo: string;
}

export interface ParticipantsResponse {
	fyysilisedIsikud: FyysilineIsik[];
	juriidilisedIsikud: JuriidilineIsik[];
}

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

const fetchParticipants = async (
	yritusId: string
): Promise<ParticipantsResponse> => {
	const response = await fetch(
		`http://localhost:8080/api/isikud/get-isikud?yritusId=${yritusId}`
	);

	if (!response.ok) {
		throw new Error('Failed to fetch participants');
	}

	return response.json();
};

export const useAddEraisik = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addEraisik,
		onSuccess: (_, variables) => {
			// Invalidate and refetch participants after successful creation
			if (variables.yritusId) {
				queryClient.invalidateQueries({
					queryKey: ['participants', variables.yritusId],
				});
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
			if (variables.yritusId) {
				queryClient.invalidateQueries({
					queryKey: ['participants', variables.yritusId],
				});
				queryClient.invalidateQueries({
					queryKey: ['event', variables.yritusId],
				});
			}
		},
	});
};

export const useParticipants = (yritusId: string) => {
	return useQuery({
		queryKey: ['participants', yritusId],
		queryFn: () => fetchParticipants(yritusId),
		enabled: !!yritusId, // Only run query if yritusId is provided
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
};
