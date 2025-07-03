import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import LisaYritus from '../LisaYritus';
import * as eventsApi from '../api/events';

vi.mock('../api/events', () => ({
	useCreateEvent: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
	const actual = await vi.importActual('react-router');
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

const mockHistoryBack = vi.fn();
Object.defineProperty(window, 'history', {
	value: {
		back: mockHistoryBack,
	},
	writable: true,
});

window.alert = vi.fn();

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
			<MemoryRouter>{component}</MemoryRouter>
		</QueryClientProvider>
	);
};

describe('LisaYritus komponent', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		(eventsApi.useCreateEvent as Mock).mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: false,
			isError: false,
			error: null,
		});
	});

	it('renderdab peamised layouti komponendid', () => {
		renderWithProviders(<LisaYritus />);

		expect(screen.getAllByText('Ürituse lisamine')).toHaveLength(3);
		expect(screen.getByText('Ürituse nimi:')).toBeInTheDocument();
		expect(screen.getByText('Toimumisaeg:')).toBeInTheDocument();
		expect(screen.getByText('Koht:')).toBeInTheDocument();
		expect(screen.getByText('Lisainfo:')).toBeInTheDocument();

		expect(screen.getByRole('button', { name: /tagasi/i })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /lisa$/i })).toBeInTheDocument();
	});

	it('kuvab kangelaspildi õigesti', () => {
		const { container } = renderWithProviders(<LisaYritus />);

		const libbledImage = container.querySelector('img[src="/libled.jpg"]');

		expect(libbledImage).toBeInTheDocument();
		expect(libbledImage).toHaveAttribute('src', '/libled.jpg');
		expect(libbledImage).toHaveClass('object-cover', 'flex-1');
	});

	it('renderdab kõik vormväljad õigete tüüpide ja atribuutidega', () => {
		renderWithProviders(<LisaYritus />);

		const inputs = screen.getAllByRole('textbox');
		expect(inputs).toHaveLength(3);

		const { container } = renderWithProviders(<LisaYritus />);
		const datetimeInput = container.querySelector(
			'input[type="datetime-local"]'
		);
		expect(datetimeInput).toBeInTheDocument();
		expect(datetimeInput).toHaveAttribute('min');

		const lisainfoTextarea = inputs[2];
		expect(lisainfoTextarea.tagName.toLowerCase()).toBe('textarea');
	});

	it('näitab valideerimise vigu tühja vormi esitamisel', async () => {
		const user = userEvent.setup();
		renderWithProviders(<LisaYritus />);

		const submitButton = screen.getByRole('button', { name: /lisa$/i });
		await user.click(submitButton);

		await waitFor(() => {
			expect(
				screen.getByText('Ürituse nimi on kohustuslik')
			).toBeInTheDocument();
			expect(
				screen.getByText('Toimumisaeg on kohustuslik')
			).toBeInTheDocument();
			expect(screen.getByText('Koht on kohustuslik')).toBeInTheDocument();
		});
	});

	it('takistab mineviku kuupäeva valimist min atribuudiga', async () => {
		const { container } = renderWithProviders(<LisaYritus />);

		const aegInput = container.querySelector(
			'input[type="datetime-local"]'
		) as HTMLInputElement;

		const minAttribute = aegInput.getAttribute('min');
		expect(minAttribute).toBeTruthy();

		const minDate = new Date(minAttribute!);
		const now = new Date();
		const timeDiff = Math.abs(now.getTime() - minDate.getTime());
		expect(timeDiff).toBeLessThan(5 * 60 * 1000);

		expect(minDate.getTime()).toBeLessThanOrEqual(now.getTime());
	});

	it('esitab vormi edukalt kehtivate andmetega', async () => {
		const user = userEvent.setup();
		const mockMutateAsync = vi.fn().mockResolvedValue(undefined);
		(eventsApi.useCreateEvent as Mock).mockReturnValue({
			mutateAsync: mockMutateAsync,
			isPending: false,
			isError: false,
			error: null,
		});

		const { container } = renderWithProviders(<LisaYritus />);

		const textInputs = screen.getAllByRole('textbox');
		const nimiInput = textInputs[0];
		const kohtInput = textInputs[1];
		const lisainfoTextarea = textInputs[2];
		const aegInput = container.querySelector(
			'input[type="datetime-local"]'
		) as HTMLInputElement;

		await user.type(nimiInput, 'Test Event');
		await user.type(aegInput, '2025-12-31T10:00');
		await user.type(kohtInput, 'Test Location');
		await user.type(lisainfoTextarea, 'Test additional info');

		const submitButton = screen.getByRole('button', { name: /lisa$/i });
		await user.click(submitButton);

		await waitFor(() => {
			expect(mockMutateAsync).toHaveBeenCalledWith({
				nimi: 'Test Event',
				aeg: expect.stringMatching(/2025-12-31T10:00:00[+-]\d{2}:\d{2}/),
				koht: 'Test Location',
				lisainfo: 'Test additional info',
			});
		});

		expect(mockNavigate).toHaveBeenCalledWith('/');
	});

	it('käsitleb vormi esitamise viga graatsiliselt', async () => {
		const user = userEvent.setup();
		const mockMutateAsync = vi
			.fn()
			.mockRejectedValue(new Error('Network error'));
		(eventsApi.useCreateEvent as Mock).mockReturnValue({
			mutateAsync: mockMutateAsync,
			isPending: false,
			isError: false,
			error: null,
		});

		const { container } = renderWithProviders(<LisaYritus />);

		const textInputs = screen.getAllByRole('textbox');
		const nimiInput = textInputs[0];
		const kohtInput = textInputs[1];
		const aegInput = container.querySelector(
			'input[type="datetime-local"]'
		) as HTMLInputElement;

		await user.type(nimiInput, 'Test Event');
		await user.type(aegInput, '2025-12-31T10:00');
		await user.type(kohtInput, 'Test Location');

		const submitButton = screen.getByRole('button', { name: /lisa$/i });
		await user.click(submitButton);

		await waitFor(() => {
			expect(mockMutateAsync).toHaveBeenCalled();
			expect(window.alert).toHaveBeenCalledWith('Viga ürituse lisamisel');
		});

		expect(mockNavigate).not.toHaveBeenCalledWith('/');
	});

	it('navigeerib tagasi kui Tagasi nuppu vajutatakse', async () => {
		const user = userEvent.setup();
		renderWithProviders(<LisaYritus />);

		const backButton = screen.getByRole('button', { name: /tagasi/i });
		await user.click(backButton);

		expect(mockHistoryBack).toHaveBeenCalled();
	});

	it('keelab esitamise nupu kui vorm on ootel', () => {
		(eventsApi.useCreateEvent as Mock).mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: true,
			isError: false,
			error: null,
		});

		renderWithProviders(<LisaYritus />);

		const submitButton = screen.getByRole('button', { name: /lisab.../i });
		expect(submitButton).toBeDisabled();
		expect(submitButton).toHaveTextContent('Lisab...');
	});

	it('määrab miinimum kuupäeva ja kellaaja praegusele ajale', () => {
		const { container } = renderWithProviders(<LisaYritus />);

		const aegInput = container.querySelector(
			'input[type="datetime-local"]'
		) as HTMLInputElement;
		const minAttribute = aegInput.getAttribute('min');

		expect(minAttribute).toBeTruthy();
		const minDate = new Date(minAttribute!);
		const now = new Date();
		const timeDiff = Math.abs(now.getTime() - minDate.getTime());
		expect(timeDiff).toBeLessThan(5 * 60 * 1000);
	});

	it('vormindab kuupäeva ja kellaaega õigesti API esitamiseks', async () => {
		const user = userEvent.setup();
		const mockMutateAsync = vi.fn().mockResolvedValue(undefined);
		(eventsApi.useCreateEvent as Mock).mockReturnValue({
			mutateAsync: mockMutateAsync,
			isPending: false,
			isError: false,
			error: null,
		});

		const { container } = renderWithProviders(<LisaYritus />);

		const textInputs = screen.getAllByRole('textbox');
		const nimiInput = textInputs[0];
		const kohtInput = textInputs[1];
		const aegInput = container.querySelector(
			'input[type="datetime-local"]'
		) as HTMLInputElement;

		await user.type(nimiInput, 'Test Event');
		await user.type(aegInput, '2025-12-31T15:30');
		await user.type(kohtInput, 'Test Location');

		const submitButton = screen.getByRole('button', { name: /lisa$/i });
		await user.click(submitButton);

		await waitFor(() => {
			expect(mockMutateAsync).toHaveBeenCalledWith(
				expect.objectContaining({
					aeg: expect.stringMatching(/2025-12-31T15:30:00[+-]\d{2}:\d{2}/),
				})
			);
		});
	});

	it('puhastab vormi pärast edukat esitamist', async () => {
		const user = userEvent.setup();
		const mockMutateAsync = vi.fn().mockResolvedValue(undefined);
		(eventsApi.useCreateEvent as Mock).mockReturnValue({
			mutateAsync: mockMutateAsync,
			isPending: false,
			isError: false,
			error: null,
		});

		const { container } = renderWithProviders(<LisaYritus />);

		const textInputs = screen.getAllByRole('textbox');
		const nimiInput = textInputs[0];
		const kohtInput = textInputs[1];
		const lisainfoTextarea = textInputs[2];
		const aegInput = container.querySelector(
			'input[type="datetime-local"]'
		) as HTMLInputElement;

		await user.type(nimiInput, 'Test Event');
		await user.type(aegInput, '2025-12-31T10:00');
		await user.type(kohtInput, 'Test Location');
		await user.type(lisainfoTextarea, 'Test info');

		expect(nimiInput).toHaveValue('Test Event');
		expect(aegInput).toHaveValue('2025-12-31T10:00');
		expect(kohtInput).toHaveValue('Test Location');
		expect(lisainfoTextarea).toHaveValue('Test info');

		const submitButton = screen.getByRole('button', { name: /lisa$/i });
		await user.click(submitButton);

		await waitFor(() => {
			expect(mockMutateAsync).toHaveBeenCalled();
		});

		await waitFor(() => {
			expect(nimiInput).toHaveValue('');
			expect(aegInput).toHaveValue('');
			expect(kohtInput).toHaveValue('');
			expect(lisainfoTextarea).toHaveValue('');
		});
	});

	it('omab õigeid responsiivse paigutuse klasse', () => {
		const { container } = renderWithProviders(<LisaYritus />);

		const mainElement = container.querySelector('main');
		expect(mainElement).toHaveClass('bg-[#eef2f5]', 'min-h-screen');

		const contentContainer = container.querySelector('.max-w-5xl');
		expect(contentContainer).toBeInTheDocument();
	});

	it('renderdab Header ja Footer komponendid', () => {
		const { container } = renderWithProviders(<LisaYritus />);

		const logoImg = container.querySelector('img[src="/logo.svg"]');
		expect(logoImg).toBeInTheDocument();

		expect(
			screen.getByRole('button', { name: /avaleht/i })
		).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: /ürituse lisamine/i })
		).toBeInTheDocument();

		expect(screen.getAllByText('Curabitur')).toHaveLength(2);
		expect(screen.getByText('Kontakt')).toBeInTheDocument();
		expect(screen.getByText('Peakontor: Tallinnas')).toBeInTheDocument();
	});

	it('käsitleb lisainfo välja valikulisena', async () => {
		const user = userEvent.setup();
		const mockMutateAsync = vi.fn().mockResolvedValue(undefined);
		(eventsApi.useCreateEvent as Mock).mockReturnValue({
			mutateAsync: mockMutateAsync,
			isPending: false,
			isError: false,
			error: null,
		});

		const { container } = renderWithProviders(<LisaYritus />);

		const textInputs = screen.getAllByRole('textbox');
		const nimiInput = textInputs[0];
		const kohtInput = textInputs[1];
		const aegInput = container.querySelector(
			'input[type="datetime-local"]'
		) as HTMLInputElement;

		await user.type(nimiInput, 'Test Event');
		await user.type(aegInput, '2025-12-31T10:00');
		await user.type(kohtInput, 'Test Location');

		const submitButton = screen.getByRole('button', { name: /lisa$/i });
		await user.click(submitButton);

		await waitFor(() => {
			expect(mockMutateAsync).toHaveBeenCalledWith({
				nimi: 'Test Event',
				aeg: expect.stringMatching(/2025-12-31T10:00:00[+-]\d{2}:\d{2}/),
				koht: 'Test Location',
				lisainfo: '',
			});
		});
	});
});
