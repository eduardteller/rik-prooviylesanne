import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Osavotjad from '../Osavotjad';

vi.mock('../api/events', () => ({
	useEvent: vi.fn(),
	formatDate: vi.fn((date) => date),
}));

vi.mock('../api/participants', () => ({
	useParticipants: vi.fn(),
	useAvailableParticipants: vi.fn(),
	useAddEraisik: vi.fn(),
	useAddEttevote: vi.fn(),
	useDeleteFyysilineIsik: vi.fn(),
	useDeleteJuriidilineIsik: vi.fn(),
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

Object.defineProperty(window, 'confirm', {
	writable: true,
	value: vi.fn(),
});

Object.defineProperty(window, 'alert', {
	writable: true,
	value: vi.fn(),
});

import { useLocation, useNavigate, useParams } from 'react-router';
import { useEvent } from '../api/events';
import {
	useAddEraisik,
	useAddEttevote,
	useAvailableParticipants,
	useDeleteFyysilineIsik,
	useDeleteJuriidilineIsik,
	useParticipants,
} from '../api/participants';

const mockUseEvent = useEvent as ReturnType<typeof vi.fn>;
const mockUseParticipants = useParticipants as ReturnType<typeof vi.fn>;
const mockUseAvailableParticipants = useAvailableParticipants as ReturnType<
	typeof vi.fn
>;
const mockUseAddEraisik = useAddEraisik as ReturnType<typeof vi.fn>;
const mockUseAddEttevote = useAddEttevote as ReturnType<typeof vi.fn>;
const mockUseDeleteFyysilineIsik = useDeleteFyysilineIsik as ReturnType<
	typeof vi.fn
>;
const mockUseDeleteJuriidilineIsik = useDeleteJuriidilineIsik as ReturnType<
	typeof vi.fn
>;
const mockUseParams = useParams as ReturnType<typeof vi.fn>;
const mockUseNavigate = useNavigate as ReturnType<typeof vi.fn>;
const mockUseLocation = useLocation as ReturnType<typeof vi.fn>;

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});

	return ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>{children}</BrowserRouter>
		</QueryClientProvider>
	);
};

const mockEvent = {
	id: 1,
	nimi: 'Test Event',
	aeg: '2025-12-31T10:00:00',
	koht: 'Test Location',
	lisainfo: 'Test description',
	isikudCount: 2,
};

const mockParticipants = {
	fyysilisedIsikud: [
		{
			id: 1,
			eesnimi: 'John',
			perekonnanimi: 'Doe',
			isikukood: '12345678901',
			maksmiseViis: { id: 1, maksmiseViis: 'pangaülekanne' },
			lisainfo: 'Test info',
		},
	],
	juriidilisedIsikud: [
		{
			id: 2,
			nimi: 'Test Company',
			registrikood: '12345678',
			osavotjateArv: '5',
			maksmiseViis: { id: 1, maksmiseViis: 'sularaha' },
			lisainfo: '',
		},
	],
};

const mockAvailableParticipants = {
	fyysilisedIsikud: [
		{
			id: 3,
			eesnimi: 'Available',
			perekonnanimi: 'Person',
			isikukood: '39001010071',
			maksmiseViis: { id: 1, maksmiseViis: 'pangaülekanne' },
			lisainfo: 'Available person info',
		},
	],
	juriidilisedIsikud: [
		{
			id: 4,
			nimi: 'Available Company',
			registrikood: '87654321',
			osavotjateArv: '3',
			maksmiseViis: { id: 2, maksmiseViis: 'sularaha' },
			lisainfo: 'Available company info',
		},
	],
};

const mockNavigate = vi.fn();
const mockDeleteFyysilineIsikMutate = vi.fn();
const mockDeleteJuriidilineIsikMutate = vi.fn();
const mockAddEraisikMutate = vi.fn();
const mockAddEttevoteMutate = vi.fn();

