import './App.css'
import { useEffect, type FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashBoard from './pages/DashBoard.tsx'
import Login from './pages/Login.tsx'
import NotFound from './pages/NotFound.tsx'
import ProtectedRoute from './components/security/ProtectedRoute.tsx';
import { useUserAuthStore } from './store/useUserAuthStore.ts';
import { MyTickets } from './components/tickets/myTickets/MyTickets.tsx';
import { CreateTicket } from './components/tickets/createTicket/CreateTicket.tsx';
import { TicketDetails } from './pages/TicketDetails.tsx';
import { EditCI } from './pages/CMDB/AddEditCI/EditCI.tsx';
import { AddCI } from './pages/CMDB/AddEditCI/AddCI.tsx';
import { CIList } from './pages/CMDB/CIList/CIList.tsx';
import { TicketList } from './pages/Tickets/TicketList/TicketList.tsx';


const App: FC = () => {
	const { initializeAuth, isInitialized } = useUserAuthStore();

	useEffect(() => {
		initializeAuth();
	}, []);

	if (!isInitialized) {
		return <div>Загрузка...</div>;
	}
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="*" element={<NotFound />} />
				<Route path="/" element={
					<ProtectedRoute>
						<DashBoard />
					</ProtectedRoute>
				}>
					<Route path='conf-items-management' element={
						<ProtectedRoute roles={['admin']}>
							<CIList />
						</ProtectedRoute>
					} />
					<Route path='conf-items-management/add' element={
						<ProtectedRoute roles={['admin']}>
							<AddCI />
						</ProtectedRoute>
					} />
					<Route path='conf-items-management/edit/:id' element={
						<ProtectedRoute roles={['admin']}>
							<EditCI />
						</ProtectedRoute>
					} />
					{/* <Route path='my-conf-items' element={
						<ProtectedRoute>
							<ConfigurationItemList />
						</ProtectedRoute>
					} /> */}
					<Route path='tickets' element={
						<ProtectedRoute>
							<TicketList />
						</ProtectedRoute>
					} />
					<Route path='tickets/create' element={
						<ProtectedRoute>
							<CreateTicket />
						</ProtectedRoute>
					} />
					<Route path='tickets/:id' element={
						<ProtectedRoute>
							<TicketDetails />
						</ProtectedRoute>
					} />
					<Route path='requests' element={
						<ProtectedRoute>
							<MyTickets />
						</ProtectedRoute>
					} />
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default App