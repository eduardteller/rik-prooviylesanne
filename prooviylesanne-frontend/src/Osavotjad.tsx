import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router';
import { formatDate, useEvent } from './api/events';
import {
	useAddEraisik,
	useAddEttevote,
	useAvailableParticipants,
	useDeleteFyysilineIsik,
	useDeleteJuriidilineIsik,
	useParticipants,
	type FyysilineIsik,
	type JuriidilineIsik,
} from './api/participants';
import Footer from './components/Footer';
import Header from './components/Header';
import {
	eraisikSchema,
	ettevoteSchema,
	type EraisikFormData,
	type EttevoteFormData,
} from './schemas/participantSchemas';

type AvailableParticipant =
	| (FyysilineIsik & { type: 'fyysiline' })
	| (JuriidilineIsik & { type: 'juriidiline' });

const Osavotjad = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const location = useLocation();
	const [participantType, setParticipantType] = useState<
		'eraisik' | 'ettevote'
	>('eraisik');
	const [selectedExistingParticipant, setSelectedExistingParticipant] =
		useState<AvailableParticipant | null>(null);

	const getAllAvailableParticipants = (): AvailableParticipant[] => {
		if (!availableParticipants) return [];

		const fyysilised: AvailableParticipant[] =
			availableParticipants.fyysilisedIsikud.map((p) => ({
				...p,
				type: 'fyysiline' as const,
			}));

		const juriidilised: AvailableParticipant[] =
			availableParticipants.juriidilisedIsikud.map((p) => ({
				...p,
				type: 'juriidiline' as const,
			}));

		return [...fyysilised, ...juriidilised];
	};

	const {
		data: event,
		isLoading: eventLoading,
		error: eventError,
	} = useEvent(id || '');

	const {
		data: participants,
		isLoading: participantsLoading,
		error: participantsError,
	} = useParticipants(id || '');

	const {
		data: availableParticipants,
		isLoading: availableParticipantsLoading,
		error: availableParticipantsError,
	} = useAvailableParticipants(id || '');

	const addEraisikMutation = useAddEraisik();
	const addEttevoteMutation = useAddEttevote();
	const deleteFyysilineIsikMutation = useDeleteFyysilineIsik();
	const deleteJuriidilineIsikMutation = useDeleteJuriidilineIsik();

	const eraisikForm = useForm<EraisikFormData>({
		resolver: zodResolver(eraisikSchema),
		defaultValues: {
			eesnimi: '',
			perekonnanimi: '',
			isikukood: '',
			maksmiseViis: '',
			lisainfo: '',
		},
	});

	const ettevoteForm = useForm<EttevoteFormData>({
		resolver: zodResolver(ettevoteSchema),
		defaultValues: {
			nimi: '',
			registrikood: '',
			osavotjateArv: '',
			maksmiseViis: '',
			lisainfo: '',
		},
	});

	const onSubmitEraisik = (data: EraisikFormData) => {
		console.log('NICK', selectedExistingParticipant);

		const submitData =
			selectedExistingParticipant &&
			selectedExistingParticipant.type === 'fyysiline'
				? {
						...data,
						yritusId: id,
						isikId: selectedExistingParticipant.id,
						eesnimi: selectedExistingParticipant.eesnimi,
						perekonnanimi: selectedExistingParticipant.perekonnanimi,
						isikukood: selectedExistingParticipant.isikukood,
						maksmiseViis: selectedExistingParticipant.maksmiseViis.maksmiseViis,
						lisainfo: selectedExistingParticipant.lisainfo || '',
				  }
				: { ...data, yritusId: id };

		addEraisikMutation.mutate(submitData, {
			onSuccess: () => {
				eraisikForm.reset();
				setSelectedExistingParticipant(null);
				alert('Eraisik lisatud edukalt!');
				navigate(`/`);
			},
			onError: (error) => {
				console.error('Error adding eraisik:', error);
				alert('Viga eraisiku lisamisel!');
			},
		});
	};

	const onSubmitEttevote = (data: EttevoteFormData) => {
		const submitData =
			selectedExistingParticipant &&
			selectedExistingParticipant.type === 'juriidiline'
				? {
						...data,
						yritusId: id,
						isikId: selectedExistingParticipant.id,
						nimi: selectedExistingParticipant.nimi,
						registrikood: selectedExistingParticipant.registrikood,
						osavotjateArv: selectedExistingParticipant.osavotjateArv,
						maksmiseViis: selectedExistingParticipant.maksmiseViis.maksmiseViis,
						lisainfo: selectedExistingParticipant.lisainfo || '',
				  }
				: { ...data, yritusId: id };

		addEttevoteMutation.mutate(submitData, {
			onSuccess: () => {
				ettevoteForm.reset();
				setSelectedExistingParticipant(null);
				alert('Ettevõte lisatud edukalt!');
				navigate(`/`);
			},
			onError: (error) => {
				console.error('Error adding ettevote:', error);
				alert('Viga ettevõte lisamisel!');
			},
		});
	};

	const handleDeleteFyysilineIsik = (isikId: number) => {
		if (
			window.confirm('Kas olete kindel, et soovite selle eraisiku kustutada?')
		) {
			deleteFyysilineIsikMutation.mutate(isikId, {
				onSuccess: () => {
					alert('Eraisik kustutatud edukalt!');
				},
				onError: (error) => {
					console.error('Error deleting fyysiline isik:', error);
					alert('Viga eraisiku kustutamisel!');
				},
			});
		}
	};

	const handleDeleteJuriidilineIsik = (isikId: number) => {
		if (
			window.confirm('Kas olete kindel, et soovite selle ettevõtte kustutada?')
		) {
			deleteJuriidilineIsikMutation.mutate(isikId, {
				onSuccess: () => {
					alert('Ettevõte kustutatud edukalt!');
				},
				onError: (error) => {
					console.error('Error deleting juriidiline isik:', error);
					alert('Viga ettevõtte kustutamisel!');
				},
			});
		}
	};

	const isSubmitting =
		addEraisikMutation.isPending || addEttevoteMutation.isPending;

	const isEventExpired = event ? new Date(event.aeg) < new Date() : false;

	return (
		<main className="bg-[#eef2f5] min-h-screen">
			<div className="relative mx-auto  w-full max-w-5xl py-8 flex flex-col">
				<Header />
				<div className="mt-4 flex flex-col  w-full">
					<div className="flex h-18 w-full overflow-hidden">
						<div className="py-4 pl-8 pr-22 bg-bermuda-500 text-3xl font-light text-white">
							<h2>Osavõtjad</h2>
						</div>
						<img src="/libled.jpg" className="object-cover flex-1" alt="" />
					</div>{' '}
					<div className="bg-white px-8 pt-8 pb-20  flex flex-col">
						<div>
							<div className=" flex flex-col gap-8 ml-64">
								<h2 className="text-bermuda-500 text-2xl">Osavõtjad</h2>
								<div className="flex ">
									<div className="flex gap-4 w-36 flex-col">
										<p>Ürituse nimi:</p>
										<p>Toimumisaeg:</p>
										<p>Koht:</p>
										<p>Osavõtjade arv:</p>
										<p>Osavõtjad:</p>
									</div>
									<div className="flex text-gray-700  gap-5 text-sm flex-col flex-1">
										{eventLoading ? (
											<>
												<p>Laeb...</p>
												<p>Laeb...</p>
												<p>Laeb...</p>
												<p>Laeb...</p>
											</>
										) : eventError ? (
											<>
												<p className="text-red-500">Viga ürituse laadimisel</p>
												<p className="text-red-500">Viga ürituse laadimisel</p>
												<p className="text-red-500">Viga ürituse laadimisel</p>
											</>
										) : event ? (
											<>
												<p>{event.nimi}</p>
												<p>{formatDate(event.aeg)}</p>
												<p>{event.koht}</p>
												<p>{event.isikudCount} osavõtjat</p>
											</>
										) : (
											<>
												<p>-</p>
												<p>-</p>
												<p>-</p>
												<p>-</p>
											</>
										)}
										<div className=" mt-4 gap-4 flex flex-col h-24 overflow-y-auto">
											{participantsLoading ? (
												<p className="text-sm">Laeb osavõtjaid...</p>
											) : participantsError ? (
												<p className="text-red-500 text-sm">
													Viga osavõtjate laadimisel
												</p>
											) : participants ? (
												<>
													{participants.fyysilisedIsikud.map((isik, index) => (
														<div key={isik.id} className="flex text-sm">
															<p className="w-44">
																{index + 1}. {isik.eesnimi} {isik.perekonnanimi}
															</p>
															<p className="w-44">{isik.isikukood}</p>
															<div className="  flex items-center gap-8">
																<button
																	className="text-xs font-bold text-gray-500 hover:text-gray-600 uppercase cursor-pointer"
																	onClick={() =>
																		navigate(`/osavotjad/eraisik/${isik.id}`, {
																			state: { from: location.pathname },
																		})
																	}
																>
																	Vaata
																</button>
																<button
																	className="text-xs  font-bold text-gray-500 hover:text-gray-600 uppercase cursor-pointer"
																	onClick={() =>
																		handleDeleteFyysilineIsik(isik.id)
																	}
																>
																	Kustuta
																</button>
															</div>
														</div>
													))}
													{participants.juriidilisedIsikud.map(
														(isik, index) => (
															<div key={isik.id} className="flex text-sm">
																<p className="w-44">
																	{participants.fyysilisedIsikud.length +
																		index +
																		1}
																	. {isik.nimi}
																</p>
																<p className="w-44">{isik.registrikood}</p>
																{!isEventExpired && (
																	<div className="  flex items-center gap-8">
																		<button
																			className="text-xs font-bold text-zinc-500 uppercase cursor-pointer"
																			onClick={() =>
																				navigate(
																					`/osavotjad/juriidiline/${isik.id}`,
																					{ state: { from: location.pathname } }
																				)
																			}
																		>
																			Vaata
																		</button>
																		<button
																			className="text-xs font-bold text-zinc-500 uppercase cursor-pointer"
																			onClick={() =>
																				handleDeleteJuriidilineIsik(isik.id)
																			}
																		>
																			Kustuta
																		</button>
																	</div>
																)}
															</div>
														)
													)}
													{participants.fyysilisedIsikud.length === 0 &&
														participants.juriidilisedIsikud.length === 0 && (
															<p className="text-sm text-gray-500">
																Osavõtjaid ei ole veel lisatud
															</p>
														)}
												</>
											) : (
												<p className="text-sm text-gray-500">
													Osavõtjaid ei ole veel lisatud
												</p>
											)}
										</div>
									</div>
								</div>
								{!isEventExpired && (
									<form
										onSubmit={(e) => {
											e.preventDefault();
											if (selectedExistingParticipant) {
												if (participantType === 'eraisik') {
													onSubmitEraisik({} as EraisikFormData);
												} else {
													onSubmitEttevote({} as EttevoteFormData);
												}
											} else {
												if (participantType === 'eraisik') {
													eraisikForm.handleSubmit(onSubmitEraisik)();
												} else {
													ettevoteForm.handleSubmit(onSubmitEttevote)();
												}
											}
										}}
									>
										<div className=" flex flex-col  ">
											<h2 className="text-bermuda-500 text-2xl">
												Osavõtjate lisamine
											</h2>

											<div className="mt-4">
												<label
													htmlFor="existingParticipant"
													className="block text-sm font-medium text-gray-700 mb-2"
												>
													Vali olemasolev osavõtja:
												</label>
												<select
													id="existingParticipant"
													className="border w-64 border-gray-500 rounded-sm px-2 py-[2px]"
													value={selectedExistingParticipant?.id || ''}
													onChange={(e) => {
														const participantId = e.target.value;
														if (participantId === '') {
															setSelectedExistingParticipant(null);
														} else if (availableParticipants) {
															const allParticipants =
																getAllAvailableParticipants();
															const participant = allParticipants.find(
																(p) => p.id.toString() === participantId
															);
															if (participant) {
																setSelectedExistingParticipant(participant);
																setParticipantType(
																	participant.type === 'fyysiline'
																		? 'eraisik'
																		: 'ettevote'
																);
																eraisikForm.clearErrors();
																ettevoteForm.clearErrors();
															}
														}
													}}
												>
													<option value="">Vali osavõtja või lisa uus</option>
													{availableParticipantsLoading && (
														<option disabled>Laeb...</option>
													)}
													{availableParticipantsError && (
														<option disabled>Viga andmete laadimisel</option>
													)}
													{getAllAvailableParticipants().map((participant) => (
														<option
															key={participant.id + participant.type}
															value={participant.id}
														>
															{participant.type === 'fyysiline'
																? `${participant.eesnimi} ${participant.perekonnanimi}`
																: participant.nimi}{' '}
															(
															{participant.type === 'fyysiline'
																? 'Eraisik'
																: 'Ettevõte'}
															)
														</option>
													))}
												</select>
											</div>

											<div className="flex ml-34 mt-8 gap-16">
												<div className="flex gap-1 items-center">
													<input
														type="radio"
														name="participantType"
														value="eraisik"
														id="eraisik"
														checked={participantType === 'eraisik'}
														disabled={!!selectedExistingParticipant}
														onChange={(e) => {
															setParticipantType(
																e.target.value as 'eraisik' | 'ettevote'
															);
															eraisikForm.reset();
															ettevoteForm.reset();
														}}
													/>
													<label htmlFor="eraisik">Eraisik</label>
												</div>
												<div className="flex gap-1 items-center">
													<input
														type="radio"
														name="participantType"
														value="ettevote"
														id="ettevote"
														checked={participantType === 'ettevote'}
														disabled={!!selectedExistingParticipant}
														onChange={(e) => {
															setParticipantType(
																e.target.value as 'eraisik' | 'ettevote'
															);
															eraisikForm.reset();
															ettevoteForm.reset();
														}}
													/>
													<label htmlFor="ettevote">Ettevõte</label>
												</div>
											</div>
											<div className="flex mt-2 ">
												<div className="flex gap-4 w-34 flex-col">
													{participantType === 'eraisik' ? (
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
													{participantType === 'eraisik' ? (
														<>
															<div>
																<input
																	type="text"
																	className="border w-full border-gray-500 rounded-sm px-2 py-[2px] disabled:bg-gray-100 disabled:cursor-not-allowed"
																	disabled={!!selectedExistingParticipant}
																	{...eraisikForm.register('eesnimi')}
																/>
																{eraisikForm.formState.errors.eesnimi &&
																	!selectedExistingParticipant && (
																		<p className="text-red-500 text-xs mt-1">
																			{
																				eraisikForm.formState.errors.eesnimi
																					.message
																			}
																		</p>
																	)}
															</div>
															<div>
																<input
																	type="text"
																	className="border w-full border-gray-500 rounded-sm px-2 py-[2px] disabled:bg-gray-100 disabled:cursor-not-allowed"
																	disabled={!!selectedExistingParticipant}
																	{...eraisikForm.register('perekonnanimi')}
																/>
																{eraisikForm.formState.errors.perekonnanimi &&
																	!selectedExistingParticipant && (
																		<p className="text-red-500 text-xs mt-1">
																			{
																				eraisikForm.formState.errors
																					.perekonnanimi.message
																			}
																		</p>
																	)}
															</div>
															<div>
																<input
																	type="text"
																	className="border w-full border-gray-500 rounded-sm px-2 py-[2px] disabled:bg-gray-100 disabled:cursor-not-allowed"
																	disabled={!!selectedExistingParticipant}
																	{...eraisikForm.register('isikukood')}
																/>
																{eraisikForm.formState.errors.isikukood &&
																	!selectedExistingParticipant && (
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
															<div>
																<input
																	type="text"
																	className="border w-full border-gray-500 rounded-sm px-2 py-[2px] disabled:bg-gray-100 disabled:cursor-not-allowed"
																	disabled={!!selectedExistingParticipant}
																	{...ettevoteForm.register('nimi')}
																/>
																{ettevoteForm.formState.errors.nimi &&
																	!selectedExistingParticipant && (
																		<p className="text-red-500 text-xs mt-1">
																			{
																				ettevoteForm.formState.errors.nimi
																					.message
																			}
																		</p>
																	)}
															</div>
															<div>
																<input
																	type="text"
																	className="border w-full border-gray-500 rounded-sm px-2 py-[2px] disabled:bg-gray-100 disabled:cursor-not-allowed"
																	disabled={!!selectedExistingParticipant}
																	{...ettevoteForm.register('registrikood')}
																/>
																{ettevoteForm.formState.errors.registrikood &&
																	!selectedExistingParticipant && (
																		<p className="text-red-500 text-xs mt-1">
																			{
																				ettevoteForm.formState.errors
																					.registrikood.message
																			}
																		</p>
																	)}
															</div>
															<div>
																<input
																	type="text"
																	className="border w-full border-gray-500 rounded-sm px-2 py-[2px] disabled:bg-gray-100 disabled:cursor-not-allowed"
																	disabled={!!selectedExistingParticipant}
																	{...ettevoteForm.register('osavotjateArv')}
																/>
																{ettevoteForm.formState.errors.osavotjateArv &&
																	!selectedExistingParticipant && (
																		<p className="text-red-500 text-xs mt-1">
																			{
																				ettevoteForm.formState.errors
																					.osavotjateArv.message
																			}
																		</p>
																	)}
															</div>
														</>
													)}
													<div>
														<select
															className="border w-full border-gray-500 rounded-sm px-2 py-[2px] disabled:bg-gray-100 disabled:cursor-not-allowed"
															disabled={!!selectedExistingParticipant}
															{...(participantType === 'eraisik'
																? eraisikForm.register('maksmiseViis')
																: ettevoteForm.register('maksmiseViis'))}
														>
															<option value="">Vali maksmisviis</option>
															<option value="pangaülekanne">
																Pangaülekanne
															</option>
															<option value="sularaha">Sularaha</option>
														</select>
														{participantType === 'eraisik' &&
															eraisikForm.formState.errors.maksmiseViis &&
															!selectedExistingParticipant && (
																<p className="text-red-500 text-xs mt-1">
																	{
																		eraisikForm.formState.errors.maksmiseViis
																			.message
																	}
																</p>
															)}
														{participantType === 'ettevote' &&
															ettevoteForm.formState.errors.maksmiseViis &&
															!selectedExistingParticipant && (
																<p className="text-red-500 text-xs mt-1">
																	{
																		ettevoteForm.formState.errors.maksmiseViis
																			.message
																	}
																</p>
															)}
													</div>
													<div>
														<textarea
															className="border w-full border-gray-500 rounded-sm px-2 py-[2px] resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
															disabled={!!selectedExistingParticipant}
															{...(participantType === 'eraisik'
																? eraisikForm.register('lisainfo')
																: ettevoteForm.register('lisainfo'))}
														></textarea>
													</div>
												</div>
											</div>
											<div className="flex mt-8 gap-2">
												<button
													type="button"
													onClick={() => navigate('/')}
													className="bg-zinc-300 w-15 flex items-center justify-center hover:bg-zinc-400 text-zinc-800 duration-100 cursor-pointer py-[2px] text-sm  font-semibold rounded-xs "
												>
													Tagasi
												</button>
												<button
													type="submit"
													disabled={isSubmitting}
													className="bg-bermuda-500 hover:bg-bermuda-600 duration-100 cursor-pointer py-[2px] text-sm  text-white rounded-xs w-15 disabled:opacity-50"
												>
													{isSubmitting ? 'Salvestab...' : 'Salvesta'}
												</button>
											</div>
										</div>
									</form>
								)}
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
