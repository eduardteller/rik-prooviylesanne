function App() {
	return (
		<>
			<main className="bg-[#eef2f5] min-h-screen">
				<div className="relative mx-auto h-screen w-full max-w-6xl py-8 flex flex-col">
					<div className="bg-white h-20 flex justify-between">
						<div className="flex flex-row items-center h-full">
							<img src="/logo.svg" className="px-6" alt="" />
							<button className="h-full hover:cursor-pointer px-4 ml-24 text-white bg-bermuda-500 font-bold uppercase text-xs duration-100">
								Avaleht
							</button>
							<button className="h-full px-4 hover:cursor-pointer text-gray-900 hover:text-white hover:bg-[#373737] font-bold uppercase text-xs duration-100">
								Ürituse lisamine
							</button>
						</div>
						<img src="/symbol.svg" alt="" className="pr-8 py-3" />
					</div>
					<div className="mt-4 w-full">
						<div className="w-full h-full bg-white flex">
							<div className="basis-1/2 flex flex-col items-center justify-center bg-bermuda-500 text-white text-xl">
								<p className=" px-8 leading-8">
									Lorem ipsum dolor sit amet consectetur adipisicing elit.
									Exercitationem praesentium veritatis odit asperiores laborum
									officiis repudiandae enim quaerat deserunt facilis?
								</p>
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
										<div id="1" className="w-full flex justify-between">
											<p>1. Aenean Commodo</p>
											<div className="flex gap-12">
												<p>14.02.16</p>
												<div className="flex gap-2 items-center">
													<button className="font-bold text-xs text-zinc-400 duration-100 hover:text-zinc-500 uppercase cursor-pointer">
														OSAVÕTJAD
													</button>
													<button className="font-bold opacity-60 uppercase duration-100 hover:opacity-80 cursor-pointer">
														<img src="/remove.svg" className="w-3 h-3" alt="" />
													</button>
												</div>
											</div>
										</div>
										<div id="2" className="w-full flex justify-between">
											<p>2. Aenean Commodo</p>
											<div className="flex gap-12">
												<p>14.02.16</p>
												<div className="flex gap-2 items-center">
													<button className="font-bold text-xs text-zinc-400 duration-100 hover:text-zinc-500 uppercase cursor-pointer">
														OSAVÕTJAD
													</button>
													<button className="font-bold opacity-60 uppercase duration-100 hover:opacity-80 cursor-pointer">
														<img src="/remove.svg" className="w-3 h-3" alt="" />
													</button>
												</div>
											</div>
										</div>
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
										<div id="2" className="w-full flex justify-between">
											<p>2. Aenean Commodo</p>
											<div className="flex gap-12">
												<p>14.02.16</p>
												<button className="font-bold text-xs text-zinc-400 duration-100 hover:text-zinc-500 uppercase cursor-pointer">
													OSAVÕTJAD
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="mt-4 w-full">
						<div className="w-full h-full bg-[#373737] text-white flex p-12 ">
							<div className="flex flex-col opacity-75">
								<h1 className="text-3xl">Curabitur</h1>
								<p className="mt-4  ">Emauris</p>
								<p className=" ">Kfringilla</p>
								<p className=" ">Oin magna sem</p>
								<p className=" ">Kelementum</p>
							</div>
							<div className="flex flex-col opacity-75 ml-32">
								<h1 className="text-3xl ">Fusce</h1>
								<p className="mt-4  ">Econsectetur</p>
								<p className=" ">Ksollicitudin</p>
								<p className=" ">Omvulputate</p>
								<p className=" ">Nunc fringilla tellu</p>
							</div>
							<div className="flex flex-col ml-32">
								<h1 className="text-3xl opacity-75">Kontakt</h1>
								<p className="mt-4  font-semibold opacity-85">
									Peakontor: Tallinnas
								</p>
								<p className=" opacity-75">Väike- Ameerika 1, 11415 Tallinn</p>
								<p className=" opacity-75">Telefon: 605 4450</p>
								<p className=" opacity-75">Faks: 605 3186</p>
							</div>
							<div className="flex flex-col ml-12">
								<h1 className="text-3xl opacity-0">Curabitur</h1>
								<p className="mt-4 font-semibold opacity-85">
									Harukontor: Võrus
								</p>
								<p className=" opacity-75">Oja tn 7 (külastusaadress)</p>
								<p className=" opacity-75">Telefon: 605 3330</p>
								<p className=" opacity-75">Faks: 605 3155</p>
							</div>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}

export default App;
