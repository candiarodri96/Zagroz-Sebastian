import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

function MainLayout() {
    return (
        <div>
            <Navbar />
            <main className="flex flex-col items-center px-4">
                <Outlet />
            </main>
        </div>
    );
}

export default MainLayout;