import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import Avaleht from './Avaleht.tsx';
import './index.css';
import LisaYritus from './LisaYritus.tsx';
import Osavotjad from './Osavotjad.tsx';
import OsavotjadDetail from './OsavotjadDetail.tsx';

/**
 * Rakenduse peamine sisendpunkt
 *
 * Seadistab rakenduse alustalade:
 * - React Query kliendi serveripäringute haldamiseks
 * - Marsruutimise süsteemi erinevate lehekülgede vahel liikumiseks
 * - Kõikide lehekülgede komponentide seostamise URL-idega
 */

// Loome React Query kliendi serveri andmete puhverdamiseks ja haldamiseks
const queryClient = new QueryClient();

// Käivitame React rakenduse ja renderdame selle HTML-i root elemendisse
createRoot(document.getElementById('root')!).render(
	<QueryClientProvider client={queryClient}>
		<BrowserRouter>
			{/* Määrame kõik rakenduse marsruudid ja nendega seotud komponendid */}
			<Routes>
				<Route path="/" element={<Avaleht />} />
				<Route path="/lisa-yritus" element={<LisaYritus />} />
				<Route path="/osavotjad/:id" element={<Osavotjad />} />
				<Route path="/osavotjad/:type/:id" element={<OsavotjadDetail />} />
			</Routes>
		</BrowserRouter>
	</QueryClientProvider>
);
