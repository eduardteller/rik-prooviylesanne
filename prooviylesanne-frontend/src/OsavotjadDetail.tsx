import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router';
import {
	useFyysilineIsik,
	useJuriidilineIsik,
	useUpdateFyysilineIsik,
	useUpdateJuriidilineIsik,
} from './api/participants';
import Footer from './components/Footer';
import Header from './components/Header';
import {
	eraisikSchema,
	ettevoteSchema,
	type EraisikFormData,
	type EttevoteFormData,
} from './schemas/participantSchemas';

/**
 * Osavõtja detailvaade komponent
 * Võimaldab vaadata ja muuta osavõtja (eraisik või ettevõte) andmeid
 */
const OsavotjadDetail = () => {
	// URL parameetritest saame osavõtja ID ja tüübi (eraisik või juriidiline)
	const { id, type } = useParams<{ id: string; type: string }>();
	const navigate = useNavigate();
	const location = useLocation();

	// Salvestame eelmise lehe aadressi, et saaks tagasi minna
	const previousLocation = (location.state as { from?: string })?.from || '/';

	const goBack = () => {
		navigate(previousLocation);
	};

	// Laadime osavõtja andmed vastavalt tüübile
	const {
		data: fyysilineIsikData,
		isLoading: isFyysilineLoading,
		error: fyysilineError,
	} = useFyysilineIsik(id || '', type === 'eraisik');

	const {
		data: juriidilineIsikData,
		isLoading: isJuriidilineLoading,
		error: juriidilineError,
	} = useJuriidilineIsik(id || '', type === 'juriidiline');

	// Määrame praeguse andmete allikad sõltuvalt osavõtja tüübist
	const isEraisik = type === 'eraisik';
	const currentData = isEraisik ? fyysilineIsikData : juriidilineIsikData;
	const isLoading = isEraisik ? isFyysilineLoading : isJuriidilineLoading;
	const error = isEraisik ? fyysilineError : juriidilineError;

	// Loome vormid mõlema osavõtja tüübi jaoks
	const eraisikForm = useForm<EraisikFormData>({
		resolver: zodResolver(eraisikSchema),
	});

	const ettevoteForm = useForm<EttevoteFormData>({
		resolver: zodResolver(ettevoteSchema),
	});

	// Valime õige vormi vastavalt osavõtja tüübile
	const currentForm = isEraisik ? eraisikForm : ettevoteForm;

	// Loome andmete uuendamise funktsioonid
	const updateFyysilineIsikMutation = useUpdateFyysilineIsik();
	const updateJuriidilineIsikMutation = useUpdateJuriidilineIsik();

	// Täidame vormi andmeid kui need on laetud
	useEffect(() => {
		if (currentData) {
			if (isEraisik && 'eesnimi' in currentData) {
				eraisikForm.reset({
					eesnimi: currentData.eesnimi,
					perekonnanimi: currentData.perekonnanimi,
					isikukood: currentData.isikukood,
					maksmiseViis: currentData.maksmiseViis.maksmiseViis,
					lisainfo: currentData.lisainfo || '',
				});
			} else if (!isEraisik && 'nimi' in currentData) {
				ettevoteForm.reset({
					nimi: currentData.nimi,
					registrikood: currentData.registrikood,
					osavotjateArv: currentData.osavotjateArv,
					maksmiseViis: currentData.maksmiseViis.maksmiseViis,
					lisainfo: currentData.lisainfo || '',
				});
			}
		}
	}, [currentData, isEraisik, eraisikForm, ettevoteForm]);

	// Vormi esitamise funktsioon - uuendab osavõtja andmeid
	const onSubmit = async (data: EraisikFormData | EttevoteFormData) => {
		if (!id) return;

		try {
			// Uuendame eraisiku andmeid
			if (isEraisik && 'eesnimi' in data) {
				await updateFyysilineIsikMutation.mutateAsync({
					id: parseInt(id),
					eesnimi: data.eesnimi,
					perekonnanimi: data.perekonnanimi,
					isikukood: data.isikukood,
					maksmiseViis: data.maksmiseViis,
					lisainfo: data.lisainfo || '',
				});
				alert('Eraisiku andmed uuendatud edukalt!');
				goBack();
			}
			// Uuendame ettevõtte andmeid
			else if (!isEraisik && 'nimi' in data) {
				await updateJuriidilineIsikMutation.mutateAsync({
					id: parseInt(id),
					nimi: data.nimi,
					registrikood: data.registrikood,
					osavotjateArv: data.osavotjateArv,
					maksmiseViis: data.maksmiseViis,
					lisainfo: data.lisainfo || '',
				});
				alert('Juriidilise isiku andmed uuendatud edukalt!');
				goBack();
			}
		} catch (error) {
			console.error('Failed to update participant:', error);
		}
	};

	// Kui andmed laadivad, näitame laadimise sõnumit
	if (isLoading) {
		return (
			<main className="bg-[#eef2f5] min-h-screen">
				<div className="relative mx-auto w-full max-w-5xl py-8 flex flex-col">
					<Header />
					<div className="mt-4 flex flex-col w-full">
						<div className="flex h-18 w-full overflow-hidden">
							<div className="py-4 pl-8 pr-22 bg-bermuda-500 text-3xl font-light text-white">
								<h2>Osavõtja info</h2>
							</div>
							<img src="/libled.jpg" className="object-cover flex-1" alt="" />
						</div>{' '}
						<div className="bg-white px-8 pt-8 pb-20 flex flex-col">
							<div className="flex justify-center items-center h-82">
								<p>Laadimine...</p>
							</div>
						</div>
					</div>
					<Footer />
				</div>
			</main>
		);
	}

	// Kui andmete laadimisel tekkis viga, näitame veateadet
	if (error) {
		return (
			<main className="bg-[#eef2f5] min-h-screen">
				<div className="relative mx-auto w-full max-w-5xl py-8 flex flex-col">
					<Header />
					<div className="mt-4 flex flex-col w-full">
						<div className="flex h-18 w-full overflow-hidden">
							<div className="py-4 pl-8 pr-22 bg-bermuda-500 text-3xl font-light text-white">
								<h2>Osavõtja info</h2>
							</div>
							<img src="/libled.jpg" className="object-cover flex-1" alt="" />
						</div>{' '}
						<div className="bg-white px-8 pt-8 pb-20 flex flex-col">
							<div className="flex justify-center items-center h-82">
								<p className="text-red-500">
									Viga andmete laadimisel: {error.message}
								</p>
							</div>
						</div>
					</div>
					<Footer />
				</div>
			</main>
		);
	}

	// Peamine vaade kus kuvatakse ja saab muuta osavõtja andmeid
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

								<form onSubmit={currentForm.handleSubmit(onSubmit)}>
									<div className=" flex flex-col  ">
										<div className="flex mt-2 ">
											{/* Väljade nimed vasakul poolel */}
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
											{/* Sisestusväljad paremal poolel */}
											<div className=" flex flex-col gap-2 w-64">
												{type === 'eraisik' ? (
													<>
														{/* Eraisiku andmete sisestusväljad */}
														<div>
															<input
																{...eraisikForm.register('eesnimi')}
																type="text"
																className="border w-full border-gray-500 rounded-sm px-2 py-[2px]"
															/>
															{eraisikForm.formState.errors.eesnimi && (
																<p className="text-red-500 text-xs mt-1">
																	{eraisikForm.formState.errors.eesnimi.message}
																</p>
															)}
														</div>
														<div>
															<input
																{...eraisikForm.register('perekonnanimi')}
																type="text"
																className="border w-full border-gray-500 rounded-sm px-2 py-[2px]"
															/>
															{eraisikForm.formState.errors.perekonnanimi && (
																<p className="text-red-500 text-xs mt-1">
																	{
																		eraisikForm.formState.errors.perekonnanimi
																			.message
																	}
																</p>
															)}
														</div>
														<div>
															<input
																{...eraisikForm.register('isikukood')}
																type="text"
																className="border w-full border-gray-500 rounded-sm px-2 py-[2px]"
															/>
															{eraisikForm.formState.errors.isikukood && (
																<p className="text-red-500 text-xs mt-1">
																	{
																		eraisikForm.formState.errors.isikukood
																			.message
																	}
																</p>
															)}
														</div>
													</>
												) : (
													<>
														{/* Ettevõtte andmete sisestusväljad */}
														<div>
															<input
																{...ettevoteForm.register('nimi')}
																type="text"
																className="border w-full border-gray-500 rounded-sm px-2 py-[2px]"
															/>
															{ettevoteForm.formState.errors.nimi && (
																<p className="text-red-500 text-xs mt-1">
																	{ettevoteForm.formState.errors.nimi.message}
																</p>
															)}
														</div>
														<div>
															<input
																{...ettevoteForm.register('registrikood')}
																type="text"
																className="border w-full border-gray-500 rounded-sm px-2 py-[2px]"
															/>
															{ettevoteForm.formState.errors.registrikood && (
																<p className="text-red-500 text-xs mt-1">
																	{
																		ettevoteForm.formState.errors.registrikood
																			.message
																	}
																</p>
															)}
														</div>
														<div>
															<input
																{...ettevoteForm.register('osavotjateArv')}
																type="text"
																className="border w-full border-gray-500 rounded-sm px-2 py-[2px]"
															/>
															{ettevoteForm.formState.errors.osavotjateArv && (
																<p className="text-red-500 text-xs mt-1">
																	{
																		ettevoteForm.formState.errors.osavotjateArv
																			.message
																	}
																</p>
															)}
														</div>
													</>
												)}
												{/* Maksmisviisi valik (ühine mõlemale tüübile) */}
												<div>
													<select
														{...(type === 'eraisik'
															? eraisikForm.register('maksmiseViis')
															: ettevoteForm.register('maksmiseViis'))}
														className="border w-full border-gray-500 rounded-sm px-2 py-[2px]"
													>
														<option value="">Vali maksmisviis</option>
														<option value="pangaülekanne">Pangaülekanne</option>
														<option value="sularaha">Sularaha</option>
													</select>
													{type === 'eraisik' &&
														eraisikForm.formState.errors.maksmiseViis && (
															<p className="text-red-500 text-xs mt-1">
																{
																	eraisikForm.formState.errors.maksmiseViis
																		.message
																}
															</p>
														)}
													{type !== 'eraisik' &&
														ettevoteForm.formState.errors.maksmiseViis && (
															<p className="text-red-500 text-xs mt-1">
																{
																	ettevoteForm.formState.errors.maksmiseViis
																		.message
																}
															</p>
														)}
												</div>
												{/* Lisainfo tekstiväli */}
												<div>
													<textarea
														{...(type === 'eraisik'
															? eraisikForm.register('lisainfo')
															: ettevoteForm.register('lisainfo'))}
														className="border w-full border-gray-500 rounded-sm px-2 py-[2px] resize-none"
													></textarea>
												</div>
											</div>
										</div>
										{/* Nupud vormi allosas */}
										<div className="flex mt-8 gap-2">
											<button
												type="button"
												onClick={goBack}
												className="bg-zinc-300 w-15 flex items-center justify-center hover:bg-zinc-400 text-zinc-800 duration-100 cursor-pointer py-[2px] text-sm  font-semibold rounded-xs "
											>
												Tagasi
											</button>
											<button
												type="submit"
												disabled={
													updateFyysilineIsikMutation.isPending ||
													updateJuriidilineIsikMutation.isPending
												}
												className="bg-bermuda-500 hover:bg-bermuda-600 duration-100 cursor-pointer py-[2px] text-sm  text-white rounded-xs w-15 disabled:opacity-50"
											>
												{updateFyysilineIsikMutation.isPending ||
												updateJuriidilineIsikMutation.isPending
													? 'Salvestame...'
													: 'Salvesta'}
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
