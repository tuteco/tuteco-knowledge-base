import Sidebar from "./components/Sidebar.tsx";
import Main from "./components/Main.tsx";


function App() {
    return (
        <div className="flex">
            <Sidebar/>
            <div className="h-screen flex-1 border-t-4 border-t-primary-200 relative flex flex-col">
                <nav id="header-nav" className="top-0 h-20 py-4 pl-6 bg-neutral-800"></nav>
                <Main/>
            </div>
        </div>
    );
}

export default App;
