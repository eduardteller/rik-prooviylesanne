import Footer from './components/Footer';
import Header from './components/Header';

const LisaYritus = () => {
	return (
		<>
			<main className="bg-[#eef2f5] min-h-screen">
				<div className="relative mx-auto h-screen w-full max-w-5xl py-8 flex flex-col">
					<Header />
					<div className="mt-4 flex flex-col  w-full">
						<div className="flex h-18 w-full">
							<div className="p-4 px-6 bg-bermuda-500 text-3xl font-light text-white">
								<h2>Ürituse lisamine</h2>
							</div>
							<img src="/libled.jpg" className="object-cover flex-1" alt="" />
						</div>
						<div className="bg-white px-8 pt-8 pb-20  flex flex-col">
							<div className=" flex flex-col gap-8 ml-64">
								<h2 className="text-bermuda-500 text-2xl">Ürituse lisamine</h2>
								<div className="flex gap-12">
									<div className="flex gap-4 flex-col">
										<p>Ürituse nimi:</p>
										<p>Toimumisaeg:</p>
										<p>Koht:</p>
										<p>Lisainfo:</p>
									</div>
									<div className=" flex flex-col gap-2 w-64">
										<input
											type="text"
											className="border w-full border-gray-500 rounded-sm px-2 py-[2px]  "
										/>
										<input
											type="text"
											className="border w-full border-gray-500 rounded-sm px-2 py-[2px] "
										/>
										<input
											type="text"
											className="border w-full   border-gray-500 rounded-sm px-2 py-[2px]  "
										/>
										<textarea
											className="border w-full   border-gray-500 rounded-sm px-2 py-[2px] resize-none "
											name=""
											id=""
										></textarea>
									</div>
								</div>
								<div className="flex gap-2">
									<button className="bg-zinc-300 w-15 flex items-center justify-center hover:bg-zinc-400 text-zinc-800 duration-100 cursor-pointer py-[2px] text-sm  font-semibold rounded-xs ">
										Tagasi
									</button>
									<button className="bg-bermuda-500 hover:bg-bermuda-600 duration-100 cursor-pointer py-[2px] text-sm  text-white rounded-xs w-15">
										Lisa
									</button>
								</div>
							</div>
						</div>
					</div>
					<Footer />
				</div>
			</main>
		</>
	);
};

export default LisaYritus;
