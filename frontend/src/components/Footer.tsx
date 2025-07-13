/**
 * Rakenduse jaluse komponent
 *
 * Näitab rakenduse allosas kontaktteavet ja ettevõtte infot.
 * Sisaldab nelja veergu: kaks üldist infoveergu ja kaks kontaktiveergu
 * (peakontor Tallinnas ja harukontor Võrus).
 */
const Footer = () => {
	return (
		<div className="mt-4 w-full">
			<div className="w-full h-full bg-[#373737] text-white flex px-12 py-8 ">
				{/* Esimene infoveerg */}
				<div className="flex flex-col opacity-75">
					<h1 className="text-3xl">Curabitur</h1>
					<p className="mt-4  ">Emauris</p>
					<p className=" ">Kfringilla</p>
					<p className=" ">Oin magna sem</p>
					<p className=" ">Kelementum</p>
				</div>

				{/* Teine infoveerg */}
				<div className="flex flex-col opacity-75 ml-32">
					<h1 className="text-3xl ">Fusce</h1>
					<p className="mt-4  ">Econsectetur</p>
					<p className=" ">Ksollicitudin</p>
					<p className=" ">Omvulputate</p>
					<p className=" ">Nunc fringilla tellu</p>
				</div>

				{/* Peakontori kontaktandmed */}
				<div className="flex flex-col ml-32">
					<h1 className="text-3xl opacity-75">Kontakt</h1>
					<p className="mt-4  font-semibold opacity-85">Peakontor: Tallinnas</p>
					<p className=" opacity-75">Väike- Ameerika 1, 11415 Tallinn</p>
					<p className=" opacity-75">Telefon: 605 4450</p>
					<p className=" opacity-75">Faks: 605 3186</p>
				</div>

				{/* Harukontori kontaktandmed */}
				<div className="flex flex-col ml-12">
					<h1 className="text-3xl opacity-0">Curabitur</h1>
					<p className="mt-4 font-semibold opacity-85">Harukontor: Võrus</p>
					<p className=" opacity-75">Oja tn 7 (külastusaadress)</p>
					<p className=" opacity-75">Telefon: 605 3330</p>
					<p className=" opacity-75">Faks: 605 3155</p>
				</div>
			</div>
		</div>
	);
};

export default Footer;
