import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import OsavotjadDetail from '../OsavotjadDetail';

vi.mock('../api/participants', () => ({
	useFyysilineIsik: vi.fn(),
	useJuriidilineIsik: vi.fn(),
	useUpdateFyysilineIsik: vi.fn(),
	useUpdateJuriidilineIsik: vi.fn(),
}));

vi.mock('../components/Header', () => ({
	default: () => <div data-testid="header">Header</div>,
}));

vi.mock('../components/Footer', () => ({
	default: () => <div data-testid="footer">Footer</div>,
}));

vi.mock('react-router', async () => {
	const actual = await vi.importActual('react-router');
	return {
		...actual,
		useParams: vi.fn(),
		useNavigate: vi.fn(),
		useLocation: vi.fn(),
	};
});

import { useLocation, useNavigate, useParams } from 'react-router';
import {
	useFyysilineIsik,
	useJuriidilineIsik,
	useUpdateFyysilineIsik,
	useUpdateJuriidilineIsik,
} from '../api/participants';

const mockAlert = vi.fn();
Object.defineProperty(window, 'alert', {
	value: mockAlert,
	writable: true,
});

const renderWithProviders = (component: React.ReactElement) => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});

	return render(
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>{component}</BrowserRouter>
		</QueryClientProvider>
	);
};

