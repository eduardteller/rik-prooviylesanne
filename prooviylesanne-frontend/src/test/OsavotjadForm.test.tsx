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
	isikudCount: 0,
};

const mockAvailableParticipants = {
	fyysilisedIsikud: [
		{
			id: 1,
			eesnimi: 'Available',
			perekonnanimi: 'Person',
			isikukood: '12345678901',
			maksmiseViis: { id: 1, maksmiseViis: 'pangaülekanne' },
			lisainfo: 'Available person info',
		},
	],
	juriidilisedIsikud: [
		{
			id: 2,
			nimi: 'Available Company',
			registrikood: '12345678',
			osavotjateArv: '3',
			maksmiseViis: { id: 2, maksmiseViis: 'sularaha' },
			lisainfo: 'Available company info',
		},
	],
};

const mockNavigate = vi.fn();
const mockAddEraisikMutate = vi.fn();
const mockAddEttevoteMutate = vi.fn();

describe('Osavõtjate vormi testid', () => {
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
			data: { fyysilisedIsikud: [], juriidilisedIsikud: [] },
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
			mutate: vi.fn(),
		});

		mockUseDeleteJuriidilineIsik.mockReturnValue({
			mutate: vi.fn(),
		});
	});

	describe('Vormi nähtavus ja paigutus', () => {
		it('näitab vormi kui üritus ei ole aegunud', () => {
			render(<Osavotjad />, { wrapper: createWrapper() });

			expect(screen.getByText('Osavõtjate lisamine')).toBeInTheDocument();
			expect(
				screen.getByLabelText('Vali olemasolev osavõtja:')
			).toBeInTheDocument();
		});

		it('näitab osavõtja tüübi raadionuppe', () => {
			render(<Osavotjad />, { wrapper: createWrapper() });

			expect(screen.getByLabelText('Eraisik')).toBeInTheDocument();
			expect(screen.getByLabelText('Ettevõte')).toBeInTheDocument();
			expect(screen.getByLabelText('Eraisik')).toBeChecked();
			expect(screen.getByLabelText('Ettevõte')).not.toBeChecked();
		});

		it('näitab Tagasi ja Salvesta nuppe', () => {
			render(<Osavotjad />, { wrapper: createWrapper() });

			expect(screen.getByText('Tagasi')).toBeInTheDocument();
			expect(screen.getByText('Salvesta')).toBeInTheDocument();
		});
	});

	describe('Olemasoleva osavõtja valimine', () => {
		it('kuvab olemasolevate osavõtjate rippmenüü valikutega', () => {
			render(<Osavotjad />, { wrapper: createWrapper() });

			const dropdown = screen.getByLabelText('Vali olemasolev osavõtja:');
			expect(dropdown).toBeInTheDocument();

			expect(
				screen.getByText('Vali osavõtja või lisa uus')
			).toBeInTheDocument();

			expect(
				screen.getByText('Available Person (Eraisik)')
			).toBeInTheDocument();
			expect(
				screen.getByText('Available Company (Ettevõte)')
			).toBeInTheDocument();
		});

		it('näitab rippmenüüs laadimise olekut', () => {
			mockUseAvailableParticipants.mockReturnValue({
				data: null,
				isLoading: true,
				error: null,
			});

			render(<Osavotjad />, { wrapper: createWrapper() });

			expect(screen.getByText('Laeb...')).toBeInTheDocument();
		});

		it('näitab rippmenüüs vea olekut', () => {
			mockUseAvailableParticipants.mockReturnValue({
				data: null,
				isLoading: false,
				error: new Error('Failed to load'),
			});

			render(<Osavotjad />, { wrapper: createWrapper() });

			expect(screen.getByText('Viga andmete laadimisel')).toBeInTheDocument();
		});
	});

	describe('Osavõtja tüübi valimine', () => {
		it('lülitub eraisiku ja ettevõtte vormide vahel', async () => {
			const user = userEvent.setup();
			render(<Osavotjad />, { wrapper: createWrapper() });

			expect(screen.getByText('Eesnimi:')).toBeInTheDocument();
			expect(screen.getByText('Perenimi:')).toBeInTheDocument();
			expect(screen.getByText('Isikukood:')).toBeInTheDocument();

			await user.click(screen.getByLabelText('Ettevõte'));

			expect(screen.getByText('Nimi:')).toBeInTheDocument();
			expect(screen.getByText('Registrikood:')).toBeInTheDocument();
			expect(screen.getByText('Osavõtjate arv:')).toBeInTheDocument();
		});

		it('keelitab raadionupud kui olemasolev osavõtja on valitud', async () => {
			const user = userEvent.setup();
			render(<Osavotjad />, { wrapper: createWrapper() });

			const dropdown = screen.getByLabelText('Vali olemasolev osavõtja:');
			await user.selectOptions(dropdown, '1');

			expect(screen.getByLabelText('Eraisik')).toBeDisabled();
			expect(screen.getByLabelText('Ettevõte')).toBeDisabled();
		});
	});

	describe('Vormiväljad - Eraisik', () => {
		it('kuvab kõik eraisiku vormiväljad', () => {
			render(<Osavotjad />, { wrapper: createWrapper() });

			expect(screen.getByText('Eesnimi:')).toBeInTheDocument();
			expect(screen.getByText('Perenimi:')).toBeInTheDocument();
			expect(screen.getByText('Isikukood:')).toBeInTheDocument();
			expect(screen.getByText('Maksmisviis:')).toBeInTheDocument();
			expect(screen.getByText('Lisainfo:')).toBeInTheDocument();

			const inputs = screen.getAllByRole('textbox');
			expect(inputs).toHaveLength(4);

			const maksmisviisSelect = screen.getByDisplayValue('Vali maksmisviis');
			expect(maksmisviisSelect).toBeInTheDocument();
		});

		it('võimaldab täita eraisiku vormiväljad', async () => {
			const user = userEvent.setup();
			render(<Osavotjad />, { wrapper: createWrapper() });

			const [eesMeaning, pereName, isikukood] = screen
				.getAllByRole('textbox')
				.slice(0, 3);
			const maksmisviis = screen.getByDisplayValue('Vali maksmisviis');
			const lisainfo = screen.getAllByRole('textbox')[3];

			await user.type(eesMeaning, 'John');
			await user.type(pereName, 'Doe');
			await user.type(isikukood, '12345678901');
			await user.selectOptions(maksmisviis, 'pangaülekanne');
			await user.type(lisainfo, 'Test info');

			expect(eesMeaning).toHaveValue('John');
			expect(pereName).toHaveValue('Doe');
			expect(isikukood).toHaveValue('12345678901');
			expect(maksmisviis).toHaveValue('pangaülekanne');
			expect(lisainfo).toHaveValue('Test info');
		});

		it('keelitab eraisiku vormiväljad kui olemasolev osavõtja on valitud', async () => {
			const user = userEvent.setup();
			render(<Osavotjad />, { wrapper: createWrapper() });

			const dropdown = screen.getByLabelText('Vali olemasolev osavõtja:');
			await user.selectOptions(dropdown, '1');

			const inputs = screen.getAllByRole('textbox');
			inputs.forEach((input) => {
				expect(input).toBeDisabled();
				expect(input).toHaveClass(
					'disabled:bg-gray-100',
					'disabled:cursor-not-allowed'
				);
			});

			const comboboxes = screen.getAllByRole('combobox');
			const maksmisviis = comboboxes.find(
				(select) => select.getAttribute('name') === 'maksmiseViis'
			);
			expect(maksmisviis).toBeDisabled();
		});
	});

	describe('Vormiväljad - Ettevõte', () => {
		beforeEach(async () => {
			const user = userEvent.setup();
			render(<Osavotjad />, { wrapper: createWrapper() });
			await user.click(screen.getByLabelText('Ettevõte'));
		});

		it('kuvab kõik ettevõtte vormiväljad', () => {
			expect(screen.getByText('Nimi:')).toBeInTheDocument();
			expect(screen.getByText('Registrikood:')).toBeInTheDocument();
			expect(screen.getByText('Osavõtjate arv:')).toBeInTheDocument();
			expect(screen.getByText('Maksmisviis:')).toBeInTheDocument();
			expect(screen.getByText('Lisainfo:')).toBeInTheDocument();

			const inputs = screen.getAllByRole('textbox');
			expect(inputs).toHaveLength(4);
		});

		it('võimaldab täita ettevõtte vormiväljad', async () => {
			const user = userEvent.setup();

			const [nimi, registrikood, osavotjateArv] = screen
				.getAllByRole('textbox')
				.slice(0, 3);
			const maksmisviis = screen.getByDisplayValue('Vali maksmisviis');
			const lisainfo = screen.getAllByRole('textbox')[3];

			await user.type(nimi, 'Test Company');
			await user.type(registrikood, '12345678');
			await user.type(osavotjateArv, '5');
			await user.selectOptions(maksmisviis, 'sularaha');
			await user.type(lisainfo, 'Company info');

			expect(nimi).toHaveValue('Test Company');
			expect(registrikood).toHaveValue('12345678');
			expect(osavotjateArv).toHaveValue('5');
			expect(maksmisviis).toHaveValue('sularaha');
			expect(lisainfo).toHaveValue('Company info');
		});
	});

	describe('Vormi esitamine', () => {
		it('esitab eraisiku vormi õigete andmetega', async () => {
			const user = userEvent.setup();
			render(<Osavotjad />, { wrapper: createWrapper() });

			const allTextInputs = screen.getAllByRole('textbox');
			const eesnimi = allTextInputs[0];
			const perekonnanimi = allTextInputs[1];
			const isikukood = allTextInputs[2];
			const lisainfo = allTextInputs[3];

			const maksmisviis = screen.getByDisplayValue('Vali maksmisviis');

			await user.type(eesnimi, 'John');
			await user.type(perekonnanimi, 'Doe');
			await user.type(isikukood, '50307160336');
			await user.selectOptions(maksmisviis, 'pangaülekanne');
			await user.type(lisainfo, 'Test info');

			const submitButton = screen.getByText('Salvesta');
			await user.click(submitButton);

			await waitFor(() => {
				expect(mockAddEraisikMutate).toHaveBeenCalledWith(
					expect.objectContaining({
						eesnimi: 'John',
						perekonnanimi: 'Doe',
						isikukood: '50307160336',
						maksmiseViis: 'pangaülekanne',
						lisainfo: 'Test info',
						yritusId: '1',
					}),
					expect.any(Object)
				);
			});
		});

		it('esitab ettevõtte vormi õigete andmetega', async () => {
			const user = userEvent.setup();
			render(<Osavotjad />, { wrapper: createWrapper() });

			await user.click(screen.getByLabelText('Ettevõte'));

			const [nimi, registrikood, osavotjateArv] = screen
				.getAllByRole('textbox')
				.slice(0, 3);
			const maksmisviis = screen.getByDisplayValue('Vali maksmisviis');
			const lisainfo = screen.getAllByRole('textbox')[3];

			await user.type(nimi, 'Test Company');
			await user.type(registrikood, '12345678');
			await user.type(osavotjateArv, '5');
			await user.selectOptions(maksmisviis, 'sularaha');
			await user.type(lisainfo, 'Company info');

			const submitButton = screen.getByText('Salvesta');
			await user.click(submitButton);

			expect(mockAddEttevoteMutate).toHaveBeenCalledWith(
				expect.objectContaining({
					nimi: 'Test Company',
					registrikood: '12345678',
					osavotjateArv: '5',
					maksmiseViis: 'sularaha',
					lisainfo: 'Company info',
					yritusId: '1',
				}),
				expect.any(Object)
			);
		});

		it('esitab olemasoleva osavõtja õigesti', async () => {
			const user = userEvent.setup();
			render(<Osavotjad />, { wrapper: createWrapper() });

			const dropdown = screen.getByLabelText('Vali olemasolev osavõtja:');
			await user.selectOptions(dropdown, '1');

			const submitButton = screen.getByText('Salvesta');
			await user.click(submitButton);

			expect(mockAddEraisikMutate).toHaveBeenCalledWith(
				expect.objectContaining({
					yritusId: '1',
					isikId: 1,
					eesnimi: 'Available',
					perekonnanimi: 'Person',
					isikukood: '12345678901',
					maksmiseViis: 'pangaülekanne',
					lisainfo: 'Available person info',
				}),
				expect.any(Object)
			);
		});

		it('näitab laadimise olekut esitamise ajal', () => {
			mockUseAddEraisik.mockReturnValue({
				mutate: mockAddEraisikMutate,
				isPending: true,
			});

			render(<Osavotjad />, { wrapper: createWrapper() });

			const submitButton = screen.getByText('Salvestab...');
			expect(submitButton).toBeDisabled();
		});
	});

	describe('Vormi valideerimine', () => {
		it('näitab valideerimise vigu tühjade kohustuslike väljade puhul', async () => {
			const user = userEvent.setup();
			render(<Osavotjad />, { wrapper: createWrapper() });

			const submitButton = screen.getByText('Salvesta');
			await user.click(submitButton);

			await waitFor(() => {
				expect(screen.getByText('Eesnimi on kohustuslik')).toBeInTheDocument();
				expect(
					screen.getByText('Perekonnanimi on kohustuslik')
				).toBeInTheDocument();
				expect(
					screen.getByText('Maksmisviis on kohustuslik')
				).toBeInTheDocument();
			});
		});

		it('valideerib Eesti isikukoodi', async () => {
			const user = userEvent.setup();
			render(<Osavotjad />, { wrapper: createWrapper() });

			const isikukood = screen.getAllByRole('textbox')[2];
			await user.type(isikukood, '12345');

			const submitButton = screen.getByText('Salvesta');
			await user.click(submitButton);

			await waitFor(() => {
				expect(
					screen.getByText('Isikukood peab olema täpselt 11 märki')
				).toBeInTheDocument();
			});
		});

		it('valideerib ettevõtte vormiväljad', async () => {
			const user = userEvent.setup();
			render(<Osavotjad />, { wrapper: createWrapper() });

			await user.click(screen.getByLabelText('Ettevõte'));

			const submitButton = screen.getByText('Salvesta');
			await user.click(submitButton);

			await waitFor(() => {
				expect(screen.getByText('Nimi on kohustuslik')).toBeInTheDocument();
				expect(
					screen.getByText('Osavõtjate arv on kohustuslik')
				).toBeInTheDocument();
				expect(
					screen.getByText('Maksmisviis on kohustuslik')
				).toBeInTheDocument();
			});
		});
	});

	describe('Navigeerimine', () => {
		it('navigeerib tagasi kui Tagasi nuppu vajutatakse', async () => {
			const user = userEvent.setup();
			render(<Osavotjad />, { wrapper: createWrapper() });

			const backButton = screen.getByText('Tagasi');
			await user.click(backButton);

			expect(mockNavigate).toHaveBeenCalledWith('/');
		});
	});

	describe('Maksmisviisi valikud', () => {
		it('kuvab õiged maksmisviisi valikud', () => {
			render(<Osavotjad />, { wrapper: createWrapper() });

			expect(screen.getByText('Vali maksmisviis')).toBeInTheDocument();
			expect(screen.getByText('Pangaülekanne')).toBeInTheDocument();
			expect(screen.getByText('Sularaha')).toBeInTheDocument();
		});
	});
});
