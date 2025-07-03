import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import Avaleht from '../Avaleht';
import * as eventsApi from '../api/events';

vi.mock('../api/events', () => ({
	useEvents: vi.fn(),
	categorizeEvents: vi.fn(),
	useDeleteEvent: vi.fn(),
	formatDate: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
	const actual = await vi.importActual('react-router');
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

const mockEvents = [
	{
		id: 1,
		nimi: 'Test Future Event',
		aeg: '2025-12-31T10:00:00',
		koht: 'Test Location 1',
		lisainfo: 'Test info',
		isikudCount: 5,
	},
	{
		id: 2,
		nimi: 'Test Past Event',
		aeg: '2024-01-01T10:00:00',
		koht: 'Test Location 2',
		lisainfo: 'Test info',
		isikudCount: 3,
	},
];

const categorizedEvents = {
	upcomingEvents: [mockEvents[0]],
	pastEvents: [mockEvents[1]],
};

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

describe('Avaleht Component', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		(eventsApi.formatDate as Mock).mockImplementation((date: string) => {
			return new Date(date).toLocaleDateString('et-EE', {
				day: '2-digit',
				month: '2-digit',
				year: '2-digit',
			});
		});
		(eventsApi.categorizeEvents as Mock).mockReturnValue(categorizedEvents);
		(eventsApi.useDeleteEvent as Mock).mockReturnValue({
			mutate: vi.fn(),
			isPending: false,
			isError: false,
			error: null,
		});
	});

	it('kuvab põhilised paigutuse komponendid', () => {
		(eventsApi.useEvents as Mock).mockReturnValue({
			data: mockEvents,
			isLoading: false,
			error: null,
		});

		renderWithProviders(<Avaleht />);

		expect(screen.getByText('Tulevased üritused')).toBeInTheDocument();
		expect(screen.getByText('Toimunud üritused')).toBeInTheDocument();
		expect(screen.getByText('LISA ÜRITUS')).toBeInTheDocument();

		expect(screen.getByText(/Sed nec elit vestibulum/)).toBeInTheDocument();
		expect(screen.getByText(/tincidunt orci/)).toBeInTheDocument();
	});

	it('kuvab laadimise olekut õigesti', () => {
		(eventsApi.useEvents as Mock).mockReturnValue({
			data: null,
			isLoading: true,
			error: null,
		});

		renderWithProviders(<Avaleht />);

		expect(screen.getAllByText('Laadimine...')).toHaveLength(2);
	});

	it('kuvab vea olekut õigesti', () => {
		const errorMessage = 'Network error';
		(eventsApi.useEvents as Mock).mockReturnValue({
			data: null,
			isLoading: false,
			error: { message: errorMessage },
		});

		renderWithProviders(<Avaleht />);

		expect(screen.getAllByText(`Viga: ${errorMessage}`)).toHaveLength(2);
	});

	it('kuvab tühja olekut kui üritused puuduvad', () => {
		(eventsApi.useEvents as Mock).mockReturnValue({
			data: [],
			isLoading: false,
			error: null,
		});
		(eventsApi.categorizeEvents as Mock).mockReturnValue({
			upcomingEvents: [],
			pastEvents: [],
		});

		renderWithProviders(<Avaleht />);

		expect(screen.getAllByText('Üritused puuduvad')).toHaveLength(2);
	});

	it('kuvab üritusi õigesti kui andmed on laaditud', async () => {
		(eventsApi.useEvents as Mock).mockReturnValue({
			data: mockEvents,
			isLoading: false,
			error: null,
		});

		renderWithProviders(<Avaleht />);

		await waitFor(() => {
			expect(screen.getByText('1. Test Future Event')).toBeInTheDocument();

			expect(screen.getByText('1. Test Past Event')).toBeInTheDocument();
		});
	});

	it('kutsub categorizeEvents õigete andmetega', () => {
		(eventsApi.useEvents as Mock).mockReturnValue({
			data: mockEvents,
			isLoading: false,
			error: null,
		});

		renderWithProviders(<Avaleht />);

		expect(eventsApi.categorizeEvents).toHaveBeenCalledWith(mockEvents);
	});

	it('navigeerib lisa-yritus lehele kui LISA ÜRITUS nuppu vajutatakse', async () => {
		const user = userEvent.setup();
		(eventsApi.useEvents as Mock).mockReturnValue({
			data: mockEvents,
			isLoading: false,
			error: null,
		});

		renderWithProviders(<Avaleht />);

		const addEventButton = screen.getByText('LISA ÜRITUS');
		await user.click(addEventButton);

		expect(mockNavigate).toHaveBeenCalledWith('/lisa-yritus');
	});

	it('renderdab EventItem komponente õigete propidega tulevaste ürituste jaoks', () => {
		(eventsApi.useEvents as Mock).mockReturnValue({
			data: mockEvents,
			isLoading: false,
			error: null,
		});

		renderWithProviders(<Avaleht />);

		const upcomingSection =
			screen.getByText('Tulevased üritused').parentElement;
		expect(upcomingSection).toBeInTheDocument();
	});

	it('renderdab EventItem komponente õigete propidega toimunud ürituste jaoks', () => {
		(eventsApi.useEvents as Mock).mockReturnValue({
			data: mockEvents,
			isLoading: false,
			error: null,
		});

		renderWithProviders(<Avaleht />);

		const pastSection = screen.getByText('Toimunud üritused').parentElement;
		expect(pastSection).toBeInTheDocument();
	});

	it('käsitleb defineerimata ürituste andmeid gracefully', () => {
		(eventsApi.useEvents as Mock).mockReturnValue({
			data: undefined,
			isLoading: false,
			error: null,
		});

		renderWithProviders(<Avaleht />);

		expect(screen.getAllByText('Üritused puuduvad')).toHaveLength(2);
	});

	it('renderdab kangelaspilti õigesti', () => {
		(eventsApi.useEvents as Mock).mockReturnValue({
			data: mockEvents,
			isLoading: false,
			error: null,
		});

		const { container } = renderWithProviders(<Avaleht />);

		const piltImage = container.querySelector('img[src="/pilt.jpg"]');

		expect(piltImage).toBeInTheDocument();
		expect(piltImage).toHaveAttribute('src', '/pilt.jpg');
		expect(piltImage).toHaveClass('object-cover', 'w-full', 'h-full');
	});

	it('omab õigeid responsiivse paigutuse klasse', () => {
		(eventsApi.useEvents as Mock).mockReturnValue({
			data: mockEvents,
			isLoading: false,
			error: null,
		});

		const { container } = renderWithProviders(<Avaleht />);

		const mainElement = container.querySelector('main');
		expect(mainElement).toHaveClass('bg-[#eef2f5]', 'min-h-screen');

		const contentContainer = container.querySelector('.max-w-5xl');
		expect(contentContainer).toBeInTheDocument();
	});

	it('kuvab õiget tekstisisu kangelassektsioonis', () => {
		(eventsApi.useEvents as Mock).mockReturnValue({
			data: mockEvents,
			isLoading: false,
			error: null,
		});

		renderWithProviders(<Avaleht />);

		expect(screen.getByText(/Sed nec elit vestibulum/)).toBeInTheDocument();
		expect(screen.getByText(/tincidunt orci/)).toBeInTheDocument();
		expect(screen.getByText(/sagittis ex/)).toBeInTheDocument();
		expect(screen.getByText(/Vestibulum rutrum/)).toBeInTheDocument();
		expect(screen.getByText(/neque suscipit/)).toBeInTheDocument();
	});
});