describe('OsavotjadDetail komponent', () => {
	const mockNavigate = vi.fn();
	const mockMutateAsync = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();

		(useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
		(useLocation as ReturnType<typeof vi.fn>).mockReturnValue({
			state: { from: '/test-previous-page' },
		});

		(useUpdateFyysilineIsik as ReturnType<typeof vi.fn>).mockReturnValue({
			mutateAsync: mockMutateAsync,
			isPending: false,
		});
		(useUpdateJuriidilineIsik as ReturnType<typeof vi.fn>).mockReturnValue({
			mutateAsync: mockMutateAsync,
			isPending: false,
		});
	});

	describe('Laadimise olekud', () => {
		it('peaks näitama eraisiku laadimisseisundit', () => {
			(useParams as ReturnType<typeof vi.fn>).mockReturnValue({
				id: '1',
				type: 'eraisik',
			});
			(useFyysilineIsik as ReturnType<typeof vi.fn>).mockReturnValue({
				data: null,
				isLoading: true,
				error: null,
			});
			(useJuriidilineIsik as ReturnType<typeof vi.fn>).mockReturnValue({
				data: null,
				isLoading: false,
				error: null,
			});

			renderWithProviders(<OsavotjadDetail />);

			expect(screen.getByText('Laadimine...')).toBeInTheDocument();
			expect(screen.getByTestId('header')).toBeInTheDocument();
			expect(screen.getByTestId('footer')).toBeInTheDocument();
		});

		it('peaks näitama juriidilise isiku laadimisseisundit', () => {
			(useParams as ReturnType<typeof vi.fn>).mockReturnValue({
				id: '1',
				type: 'juriidiline',
			});
			(useFyysilineIsik as ReturnType<typeof vi.fn>).mockReturnValue({
				data: null,
				isLoading: false,
				error: null,
			});
			(useJuriidilineIsik as ReturnType<typeof vi.fn>).mockReturnValue({
				data: null,
				isLoading: true,
				error: null,
			});

			renderWithProviders(<OsavotjadDetail />);

			expect(screen.getByText('Laadimine...')).toBeInTheDocument();
		});
	});

	describe('Vigade olekud', () => {
		it('peaks näitama eraisiku veateadet', () => {
			(useParams as ReturnType<typeof vi.fn>).mockReturnValue({
				id: '1',
				type: 'eraisik',
			});
			(useFyysilineIsik as ReturnType<typeof vi.fn>).mockReturnValue({
				data: null,
				isLoading: false,
				error: { message: 'Failed to fetch data' },
			});
			(useJuriidilineIsik as ReturnType<typeof vi.fn>).mockReturnValue({
				data: null,
				isLoading: false,
				error: null,
			});

			renderWithProviders(<OsavotjadDetail />);

			expect(
				screen.getByText('Viga andmete laadimisel: Failed to fetch data')
			).toBeInTheDocument();
		});

		it('peaks näitama juriidilise isiku veateadet', () => {
			(useParams as ReturnType<typeof vi.fn>).mockReturnValue({
				id: '1',
				type: 'juriidiline',
			});
			(useFyysilineIsik as ReturnType<typeof vi.fn>).mockReturnValue({
				data: null,
				isLoading: false,
				error: null,
			});
			(useJuriidilineIsik as ReturnType<typeof vi.fn>).mockReturnValue({
				data: null,
				isLoading: false,
				error: { message: 'Network error' },
			});

			renderWithProviders(<OsavotjadDetail />);

			expect(
				screen.getByText('Viga andmete laadimisel: Network error')
			).toBeInTheDocument();
		});
	});

	describe('Eraisiku vorm', () => {
		const mockEraisikData = {
			id: 1,
			eesnimi: 'Test',
			perekonnanimi: 'User',
			isikukood: '50307160336',
			maksmiseViis: { id: 1, maksmiseViis: 'sularaha' },
			lisainfo: 'Test info',
		};

		beforeEach(() => {
			(useParams as ReturnType<typeof vi.fn>).mockReturnValue({
				id: '1',
				type: 'eraisik',
			});
			(useFyysilineIsik as ReturnType<typeof vi.fn>).mockReturnValue({
				data: mockEraisikData,
				isLoading: false,
				error: null,
			});
			(useJuriidilineIsik as ReturnType<typeof vi.fn>).mockReturnValue({
				data: null,
				isLoading: false,
				error: null,
			});
		});

		it('peaks kuvama eraisiku vormi õigete siltidega', () => {
			renderWithProviders(<OsavotjadDetail />);

			expect(screen.getByText('Eesnimi:')).toBeInTheDocument();
			expect(screen.getByText('Perenimi:')).toBeInTheDocument();
			expect(screen.getByText('Isikukood:')).toBeInTheDocument();
			expect(screen.getByText('Maksmisviis:')).toBeInTheDocument();
			expect(screen.getByText('Lisainfo:')).toBeInTheDocument();
		});

		it('peaks eeltäitma vormiväljad olemasolevate andmetega', async () => {
			renderWithProviders(<OsavotjadDetail />);

			await waitFor(() => {
				const eesnimiInput = screen.getByDisplayValue(
					'Test'
				) as HTMLInputElement;
				const perekonnanimiInput = screen.getByDisplayValue(
					'User'
				) as HTMLInputElement;
				const isikukoodInput = screen.getByDisplayValue(
					'50307160336'
				) as HTMLInputElement;

				expect(eesnimiInput).toBeInTheDocument();
				expect(perekonnanimiInput).toBeInTheDocument();
				expect(isikukoodInput).toBeInTheDocument();
			});
		});

		it('peaks lubama kasutajal vormiväljasid muuta', async () => {
			const user = userEvent.setup();
			renderWithProviders(<OsavotjadDetail />);

			await waitFor(() => {
				expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
			});

			const eesnimiInput = screen.getByDisplayValue('Test');
			await user.clear(eesnimiInput);
			await user.type(eesnimiInput, 'Uuendatud Nimi');

			expect(screen.getByDisplayValue('Uuendatud Nimi')).toBeInTheDocument();
		});

		it('peaks esitama vormi uuendatud andmetega', async () => {
			const user = userEvent.setup();
			renderWithProviders(<OsavotjadDetail />);

			await waitFor(() => {
				expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
			});

			const eesnimiInput = screen.getByDisplayValue('Test');
			await user.clear(eesnimiInput);
			await user.type(eesnimiInput, 'Uuendatud Nimi');

			const maksmiseViisSelect = screen.getByRole('combobox');
			await user.selectOptions(maksmiseViisSelect, 'sularaha');

			const submitButton = screen.getByRole('button', { name: /salvesta/i });
			await user.click(submitButton);

			await waitFor(() => {
				expect(mockMutateAsync).toHaveBeenCalledWith({
					id: 1,
					eesnimi: 'Uuendatud Nimi',
					perekonnanimi: 'User',
					isikukood: '50307160336',
					maksmiseViis: 'sularaha',
					lisainfo: 'Test info',
				});
			});
		});

		it('peaks näitama õnnestumise teadet ja navigeerima tagasi pärast edukat uuendust', async () => {
			const user = userEvent.setup();
			mockMutateAsync.mockResolvedValueOnce({});

			renderWithProviders(<OsavotjadDetail />);

			await waitFor(() => {
				expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
			});

			const eesnimiInput = screen.getByDisplayValue('Test');
			const perekonnanimiInput = screen.getByDisplayValue('User');
			const isikukoodInput = screen.getByDisplayValue('50307160336');
			const maksmiseViisSelect = screen.getByRole('combobox');
			const lisainfoTextarea = screen.getByDisplayValue('Test info');

			await user.clear(eesnimiInput);
			await user.type(eesnimiInput, 'Test');
			await user.clear(perekonnanimiInput);
			await user.type(perekonnanimiInput, 'User');
			await user.clear(isikukoodInput);
			await user.type(isikukoodInput, '50307160336');
			await user.selectOptions(maksmiseViisSelect, 'sularaha');
			await user.clear(lisainfoTextarea);
			await user.type(lisainfoTextarea, 'Test info');

			const submitButton = screen.getByRole('button', { name: /salvesta/i });
			await user.click(submitButton);

			await waitFor(() => {
				expect(mockAlert).toHaveBeenCalledWith(
					'Eraisiku andmed uuendatud edukalt!'
				);
				expect(mockNavigate).toHaveBeenCalledWith('/test-previous-page');
			});
		});

		it('peaks käsitlema vormi esitamise viga graatsiliselt', async () => {
			const user = userEvent.setup();
			const consoleErrorSpy = vi
				.spyOn(console, 'error')
				.mockImplementation(() => {});
			mockMutateAsync.mockRejectedValueOnce(new Error('Update failed'));

			renderWithProviders(<OsavotjadDetail />);

			await waitFor(() => {
				expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
			});

			const eesnimiInput = screen.getByDisplayValue('Test');
			const perekonnanimiInput = screen.getByDisplayValue('User');
			const isikukoodInput = screen.getByDisplayValue('50307160336');
			const maksmiseViisSelect = screen.getByRole('combobox');
			const lisainfoTextarea = screen.getByDisplayValue('Test info');

			await user.clear(eesnimiInput);
			await user.type(eesnimiInput, 'Test');
			await user.clear(perekonnanimiInput);
			await user.type(perekonnanimiInput, 'User');
			await user.clear(isikukoodInput);
			await user.type(isikukoodInput, '50307160336');
			await user.selectOptions(maksmiseViisSelect, 'sularaha');
			await user.clear(lisainfoTextarea);
			await user.type(lisainfoTextarea, 'Test info');

			const submitButton = screen.getByRole('button', { name: /salvesta/i });
			await user.click(submitButton);

			await waitFor(() => {
				expect(consoleErrorSpy).toHaveBeenCalledWith(
					'Failed to update participant:',
					expect.any(Error)
				);
			});

			consoleErrorSpy.mockRestore();
		});
	});

	describe('Juriidilise isiku vorm', () => {
		const mockJuriidilineData = {
			id: 2,
			nimi: 'Test Company',
			registrikood: '12345678',
			osavotjateArv: '5',
			maksmiseViis: { id: 2, maksmiseViis: 'pangaülekanne' },
			lisainfo: 'Company info',
		};

		beforeEach(() => {
			(useParams as ReturnType<typeof vi.fn>).mockReturnValue({
				id: '2',
				type: 'juriidiline',
			});
			(useFyysilineIsik as ReturnType<typeof vi.fn>).mockReturnValue({
				data: null,
				isLoading: false,
				error: null,
			});
			(useJuriidilineIsik as ReturnType<typeof vi.fn>).mockReturnValue({
				data: mockJuriidilineData,
				isLoading: false,
				error: null,
			});
		});

		it('peaks kuvama juriidilise isiku vormi õigete siltidega', () => {
			renderWithProviders(<OsavotjadDetail />);

			expect(screen.getByText('Nimi:')).toBeInTheDocument();
			expect(screen.getByText('Registrikood:')).toBeInTheDocument();
			expect(screen.getByText('Osavõtjate arv:')).toBeInTheDocument();
			expect(screen.getByText('Maksmisviis:')).toBeInTheDocument();
			expect(screen.getByText('Lisainfo:')).toBeInTheDocument();
		});

		it('peaks eeltäitma ettevõtte vormiväljad olemasolevate andmetega', async () => {
			renderWithProviders(<OsavotjadDetail />);

			await waitFor(() => {
				const nimiInput = screen.getByDisplayValue(
					'Test Company'
				) as HTMLInputElement;
				const registrikoodInput = screen.getByDisplayValue(
					'12345678'
				) as HTMLInputElement;
				const osavotjateArvInput = screen.getByDisplayValue(
					'5'
				) as HTMLInputElement;

				expect(nimiInput).toBeInTheDocument();
				expect(registrikoodInput).toBeInTheDocument();
				expect(osavotjateArvInput).toBeInTheDocument();
			});
		});

		it('peaks esitama ettevõtte vormi uuendatud andmetega', async () => {
			const user = userEvent.setup();
			renderWithProviders(<OsavotjadDetail />);

			await waitFor(() => {
				expect(screen.getByDisplayValue('Test Company')).toBeInTheDocument();
			});

			const nimiInput = screen.getByDisplayValue('Test Company');
			await user.clear(nimiInput);
			await user.type(nimiInput, 'Uuendatud Ettevõte');

			const submitButton = screen.getByRole('button', { name: /salvesta/i });
			await user.click(submitButton);

			await waitFor(() => {
				expect(mockMutateAsync).toHaveBeenCalledWith({
					id: 2,
					nimi: 'Uuendatud Ettevõte',
					registrikood: '12345678',
					osavotjateArv: '5',
					maksmiseViis: 'pangaülekanne',
					lisainfo: 'Company info',
				});
			});
		});

		it('peaks näitama ettevõtte uuendamiseks õnnestumise teadet', async () => {
			const user = userEvent.setup();
			mockMutateAsync.mockResolvedValueOnce({});

			renderWithProviders(<OsavotjadDetail />);

			await waitFor(() => {
				expect(screen.getByDisplayValue('Test Company')).toBeInTheDocument();
			});

			const nimiInput = screen.getByDisplayValue('Test Company');
			const registrikoodInput = screen.getByDisplayValue('12345678');
			const osavotjateArvInput = screen.getByDisplayValue('5');
			const maksmiseViisSelect = screen.getByRole('combobox');
			const lisainfoTextarea = screen.getByDisplayValue('Company info');

			await user.clear(nimiInput);
			await user.type(nimiInput, 'Test Company');
			await user.clear(registrikoodInput);
			await user.type(registrikoodInput, '12345678');
			await user.clear(osavotjateArvInput);
			await user.type(osavotjateArvInput, '5');
			await user.selectOptions(maksmiseViisSelect, 'pangaülekanne');
			await user.clear(lisainfoTextarea);
			await user.type(lisainfoTextarea, 'Company info');

			const submitButton = screen.getByRole('button', { name: /salvesta/i });
			await user.click(submitButton);

			await waitFor(() => {
				expect(mockAlert).toHaveBeenCalledWith(
					'Juriidilise isiku andmed uuendatud edukalt!'
				);
				expect(mockNavigate).toHaveBeenCalledWith('/test-previous-page');
			});
		});
	});

	describe('Navigeerimine', () => {
		beforeEach(() => {
			(useParams as ReturnType<typeof vi.fn>).mockReturnValue({
				id: '1',
				type: 'eraisik',
			});
			(useFyysilineIsik as ReturnType<typeof vi.fn>).mockReturnValue({
				data: {
					id: 1,
					eesnimi: 'Test',
					perekonnanimi: 'User',
					isikukood: '12345678901',
					maksmiseViis: { id: 1, maksmiseViis: 'Sularaha' },
					lisainfo: 'Test info',
				},
				isLoading: false,
				error: null,
			});
			(useJuriidilineIsik as ReturnType<typeof vi.fn>).mockReturnValue({
				data: null,
				isLoading: false,
				error: null,
			});
		});

		it('peaks navigeerima tagasi, kui Tagasi nuppu vajutatakse', async () => {
			const user = userEvent.setup();
			renderWithProviders(<OsavotjadDetail />);

			const tagasiButton = screen.getByRole('button', { name: /tagasi/i });
			await user.click(tagasiButton);

			expect(mockNavigate).toHaveBeenCalledWith('/test-previous-page');
		});

		it('peaks kasutama vaikimisi teed, kui eelnevat asukohta pole määratud', () => {
			(useLocation as ReturnType<typeof vi.fn>).mockReturnValue({
				state: null,
			});

			renderWithProviders(<OsavotjadDetail />);

			expect(screen.getAllByText('Osavõtja info')).toHaveLength(2);
		});
	});

	describe('Laadimise nupu olekud', () => {
		beforeEach(() => {
			(useParams as ReturnType<typeof vi.fn>).mockReturnValue({
				id: '1',
				type: 'eraisik',
			});
			(useFyysilineIsik as ReturnType<typeof vi.fn>).mockReturnValue({
				data: {
					id: 1,
					eesnimi: 'Test',
					perekonnanimi: 'User',
					isikukood: '12345678901',
					maksmiseViis: { id: 1, maksmiseViis: 'Sularaha' },
					lisainfo: 'Test info',
				},
				isLoading: false,
				error: null,
			});
			(useJuriidilineIsik as ReturnType<typeof vi.fn>).mockReturnValue({
				data: null,
				isLoading: false,
				error: null,
			});
		});

		it('peaks keelama esitamisnupu ja näitama laadimisteksti, kui mutatsioon on pooleli', () => {
			(useUpdateFyysilineIsik as ReturnType<typeof vi.fn>).mockReturnValue({
				mutateAsync: mockMutateAsync,
				isPending: true,
			});

			renderWithProviders(<OsavotjadDetail />);

			const submitButton = screen.getByRole('button', {
				name: /salvestame.../i,
			});
			expect(submitButton).toBeDisabled();
			expect(submitButton).toHaveTextContent('Salvestame...');
		});

		it('peaks lubama esitamisnupu, kui mutatsioon pole pooleli', () => {
			(useUpdateFyysilineIsik as ReturnType<typeof vi.fn>).mockReturnValue({
				mutateAsync: mockMutateAsync,
				isPending: false,
			});

			renderWithProviders(<OsavotjadDetail />);

			const submitButton = screen.getByRole('button', { name: /salvesta/i });
			expect(submitButton).not.toBeDisabled();
			expect(submitButton).toHaveTextContent('Salvesta');
		});
	});

	describe('Vormi valideerimine', () => {
		beforeEach(() => {
			(useParams as ReturnType<typeof vi.fn>).mockReturnValue({
				id: '1',
				type: 'eraisik',
			});
			(useFyysilineIsik as ReturnType<typeof vi.fn>).mockReturnValue({
				data: {
					id: 1,
					eesnimi: 'Test',
					perekonnanimi: 'User',
					isikukood: '12345678901',
					maksmiseViis: { id: 1, maksmiseViis: 'Sularaha' },
					lisainfo: 'Test info',
				},
				isLoading: false,
				error: null,
			});
			(useJuriidilineIsik as ReturnType<typeof vi.fn>).mockReturnValue({
				data: null,
				isLoading: false,
				error: null,
			});
		});

		it('ei peaks esitama vormi ilma nõutavate väljadeta', async () => {
			const user = userEvent.setup();
			renderWithProviders(<OsavotjadDetail />);

			await waitFor(() => {
				expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
			});

			const eesnimiInput = screen.getByDisplayValue('Test');
			await user.clear(eesnimiInput);

			const submitButton = screen.getByRole('button', { name: /salvesta/i });
			await user.click(submitButton);

			await waitFor(() => {
				expect(mockMutateAsync).not.toHaveBeenCalled();
			});
		});
	});
});
