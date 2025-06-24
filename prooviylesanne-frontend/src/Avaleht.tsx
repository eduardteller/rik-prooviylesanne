import { categorizeEvents, useEvents } from './api/events';
import { EventItem } from './components/EventItem';
import Footer from './components/Footer';
import Header from './components/Header';

function Avaleht() {
	const { data: events, isLoading, error } = useEvents();

	const { upcomingEvents, pastEvents } = events
		? categorizeEvents(events)
		: { upcomingEvents: [], pastEvents: [] };

	return (
		<>
			<main className="bg-[#eef2f5] min-h-screen">
				<div className="relative mx-auto h-screen w-full max-w-5xl py-8 flex flex-col">
					<Header />
					<div className="mt-4 w-full">
						<div className="w-full h-full bg-white flex">
							<div className="basis-1/2 flex flex-col items-center justify-center bg-bermuda-500 text-white text-xl">
								<span className=" px-8 leading-8">
									Sed nec elit vestibulum, <strong>tincidunt orci</strong> et,
									sagittis ex. Vestibulum rutrum <strong>neque suscipit</strong>{' '}
									ante mattis maximus. Nulla non sapien{' '}
									<strong>viverra, lobortis lorem non</strong>, accumsan metus.
								</span>
							</div>
							<div className="basis-1/2 h-full bg-yellow-300 transform ">
								<img
									src="/pilt.jpg"
									className="object-cover w-full h-full"
									alt=""
								/>
							</div>
						</div>
					</div>
					<div className="mt-4 w-full flex-1 flex flex-col min-h-0">
						<div className="w-full h-full flex gap-4 flex-1">
							<div className="basis-1/2 flex flex-col items-center bg-white text-white ">
								<h1 className="py-4 text-xl bg-bermuda-500 w-full text-center">
									Tulevased üritused
								</h1>
								<div className=" text-zinc-600 flex-1 w-full overflow-y-auto">
									{/* main container with fetched data */}
									<div className="flex flex-col gap-2 pt-4 pb-2 px-8">
										{isLoading ? (
											<div className="text-center py-4">Laadimine...</div>
										) : error ? (
											<div className="text-center py-4 text-red-500">
												Viga: {error.message}
											</div>
										) : upcomingEvents.length > 0 ? (
											upcomingEvents.map((event, index) => (
												<EventItem
													key={event.id}
													event={event}
													index={index}
													showRemoveButton={true}
												/>
											))
										) : (
											<div className="text-center py-4">Üritused puuduvad</div>
										)}
									</div>
								</div>
								<div className="w-full px-8 pb-4 pt-2">
									<button className="font-bold text-xs text-zinc-400 duration-100 hover:text-zinc-500 uppercase cursor-pointer">
										LISA ÜRITUS
									</button>
								</div>
							</div>
							<div className="basis-1/2 flex flex-col items-center bg-white text-white ">
								<h1 className="py-4 text-xl bg-bermuda-500 w-full text-center">
									Toimunud üritused
								</h1>
								<div className=" text-zinc-600 flex-1 w-full overflow-y-auto">
									{/* main container with fetched data */}
									<div className="flex flex-col gap-2 pt-4 pb-2 px-8">
										{isLoading ? (
											<div className="text-center py-4">Laadimine...</div>
										) : error ? (
											<div className="text-center py-4 text-red-500">
												Viga: {error.message}
											</div>
										) : pastEvents.length > 0 ? (
											pastEvents.map((event, index) => (
												<EventItem
													key={event.id}
													event={event}
													index={index}
													showRemoveButton={false}
												/>
											))
										) : (
											<div className="text-center py-4">Üritused puuduvad</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
					<Footer />
				</div>
			</main>
		</>
	);
}

export default Avaleht;
