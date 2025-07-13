import { useLocation, useNavigate } from 'react-router';
import { formatDate, useDeleteEvent, type Event } from '../api/events';

/**
 * EventItem komponendi omadused
 */
interface EventItemProps {
	event: Event;
	index: number;
	showRemoveButton?: boolean;
}

/**
 * EventItem komponent - kuvab ühe ürituse andmed loendis
 *
 * Komponent näitab ürituse põhiinfot ja võimaldab navigeerida osavõtjate vaatele.
 * Vajadusel saab ürituse ka kustutada.
 */
export const EventItem = ({
	event,
	index,
	showRemoveButton = false,
}: EventItemProps) => {
	const navigate = useNavigate();
	const location = useLocation();
	const deleteEventMutation = useDeleteEvent();

	/**
	 * Ürituse kustutamise loogika
	 * Küsib kasutajalt kinnitust ja kustutab ürituse serverist
	 */
	const handleDelete = () => {
		if (
			window.confirm(
				`Kas oled kindel, et soovid kustutada ürituse "${event.nimi}"?`
			)
		) {
			deleteEventMutation.mutate(event.id, {
				onError: (error) => {
					alert(`Viga ürituse kustutamisel: ${error.message}`);
				},
			});
		}
	};

	return (
		<div id={event.id.toString()} className="w-full flex justify-between">
			{/* Ürituse põhiandmed - nimi, kuupäev, koht ja osavõtjate arv */}
			<div className="flex gap-2 items-center flex-1">
				<p className=" w-24 truncate">
					{' '}
					{index + 1}. {event.nimi}{' '}
				</p>
				<p className=" w-16 truncate">{formatDate(event.aeg)}</p>
				<p className=" w-28 truncate">{event.koht}</p>
				<p className=" w-8 truncate">{event.isikudCount}</p>
			</div>

			{/* Toimingute nupud - osavõtjad ja kustutamine */}
			<div className="flex gap-2 items-center">
				{' '}
				<button
					onClick={() =>
						navigate(`/osavotjad/${event.id}`, {
							state: { from: location.pathname },
						})
					}
					className="font-bold text-xs text-zinc-400 duration-100 hover:text-zinc-500 uppercase cursor-pointer"
				>
					OSAVÕTJAD
				</button>
				{showRemoveButton && (
					<button
						onClick={handleDelete}
						disabled={deleteEventMutation.isPending}
						className="font-bold opacity-60 uppercase duration-100 hover:opacity-80 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
					>
						<img src="/remove.svg" className="w-3 h-3" alt="" />
					</button>
				)}
			</div>
		</div>
	);
};
