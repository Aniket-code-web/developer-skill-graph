import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Developers from "./pages/Developers";
import DeveloperDetails from "./pages/DeveloperDetails";
import SkillGraph from "./pages/SkillGraph";
import Skills from "./pages/Skills";
import SkillDetails from "./pages/SkillDetails";


function AppLayout({ children }) {

    return (
        <div className="min-h-screen bg-slate-950">

            <Sidebar />

            <div className="lg:pl-64">

                <Navbar />

                <main className="px-5 py-6 sm:px-6 lg:px-8">
                    {children}
                </main>

            </div>

        </div>
    );
}


function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* Dashboard */}
                <Route
                    path="/"
                    element={
                        <AppLayout>
                            <Dashboard />
                        </AppLayout>
                    }
                />

                {/* Developers */}
                <Route
                    path="/developers"
                    element={
                        <AppLayout>
                            <Developers />
                        </AppLayout>
                    }
                />

                {/* Developer Profile */}
                <Route
                    path="/developers/:developerId"
                    element={
                        <AppLayout>
                            <DeveloperDetails />
                        </AppLayout>
                    }
                />

                {/* Skill Graph */}
                <Route
                    path="/graph"
                    element={
                        <AppLayout>
                            <SkillGraph />
                        </AppLayout>
                    }
                />

                {/* Fallback */}
                <Route
                    path="*"
                    element={
                        <AppLayout>
                            <Dashboard />
                        </AppLayout>
                    }
                />

                <Route
                    path="/skills"
                    element={
                        <AppLayout>
                            <Skills />
                        </AppLayout>
                    }
                />

                <Route
                    path="/skills/:skillName"
                    element={
                        <AppLayout>
                            <SkillDetails />
                        </AppLayout>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}


export default App;