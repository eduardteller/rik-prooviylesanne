import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
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

const mockNavigate = vi.fn();

describe('Osavõtjate ülevaate testid', () => {
	beforeEach(() => {
		vi.clearAllMocks();

		mockUseParams.mockReturnValue({ id: '1' });
		mockUseNavigate.mockReturnValue(mockNavigate);
		mockUseLocation.mockReturnValue({ pathname: '/osavotjad/1' });

		mockUseAddEraisik.mockReturnValue({
			mutate: vi.fn(),
			isPending: false,
		});
		mockUseAddEttevote.mockReturnValue({
			mutate: vi.fn(),
			isPending: false,
		});
		mockUseDeleteFyysilineIsik.mockReturnValue({
			mutate: vi.fn(),
		});
		mockUseDeleteJuriidilineIsik.mockReturnValue({
			mutate: vi.fn(),
		});
		mockUseAvailableParticipants.mockReturnValue({
			data: { fyysilisedIsikud: [], juriidilisedIsikud: [] },
			isLoading: false,
			error: null,
		});
	});

	describe('Lehe paigutus ja päis', () => {
		it('renderdab põhilised paigutuse komponendid', () => {
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

			render(<Osavotjad />, { wrapper: createWrapper() });

			expect(screen.getByTestId('header')).toBeInTheDocument();
			expect(screen.getByTestId('footer')).toBeInTheDocument();
			expect(screen.getAllByText('Osavõtjad')).toHaveLength(2);

			const heroImage = screen.getByRole('presentation');
			expect(heroImage).toHaveAttribute('src', '/libled.jpg');
		});

		it('kuvab ürituse informatsiooni silte', () => {
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

			render(<Osavotjad />, { wrapper: createWrapper() });

			expect(screen.getByText('Ürituse nimi:')).toBeInTheDocument();
			expect(screen.getByText('Toimumisaeg:')).toBeInTheDocument();
			expect(screen.getByText('Koht:')).toBeInTheDocument();
			expect(screen.getByText('Osavõtjade arv:')).toBeInTheDocument();
			expect(screen.getByText('Osavõtjad:')).toBeInTheDocument();
		});
	});

	describe('Ürituse andmete laadimise olekud', () => {
		it('näitab ürituse andmete laadimise olekut', () => {
			mockUseEvent.mockReturnValue({
				data: null,
				isLoading: true,
				error: null,
			});
			mockUseParticipants.mockReturnValue({
				data: null,
				isLoading: false,
				error: null,
			});

			render(<Osavotjad />, { wrapper: createWrapper() });

			const loadingTexts = screen.getAllByText('Laeb...');
			expect(loadingTexts).toHaveLength(4);
		});

		it('näitab ürituse andmete vea olekut', () => {
			mockUseEvent.mockReturnValue({
				data: null,
				isLoading: false,
				error: new Error('Failed to load event'),
			});
			mockUseParticipants.mockReturnValue({
				data: null,
				isLoading: false,
				error: null,
			});

			render(<Osavotjad />, { wrapper: createWrapper() });

			const errorTexts = screen.getAllByText('Viga ürituse laadimisel');
			expect(errorTexts).toHaveLength(3);
			expect(errorTexts[0]).toHaveClass('text-red-500');
		});

		it('kuvab ürituse andmeid eduka laadimise korral', () => {
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

			render(<Osavotjad />, { wrapper: createWrapper() });

			expect(screen.getByText('Test Event')).toBeInTheDocument();
			expect(screen.getByText('2025-12-31T10:00:00')).toBeInTheDocument();
			expect(screen.getByText('Test Location')).toBeInTheDocument();
			expect(screen.getByText('2 osavõtjat')).toBeInTheDocument();
		});

		it('näitab varukriipse kui ürituse andmed puuduvad', () => {
			mockUseEvent.mockReturnValue({
				data: null,
				isLoading: false,
				error: null,
			});
			mockUseParticipants.mockReturnValue({
				data: null,
				isLoading: false,
				error: null,
			});

			render(<Osavotjad />, { wrapper: createWrapper() });

			const dashes = screen.getAllByText('-');
			expect(dashes).toHaveLength(4);
		});
	});

	describe('Osavõtjate laadimise olekud', () => {
		beforeEach(() => {
			mockUseEvent.mockReturnValue({
				data: mockEvent,
				isLoading: false,
				error: null,
			});
		});

		it('näitab osavõtjate laadimise olekut', () => {
			mockUseParticipants.mockReturnValue({
				data: null,
				isLoading: true,
				error: null,
			});

			render(<Osavotjad />, { wrapper: createWrapper() });

			expect(screen.getByText('Laeb osavõtjaid...')).toBeInTheDocument();
		});

		it('näitab osavõtjate vea olekut', () => {
			mockUseParticipants.mockReturnValue({
				data: null,
				isLoading: false,
				error: new Error('Failed to load participants'),
			});

			render(<Osavotjad />, { wrapper: createWrapper() });

			expect(
				screen.getByText('Viga osavõtjate laadimisel')
			).toBeInTheDocument();
			expect(screen.getByText('Viga osavõtjate laadimisel')).toHaveClass(
				'text-red-500'
			);
		});

		it('näitab tühja olekut kui osavõtjaid pole', () => {
			mockUseParticipants.mockReturnValue({
				data: { fyysilisedIsikud: [], juriidilisedIsikud: [] },
				isLoading: false,
				error: null,
			});

			render(<Osavotjad />, { wrapper: createWrapper() });

			expect(
				screen.getByText('Osavõtjaid ei ole veel lisatud')
			).toBeInTheDocument();
		});

		it('näitab tühja olekut kui osavõtjate andmed on null', () => {
			mockUseParticipants.mockReturnValue({
				data: null,
				isLoading: false,
				error: null,
			});

			render(<Osavotjad />, { wrapper: createWrapper() });

			expect(
				screen.getByText('Osavõtjaid ei ole veel lisatud')
			).toBeInTheDocument();
		});
	});

	describe('Osavõtjate kuvamine', () => {
		beforeEach(() => {
			mockUseEvent.mockReturnValue({
				data: mockEvent,
				isLoading: false,
				error: null,
			});
		});

		it('kuvab füüsilisi isikuid õigesti', () => {
			mockUseParticipants.mockReturnValue({
				data: mockParticipants,
				isLoading: false,
				error: null,
			});

			render(<Osavotjad />, { wrapper: createWrapper() });

			expect(screen.getByText('1. John Doe')).toBeInTheDocument();
			expect(screen.getByText('12345678901')).toBeInTheDocument();
		});

		it('kuvab juriidilisi isikuid õigesti', () => {
			mockUseParticipants.mockReturnValue({
				data: mockParticipants,
				isLoading: false,
				error: null,
			});

			render(<Osavotjad />, { wrapper: createWrapper() });

			expect(screen.getByText('2. Test Company')).toBeInTheDocument();
			expect(screen.getByText('12345678')).toBeInTheDocument();
		});

		it('kuvab õiget nummerdamist segatud osavõtjate puhul', () => {
			mockUseParticipants.mockReturnValue({
				data: mockParticipants,
				isLoading: false,
				error: null,
			});

			render(<Osavotjad />, { wrapper: createWrapper() });

			expect(screen.getByText('1. John Doe')).toBeInTheDocument();
			expect(screen.getByText('2. Test Company')).toBeInTheDocument();
		});

		it('renderdab osavõtjate jaoks tegevuste nupud', () => {
			mockUseParticipants.mockReturnValue({
				data: mockParticipants,
				isLoading: false,
				error: null,
			});

			render(<Osavotjad />, { wrapper: createWrapper() });

			const viewButtons = screen.getAllByText('Vaata');
			const deleteButtons = screen.getAllByText('Kustuta');

			expect(viewButtons).toHaveLength(2);
			expect(deleteButtons).toHaveLength(2);
		});
	});

	describe('Ürituse aegumise loogika', () => {
		it('peidab vormi kui üritus on aegunud', () => {
			const expiredEvent = {
				...mockEvent,
				aeg: '2020-01-01T10:00:00',
			};

			mockUseEvent.mockReturnValue({
				data: expiredEvent,
				isLoading: false,
				error: null,
			});
			mockUseParticipants.mockReturnValue({
				data: mockParticipants,
				isLoading: false,
				error: null,
			});

			render(<Osavotjad />, { wrapper: createWrapper() });

			expect(screen.queryByText('Osavõtjate lisamine')).not.toBeInTheDocument();
			expect(screen.queryByText('Tagasi')).not.toBeInTheDocument();
		});

		it('näitab vormi kui üritus ei ole aegunud', () => {
			const futureEvent = {
				...mockEvent,
				aeg: '2025-12-31T10:00:00',
			};

			mockUseEvent.mockReturnValue({
				data: futureEvent,
				isLoading: false,
				error: null,
			});
			mockUseParticipants.mockReturnValue({
				data: mockParticipants,
				isLoading: false,
				error: null,
			});

			render(<Osavotjad />, { wrapper: createWrapper() });

			expect(screen.getByText('Osavõtjate lisamine')).toBeInTheDocument();
			expect(screen.getByText('Tagasi')).toBeInTheDocument();
		});

		it('peidab juriidiliste isikute kustutamise nupud kui üritus on aegunud', () => {
			const expiredEvent = {
				...mockEvent,
				aeg: '2020-01-01T10:00:00',
			};

			mockUseEvent.mockReturnValue({
				data: expiredEvent,
				isLoading: false,
				error: null,
			});
			mockUseParticipants.mockReturnValue({
				data: mockParticipants,
				isLoading: false,
				error: null,
			});

			render(<Osavotjad />, { wrapper: createWrapper() });

			expect(screen.getByText('1. John Doe')).toBeInTheDocument();
			expect(screen.getByText('2. Test Company')).toBeInTheDocument();

			const deleteButtons = screen.getAllByText('Kustuta');
			expect(deleteButtons).toHaveLength(1);
		});
	});

	describe('Keritav osavõtjate ala', () => {
		it('rakendab õigeid CSS klasse keritavale alale', () => {
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

			render(<Osavotjad />, { wrapper: createWrapper() });

			const participantsContainer = screen
				.getByText('1. John Doe')
				.closest('div')?.parentElement;
			expect(participantsContainer).toHaveClass(
				'mt-4',
				'gap-4',
				'flex',
				'flex-col',
				'h-24',
				'overflow-y-auto'
			);
		});
	});
});
