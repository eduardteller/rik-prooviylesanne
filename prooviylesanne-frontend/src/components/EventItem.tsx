import { formatDate, useDeleteEvent, type Event } from '../api/events';

interface EventItemProps {
	event: Event;
	index: number;
	showRemoveButton?: boolean;
}

export const EventItem = ({
	event,
	index,
	showRemoveButton = false,
}: EventItemProps) => {
	const deleteEventMutation = useDeleteEvent();
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
			<p>
				{index + 1}. {event.nimi}
			</p>
			<div className="flex gap-12">
				<p>{formatDate(event.aeg)}</p>
				<div className="flex gap-2 items-center">
					{' '}
					<button className="font-bold text-xs text-zinc-400 duration-100 hover:text-zinc-500 uppercase cursor-pointer">
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
		</div>
	);
};
