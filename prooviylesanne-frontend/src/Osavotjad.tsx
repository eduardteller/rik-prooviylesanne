import Footer from './components/Footer';
import Header from './components/Header';

const Osavotjad = () => {
	// const { id } = useParams<{ id: string }>();

	return (
		<main className="bg-[#eef2f5] min-h-screen">
			<div className="relative mx-auto  w-full max-w-5xl py-8 flex flex-col">
				<Header />
				<div className="mt-4 flex flex-col  w-full">
					<div className="flex h-18 w-full">
						<div className="p-4 px-6 bg-bermuda-500 text-3xl font-light text-white">
							<h2>Ürituse lisamine</h2>
						</div>
						<img src="/libled.jpg" className="object-cover flex-1" alt="" />
					</div>{' '}
					<div className="bg-white px-8 pt-8 pb-20  flex flex-col">
						{/* {id && (
							<div className="mb-4 p-4 bg-blue-100 border border-blue-300 rounded">
								<p className="text-blue-800">
									Extracted ID from URL: <strong>{id}</strong>
								</p>
							</div>
						)} */}
						<div>
							<div className=" flex flex-col gap-8 ml-64">
								<h2 className="text-bermuda-500 text-2xl">Osavõtjad</h2>
								<div className="flex gap-12">
									<div className="flex gap-4 flex-col">
										<p>Ürituse nimi:</p>
										<p>Toimumisaeg:</p>
										<p>Koht:</p>
										<p>Osavõtjad:</p>
									</div>
									<div className="flex gap-4 text-sm flex-col flex-1">
										<p>TEST</p>
										<p>TEST</p>
										<p>TEST</p>
										<div className="py-8 w-4/5 flex flex-col gap-2">
											<div className="flex text-sm justify-between">
												<p>1. Mihkel Amman</p>
												<p>503071650336</p>
												<button className="text-xs font-bold text-zinc-500 uppercase cursor-pointer">
													Vaata
												</button>
												<button className="text-xs font-bold text-zinc-500 uppercase cursor-pointer">
													Kustuta
												</button>
											</div>
											<div className="flex text-sm justify-between">
												<p>1. Mihkel Amman</p>
												<p>503071650336</p>
												<button className="text-xs font-bold text-zinc-500 uppercase cursor-pointer">
													Vaata
												</button>
												<button className="text-xs font-bold text-zinc-500 uppercase cursor-pointer">
													Kustuta
												</button>
											</div>
											<div className="flex text-sm justify-between">
												<p>1. Mihkel Amman</p>
												<p>503071650336</p>
												<button className="text-xs font-bold text-zinc-500 uppercase cursor-pointer">
													Vaata
												</button>
												<button className="text-xs font-bold text-zinc-500 uppercase cursor-pointer">
													Kustuta
												</button>
											</div>
										</div>
									</div>
								</div>
								<form>
									<div className=" flex flex-col  ">
										<h2 className="text-bermuda-500 text-2xl">
											Osavõtjate lisamine
										</h2>
										<div className="flex ml-34 mt-8 gap-16">
											<div className="flex gap-1 items-center">
												<input
													type="radio"
													name="participantType"
													value="eraisik"
													id="eraisik"
												/>
												<label htmlFor="eraisik">Eraisik</label>
											</div>
											<div className="flex gap-1 items-center">
												<input
													type="radio"
													name="participantType"
													value="ettevote"
													id="ettevote"
												/>
												<label htmlFor="ettevote">Ettevõte</label>
											</div>
										</div>
										<div className="flex mt-2 gap-12">
											<div className="flex gap-4 flex-col">
												<p>Eesnimi:</p>
												<p>Perenimi:</p>
												<p>Isikukood:</p>
												<p>Maksmisviis:</p>
												<p>Lisainfo:</p>
											</div>
											<div className=" flex flex-col gap-2 w-64">
												<div>
													<input
														type="text"
														className="border w-full border-gray-500 rounded-sm px-2 py-[2px]"
													/>
												</div>{' '}
												<div>
													<input
														type="text"
														className="border w-full border-gray-500 rounded-sm px-2 py-[2px]"
													/>
												</div>
												<div>
													<input
														type="text"
														className="border w-full border-gray-500 rounded-sm px-2 py-[2px]"
													/>
												</div>
												<div>
													<input
														type="text"
														className="border w-full border-gray-500 rounded-sm px-2 py-[2px]"
													/>
												</div>
												<div>
													<textarea
														className="border w-full border-gray-500 rounded-sm px-2 py-[2px] resize-none"
														name="lisainfo"
														id="lisainfo"
													></textarea>
												</div>
											</div>
										</div>
										<div className="flex gap-2">
											<button
												type="button"
												className="bg-zinc-300 w-15 flex items-center justify-center hover:bg-zinc-400 text-zinc-800 duration-100 cursor-pointer py-[2px] text-sm  font-semibold rounded-xs "
											>
												Tagasi
											</button>
											<button
												type="submit"
												className="bg-bermuda-500 hover:bg-bermuda-600 duration-100 cursor-pointer py-[2px] text-sm  text-white rounded-xs w-15 disabled:opacity-50"
											>
												Salvesta
											</button>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		</main>
	);
};

export default Osavotjad;
