import { useLocation, useNavigate } from 'react-router';

/**
 * Rakenduse päise komponent
 *
 * Näitab rakenduse navigatsiooni ja logot. Sisaldab:
 * - Peamine logo vasakul
 * - Navigatsiooniteugid (Avaleht, Ürituse lisamine)
 * - Sümboli pilt paremal
 * - Aktiivse lehe esiletõstmine
 */
const Header = () => {
	const navigate = useNavigate();
	const location = useLocation();

	// Kontrollib, kas antud tee on praegu aktiivne
	const isActive = (path: string) => location.pathname === path;

	return (
		<div className="bg-white h-20 flex justify-between">
			{/* Vasakpoolne osa: logo ja navigatsiooniteugid */}
			<div className="flex flex-row items-center h-full">
				<img src="/logo.svg" className="px-6" alt="" />

				{/* Avalehe nupp - aktiivse oleku märkimisega */}
				<button
					onClick={() => navigate('/')}
					className={`h-full hover:cursor-pointer px-4 ml-24 font-bold uppercase text-xs duration-100 ${
						isActive('/')
							? 'text-white bg-bermuda-500'
							: 'text-gray-900 hover:text-white hover:bg-[#373737]'
					}`}
				>
					Avaleht
				</button>

				{/* Ürituse lisamise nupp - aktiivse oleku märkimisega */}
				<button
					onClick={() => navigate('/lisa-yritus')}
					className={`h-full px-4 hover:cursor-pointer font-bold uppercase text-xs duration-100 ${
						isActive('/lisa-yritus')
							? 'text-white bg-bermuda-500'
							: 'text-gray-900 hover:text-white hover:bg-[#373737]'
					}`}
				>
					Ürituse lisamine
				</button>
			</div>

			{/* Parempoolne osa: sümboli pilt */}
			<img src="/symbol.svg" alt="" className="pr-8 py-3" />
		</div>
	);
};

export default Header;