describe('Osavõtjate Interaktsioonide Testid', () => {
	beforeEach(() => {
		vi.clearAllMocks();

		mockUseParams.mockReturnValue({ id: '1' });
		mockUseNavigate.mockReturnValue(mockNavigate);
		mockUseLocation.mockReturnValue({ pathname: '/osavotjad/1' });

		mockUseEvent.mockReturnValue({
			data: mockEvent,
			isLoading: false,
			error: null,
		});

		mockUseParticipants.mockReturnValue({
			data: mockParticipants,
			isLoading: false,
			error: null,
		});

		mockUseAvailableParticipants.mockReturnValue({
			data: mockAvailableParticipants,
			isLoading: false,
			error: null,
		});

		mockUseAddEraisik.mockReturnValue({
			mutate: mockAddEraisikMutate,
			isPending: false,
		});

		mockUseAddEttevote.mockReturnValue({
			mutate: mockAddEttevoteMutate,
			isPending: false,
		});

		mockUseDeleteFyysilineIsik.mockReturnValue({
			mutate: mockDeleteFyysilineIsikMutate,
		});

		mockUseDeleteJuriidilineIsik.mockReturnValue({
			mutate: mockDeleteJuriidilineIsikMutate,
		});
	});

	describe('Osavõtjate Navigeerimine', () => {
		it('navigeerib eraisiku detailidesse kui Vaata nuppu vajutatakse', async () => {
			const user = userEvent.setup();
			render(<Osavotjad />, { wrapper: createWrapper() });

			const viewButtons = screen.getAllByText('Vaata');
			await user.click(viewButtons[0]);

			expect(mockNavigate).toHaveBeenCalledWith('/osavotjad/eraisik/1', {
				state: { from: '/osavotjad/1' },
			});
		});

		it('navigeerib juriidilise isiku detailidesse kui Vaata nuppu vajutatakse', async () => {
			const user = userEvent.setup();
			render(<Osavotjad />, { wrapper: createWrapper() });

			const viewButtons = screen.getAllByText('Vaata');
			await user.click(viewButtons[1]);

			expect(mockNavigate).toHaveBeenCalledWith('/osavotjad/juriidiline/2', {
				state: { from: '/osavotjad/1' },
			});
		});
	});

	describe('Osavõtjate Kustutamine', () => {
		it('kustutab eraisiku kui kinnitatakse', async () => {
			const user = userEvent.setup();
			const mockConfirm = vi.mocked(window.confirm);
			mockConfirm.mockReturnValue(true);

			render(<Osavotjad />, { wrapper: createWrapper() });

			const deleteButtons = screen.getAllByText('Kustuta');
			await user.click(deleteButtons[0]);

			expect(mockConfirm).toHaveBeenCalledWith(
				'Kas olete kindel, et soovite selle eraisiku kustutada?'
			);
			expect(mockDeleteFyysilineIsikMutate).toHaveBeenCalledWith(
				1,
				expect.any(Object)
			);
		});

		it('ei kustuta eraisikut kui tühistatakse', async () => {
			const user = userEvent.setup();
			const mockConfirm = vi.mocked(window.confirm);
			mockConfirm.mockReturnValue(false);

			render(<Osavotjad />, { wrapper: createWrapper() });

			const deleteButtons = screen.getAllByText('Kustuta');
			await user.click(deleteButtons[0]);

			expect(mockConfirm).toHaveBeenCalled();
			expect(mockDeleteFyysilineIsikMutate).not.toHaveBeenCalled();
		});

		it('kustutab juriidilise isiku kui kinnitatakse', async () => {
			const user = userEvent.setup();
			const mockConfirm = vi.mocked(window.confirm);
			mockConfirm.mockReturnValue(true);

			render(<Osavotjad />, { wrapper: createWrapper() });

			const deleteButtons = screen.getAllByText('Kustuta');
			await user.click(deleteButtons[1]);

			expect(mockConfirm).toHaveBeenCalledWith(
				'Kas olete kindel, et soovite selle ettevõtte kustutada?'
			);
			expect(mockDeleteJuriidilineIsikMutate).toHaveBeenCalledWith(
				2,
				expect.any(Object)
			);
		});

		it('näitab edukat kustutamist teatega', async () => {
			const user = userEvent.setup();
			const mockConfirm = vi.mocked(window.confirm);
			const mockAlert = vi.mocked(window.alert);
			mockConfirm.mockReturnValue(true);

			mockDeleteFyysilineIsikMutate.mockImplementation((_, options) => {
				options.onSuccess();
			});

			render(<Osavotjad />, { wrapper: createWrapper() });

			const deleteButtons = screen.getAllByText('Kustuta');
			await user.click(deleteButtons[0]);

			expect(mockAlert).toHaveBeenCalledWith('Eraisik kustutatud edukalt!');
		});

		it('näitab kustutamise viga teatega', async () => {
			const user = userEvent.setup();
			const mockConfirm = vi.mocked(window.confirm);
			const mockAlert = vi.mocked(window.alert);
			mockConfirm.mockReturnValue(true);

			mockDeleteFyysilineIsikMutate.mockImplementation((_, options) => {
				options.onError(new Error('Deletion failed'));
			});

			render(<Osavotjad />, { wrapper: createWrapper() });

			const deleteButtons = screen.getAllByText('Kustuta');
			await user.click(deleteButtons[0]);

			expect(mockAlert).toHaveBeenCalledWith('Viga eraisiku kustutamisel!');
		});
	});

	describe('Olemasoleva Osavõtja Valimise Protsess', () => {
		it('valib olemasoleva eraisiku ja täidab vormi tüübi automaatselt', async () => {
			const user = userEvent.setup();
			render(<Osavotjad />, { wrapper: createWrapper() });

			const dropdown = screen.getByLabelText('Vali olemasolev osavõtja:');
			await user.selectOptions(dropdown, '3');

			expect(screen.getByLabelText('Eraisik')).toBeChecked();
			expect(screen.getByLabelText('Ettevõte')).not.toBeChecked();

			const inputs = screen.getAllByRole('textbox');
			inputs.forEach((input) => {
				expect(input).toBeDisabled();
			});
		});

		it('valib olemasoleva juriidilise isiku ja täidab vormi tüübi automaatselt', async () => {
			const user = userEvent.setup();
			render(<Osavotjad />, { wrapper: createWrapper() });

			const dropdown = screen.getByLabelText('Vali olemasolev osavõtja:');
			await user.selectOptions(dropdown, '4');

			expect(screen.getByLabelText('Ettevõte')).toBeChecked();
			expect(screen.getByLabelText('Eraisik')).not.toBeChecked();
		});

		it('tühistab valiku kui rippmenüü nullitakse', async () => {
			const user = userEvent.setup();
			render(<Osavotjad />, { wrapper: createWrapper() });

			const dropdown = screen.getByLabelText('Vali olemasolev osavõtja:');

			await user.selectOptions(dropdown, '3');
			expect(screen.getAllByRole('textbox')[0]).toBeDisabled();

			await user.selectOptions(dropdown, '');
			expect(screen.getAllByRole('textbox')[0]).not.toBeDisabled();
		});

		it('tühistab vormi vead olemasoleva osavõtja valimisel', async () => {
			const user = userEvent.setup();
			render(<Osavotjad />, { wrapper: createWrapper() });

			const submitButton = screen.getByText('Salvesta');
			await user.click(submitButton);

			await waitFor(() => {
				expect(screen.getByText('Eesnimi on kohustuslik')).toBeInTheDocument();
			});

			const dropdown = screen.getByLabelText('Vali olemasolev osavõtja:');
			await user.selectOptions(dropdown, '3');
		});
	});

	describe('Vormi Saatmise Edu/Vea Käsitlus', () => {
		it('käsitleb edukat eraisiku saatmist', async () => {
			const user = userEvent.setup();
			const mockAlert = vi.mocked(window.alert);

			mockAddEraisikMutate.mockImplementation((_, options) => {
				options.onSuccess();
			});

			render(<Osavotjad />, { wrapper: createWrapper() });

			await waitFor(() => {
				expect(screen.getByText('Osavõtjate lisamine')).toBeInTheDocument();
			});

			const [eesnimi, perekonnanimi, isikukood] = screen
				.getAllByRole('textbox')
				.slice(0, 3);
			const maksmisviis = screen.getByDisplayValue('Vali maksmisviis');

			await user.type(eesnimi, 'John');
			await user.type(perekonnanimi, 'Doe');
			await user.type(isikukood, '39001010071');
			await user.selectOptions(maksmisviis, 'pangaülekanne');

			await user.click(screen.getByText('Salvesta'));

			await waitFor(() => {
				expect(mockAddEraisikMutate).toHaveBeenCalled();
			});

			await waitFor(() => {
				expect(mockAlert).toHaveBeenCalledWith('Eraisik lisatud edukalt!');
			});
			expect(mockNavigate).toHaveBeenCalledWith('/');
		});

		it('käsitleb eraisiku saatmise viga', async () => {
			const user = userEvent.setup();
			const mockAlert = vi.mocked(window.alert);

			mockAddEraisikMutate.mockImplementation((_, options) => {
				options.onError(new Error('Submission failed'));
			});

			render(<Osavotjad />, { wrapper: createWrapper() });

			await waitFor(() => {
				expect(screen.getByText('Osavõtjate lisamine')).toBeInTheDocument();
			});

			const [eesnimi, perekonnanimi, isikukood] = screen
				.getAllByRole('textbox')
				.slice(0, 3);
			const maksmisviis = screen.getByDisplayValue('Vali maksmisviis');

			await user.type(eesnimi, 'John');
			await user.type(perekonnanimi, 'Doe');
			await user.type(isikukood, '39001010071');
			await user.selectOptions(maksmisviis, 'pangaülekanne');

			await user.click(screen.getByText('Salvesta'));

			await waitFor(() => {
				expect(mockAddEraisikMutate).toHaveBeenCalled();
			});

			await waitFor(() => {
				expect(mockAlert).toHaveBeenCalledWith('Viga eraisiku lisamisel!');
			});
			expect(mockNavigate).not.toHaveBeenCalled();
		});

		it('käsitleb edukat ettevõtte saatmist', async () => {
			const user = userEvent.setup();
			const mockAlert = vi.mocked(window.alert);

			mockAddEttevoteMutate.mockImplementation((_, options) => {
				options.onSuccess();
			});

			render(<Osavotjad />, { wrapper: createWrapper() });

			await user.click(screen.getByLabelText('Ettevõte'));

			const [nimi, registrikood, osavotjateArv] = screen
				.getAllByRole('textbox')
				.slice(0, 3);
			const maksmisviis = screen.getByDisplayValue('Vali maksmisviis');

			await user.type(nimi, 'Test Company');
			await user.type(registrikood, '12345678');
			await user.type(osavotjateArv, '5');
			await user.selectOptions(maksmisviis, 'sularaha');

			await user.click(screen.getByText('Salvesta'));

			expect(mockAlert).toHaveBeenCalledWith('Ettevõte lisatud edukalt!');
			expect(mockNavigate).toHaveBeenCalledWith('/');
		});
	});
});
