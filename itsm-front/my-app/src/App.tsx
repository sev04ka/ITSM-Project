import './App.css'
import { useEffect, type FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login/Login.tsx'
import NotFound from './pages/NotFound.tsx'
import ProtectedRoute from './components/security/ProtectedRoute.tsx';
import { useUserAuthStore } from './store/useUserAuthStore.ts';
import { EditCI } from './pages/CMDB/AddEditCI/EditCI.tsx';
import { AddCI } from './pages/CMDB/AddEditCI/AddCI.tsx';
import { CIList } from './pages/CMDB/CIList/CIList.tsx';
import { MainLayout } from './layouts/MainLayout/MainLayout.tsx';
import { FullPageLayout } from './layouts/FullPageLayout/FullPageLayout.tsx';
import { UserList } from './pages/Users/UserList/UserList.tsx';
import { AddUser } from './pages/Users/AddEditUser/AddUser.tsx';
import { OrganizationList } from './pages/Organizations/OrganizationList/OrganizationList.tsx';
import { AddOrganization } from './pages/Organizations/AddEditOrganization/AddOrganization.tsx';
import { EditOrganization } from './pages/Organizations/AddEditOrganization/EditOrganization.tsx';
import { EditUser } from './pages/Users/AddEditUser/EditUser.tsx';
import { TicketList } from './pages/Tickets/TicketList/TicketList.tsx';
import { TicketDetails } from './pages/Tickets/TicketDetails.tsx/TicketDetails.tsx';



const App: FC = () => {
	const { initializeAuth, isInitialized } = useUserAuthStore();

	useEffect(() => {
		if (isInitialized) return
		initializeAuth();
	}, []);

	if (!isInitialized) {
		return <div>Загрузка...</div>;
	}

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={
					<FullPageLayout>
						<Login />
					</FullPageLayout>
				} />
				<Route path="*" element={<NotFound />} />
				<Route path="/" element={
					<ProtectedRoute>
						<MainLayout />
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
					<Route path='users' element={
						<ProtectedRoute roles={['admin']}>
							<UserList />
						</ProtectedRoute>
					} />
					<Route path='users/add' element={
						<ProtectedRoute roles={['admin']}>
							<AddUser />
						</ProtectedRoute>
					} />
					<Route path='users/edit/:id' element={
						<ProtectedRoute roles={['admin']}>
							<EditUser />
						</ProtectedRoute>
					} />
					<Route path='organizations' element={
						<ProtectedRoute roles={['admin']}>
							<OrganizationList />
						</ProtectedRoute>
					} />
					<Route path='organizations/add' element={
						<ProtectedRoute roles={['admin']}>
							<AddOrganization />
						</ProtectedRoute>
					} />
					<Route path='organizations/edit/:id' element={
						<ProtectedRoute roles={['admin']}>
							<EditOrganization />
						</ProtectedRoute>
					} />
					<Route path='tickets' element={
						<ProtectedRoute roles={['admin']}>
							<TicketList />
						</ProtectedRoute>
					} />
					<Route path='tickets/:id' element={
						<ProtectedRoute roles={['admin']}>
							<TicketDetails />
						</ProtectedRoute>
					} />
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default App