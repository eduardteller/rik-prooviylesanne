import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import Avaleht from './Avaleht.tsx';
import './index.css';
import LisaYritus from './LisaYritus.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
	<QueryClientProvider client={queryClient}>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Avaleht />} />
				<Route path="/lisa-yritus" element={<LisaYritus />} />
			</Routes>
		</BrowserRouter>
	</QueryClientProvider>
);
