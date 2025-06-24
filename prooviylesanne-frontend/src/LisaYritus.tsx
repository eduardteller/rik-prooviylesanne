import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';
import { useCreateEvent } from './api/events';
import Footer from './components/Footer';
import Header from './components/Header';

const eventSchema = z.object({
	nimi: z.string().min(1, 'Ürituse nimi on kohustuslik'),
	aeg: z.string().min(1, 'Toimumisaeg on kohustuslik'),
	koht: z.string().min(1, 'Koht on kohustuslik'),
	lisainfo: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

const LisaYritus = () => {
	const createEventMutation = useCreateEvent();
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<EventFormData>({
		resolver: zodResolver(eventSchema),
		defaultValues: {
			nimi: '',
			aeg: '',
			koht: '',
			lisainfo: '',
		},
	});
	const onSubmit: SubmitHandler<EventFormData> = async (data) => {
		try {
			console.log('Submitting event data:', data);

			await createEventMutation.mutateAsync({
				nimi: data.nimi,
				aeg: data.aeg,
				koht: data.koht,
				lisainfo: data.lisainfo || '',
			});
			// Reset form after successful submission
			reset();
			navigate('/');
		} catch (error) {
			console.error('Error creating event:', error);
			alert('Viga ürituse lisamisel');
		}
	};

	const handleBack = () => {
		window.history.back();
	};
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
						</div>{' '}
						<div className="bg-white px-8 pt-8 pb-20  flex flex-col">
							<form onSubmit={handleSubmit(onSubmit)}>
								<div className=" flex flex-col gap-8 ml-64">
									<h2 className="text-bermuda-500 text-2xl">
										Ürituse lisamine
									</h2>
									<div className="flex gap-12">
										<div className="flex gap-4 flex-col">
											<p>Ürituse nimi:</p>
											<p>Toimumisaeg:</p>
											<p>Koht:</p>
											<p>Lisainfo:</p>
										</div>
										<div className=" flex flex-col gap-2 w-64">
											<div>
												<input
													{...register('nimi')}
													type="text"
													className="border w-full border-gray-500 rounded-sm px-2 py-[2px]"
												/>
												{errors.nimi && (
													<p className="text-red-500 text-xs mt-1">
														{errors.nimi.message}
													</p>
												)}
											</div>
											<div>
												<input
													{...register('aeg')}
													type="datetime-local"
													className="border w-full border-gray-500 rounded-sm px-2 py-[2px]"
												/>
												{errors.aeg && (
													<p className="text-red-500 text-xs mt-1">
														{errors.aeg.message}
													</p>
												)}
											</div>
											<div>
												<input
													{...register('koht')}
													type="text"
													className="border w-full border-gray-500 rounded-sm px-2 py-[2px]"
												/>
												{errors.koht && (
													<p className="text-red-500 text-xs mt-1">
														{errors.koht.message}
													</p>
												)}
											</div>
											<div>
												<textarea
													{...register('lisainfo')}
													className="border w-full border-gray-500 rounded-sm px-2 py-[2px] resize-none"
													name="lisainfo"
													id="lisainfo"
												></textarea>
												{errors.lisainfo && (
													<p className="text-red-500 text-xs mt-1">
														{errors.lisainfo.message}
													</p>
												)}
											</div>
										</div>
									</div>
									<div className="flex gap-2">
										<button
											type="button"
											onClick={handleBack}
											className="bg-zinc-300 w-15 flex items-center justify-center hover:bg-zinc-400 text-zinc-800 duration-100 cursor-pointer py-[2px] text-sm  font-semibold rounded-xs "
										>
											Tagasi
										</button>
										<button
											type="submit"
											disabled={createEventMutation.isPending}
											className="bg-bermuda-500 hover:bg-bermuda-600 duration-100 cursor-pointer py-[2px] text-sm  text-white rounded-xs w-15 disabled:opacity-50"
										>
											{createEventMutation.isPending ? 'Lisab...' : 'Lisa'}
										</button>
									</div>
								</div>
							</form>
						</div>
					</div>
					<Footer />
				</div>
			</main>
		</>
	);
};

export default LisaYritus;
