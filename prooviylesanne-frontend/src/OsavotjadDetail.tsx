import { useParams } from 'react-router';
import Footer from './components/Footer';
import Header from './components/Header';

const OsavotjadDetail = () => {
	const { id } = useParams<{ id: string }>();
	const { type } = useParams<{ type: string }>();

	return (
		<main className="bg-[#eef2f5] min-h-screen">
			<div className="relative mx-auto  w-full max-w-5xl py-8 flex flex-col">
				<Header />
				<div className="mt-4 flex flex-col  w-full">
					<div className="flex h-18 w-full overflow-hidden">
						<div className="py-4 pl-8 pr-22 bg-bermuda-500 text-3xl font-light text-white">
							<h2>Osavõtja info</h2>
						</div>
						<img src="/libled.jpg" className="object-cover flex-1" alt="" />
					</div>{' '}
					<div className="bg-white px-8 pt-8 pb-20  flex flex-col">
						<div>
							<div className=" flex flex-col gap-8 ml-64">
								<h2 className="text-bermuda-500 text-2xl">Osavõtja info</h2>

								<form>
									<div className=" flex flex-col  ">
										<div className="flex mt-2 ">
											<div className="flex gap-4 w-34 flex-col">
												{type === 'eraisik' ? (
													<>
														<p>Eesnimi:</p>
														<p>Perenimi:</p>
														<p>Isikukood:</p>
														<p>Maksmisviis:</p>
														<p>Lisainfo:</p>
													</>
												) : (
													<>
														<p>Nimi:</p>
														<p>Registrikood:</p>
														<p>Osavõtjate arv:</p>
														<p>Maksmisviis:</p>
														<p>Lisainfo:</p>
													</>
												)}
											</div>
											<div className=" flex flex-col gap-2 w-64">
												{type === 'eraisik' ? (
													<>
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
													</>
												) : (
													<>
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
													</>
												)}
												<div>
													<select className="border w-full border-gray-500 rounded-sm px-2 py-[2px]">
														<option value="">Vali maksmisviis</option>
														<option value="pangaülekanne">Pangaülekanne</option>
														<option value="sularaha">Sularaha</option>
													</select>
												</div>
												<div>
													<textarea className="border w-full border-gray-500 rounded-sm px-2 py-[2px] resize-none"></textarea>
												</div>
											</div>
										</div>
										<div className="flex mt-8 gap-2">
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

export default OsavotjadDetail;
