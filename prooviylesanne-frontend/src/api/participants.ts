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

export interface FyysilineIsikUpdateRequest {
	id: number;
	eesnimi: string;
	perekonnanimi: string;
	isikukood: string;
	maksmiseViis: string;
	lisainfo?: string;
}

export interface JuriidilineIsikUpdateRequest {
	id: number;
	nimi: string;
	registrikood: string;
	osavotjateArv: string;
	maksmiseViis: string;
	lisainfo?: string;
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

const deleteFyysilineIsik = async (id: number): Promise<void> => {
	const response = await fetch(
		`http://localhost:8080/api/isikud/delete-fyysiline-isik?id=${id}`,
		{
			method: 'GET',
		}
	);

	if (!response.ok) {
		throw new Error('Failed to delete fyysiline isik');
	}
};

const deleteJuriidilineIsik = async (id: number): Promise<void> => {
	const response = await fetch(
		`http://localhost:8080/api/isikud/delete-juriidiline-isik?id=${id}`,
		{
			method: 'GET',
		}
	);

	if (!response.ok) {
		throw new Error('Failed to delete juriidiline isik');
	}
};

const fetchFyysilineIsik = async (id: string): Promise<FyysilineIsik> => {
	const response = await fetch(
		`http://localhost:8080/api/isikud/get-fyysiline-isik?id=${id}`
	);

	if (!response.ok) {
		throw new Error('Failed to fetch fyysiline isik');
	}

	return response.json();
};

const fetchJuriidilineIsik = async (id: string): Promise<JuriidilineIsik> => {
	const response = await fetch(
		`http://localhost:8080/api/isikud/get-juriidiline-isik?id=${id}`
	);

	if (!response.ok) {
		throw new Error('Failed to fetch juriidiline isik');
	}

	return response.json();
};

const updateFyysilineIsik = async (
	data: FyysilineIsikUpdateRequest
): Promise<void> => {
	const response = await fetch(
		`http://localhost:8080/api/isikud/update-fyysiline-isik?id=${data.id}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		}
	);

	if (!response.ok) {
		throw new Error('Failed to update fyysiline isik');
	}
};

const updateJuriidilineIsik = async (
	data: JuriidilineIsikUpdateRequest
): Promise<void> => {
	const response = await fetch(
		`http://localhost:8080/api/isikud/update-juriidiline-isik?id=${data.id}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		}
	);

	if (!response.ok) {
		throw new Error('Failed to update juriidiline isik');
	}
};

export const useAddEraisik = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addEraisik,
		onSuccess: (_, variables) => {
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

export const useDeleteFyysilineIsik = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteFyysilineIsik,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['participants'],
			});
		},
	});
};

export const useDeleteJuriidilineIsik = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteJuriidilineIsik,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['participants'],
			});
		},
	});
};

export const useFyysilineIsik = (id: string, enabled = true) => {
	return useQuery({
		queryKey: ['fyysiline-isik', id],
		queryFn: () => fetchFyysilineIsik(id),
		enabled: enabled && !!id,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
};

export const useJuriidilineIsik = (id: string, enabled = true) => {
	return useQuery({
		queryKey: ['juriidiline-isik', id],
		queryFn: () => fetchJuriidilineIsik(id),
		enabled: enabled && !!id,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
};

export const useUpdateFyysilineIsik = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateFyysilineIsik,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ['fyysiline-isik', variables.id.toString()],
			});
			queryClient.invalidateQueries({
				queryKey: ['participants'],
			});
		},
	});
};

export const useUpdateJuriidilineIsik = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateJuriidilineIsik,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ['juriidiline-isik', variables.id.toString()],
			});
			queryClient.invalidateQueries({
				queryKey: ['participants'],
			});
		},
	});
};
