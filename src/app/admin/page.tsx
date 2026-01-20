import AdminDashboard from './AdminDashboard';
import LoginPage from './LoginPage';
import { cookies } from 'next/headers';
import { formatCategories } from '@/data/questions';

export default async function AdminPage() {
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.get('admin_auth')?.value === 'true';

    if (!isAuthenticated) {
        return <LoginPage />;
    }

    const categories = await formatCategories();
    return <AdminDashboard categories={categories} />;
}
