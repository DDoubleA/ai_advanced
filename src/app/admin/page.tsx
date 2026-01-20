import AdminDashboard from './AdminDashboard';
import LoginPage from './LoginPage';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

// Helper to get categories (duplicated from actions.ts for now, or we should export it)
// Best practice: Move data access to a shared lib. For now, reading file here.
const getCategoriesData = () => {
    try {
        const filePath = path.join(process.cwd(), 'src/data/db.json');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (error) {
        return [];
    }
};

export default async function AdminPage() {
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.get('admin_auth')?.value === 'true';

    if (!isAuthenticated) {
        return <LoginPage />;
    }

    const categories = getCategoriesData();
    return <AdminDashboard categories={categories} />;
}
