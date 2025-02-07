import useLayoutStatus from "../../../Hooks/useLayoutStatus";
import Sidebar from "../../../layout/Sidebar";


const About = () => {
    const { current } = useLayoutStatus();
console.log(current)
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-100 text-gray-800 dark:text-slate-400">
            <div className="flex flex-1 items-center overflow-hidden">
                <Sidebar />
                <main className={`dark:bg-white rounded-l-4xl ${current === 'lg' || current=== "2xl" ? 'h-[100vh]' : 'h-[100vh]'} overflow-auto flex-1`}>
                    <iframe
                        src="https://dev-portfolio-in.vercel.app"
                        className="w-full h-full border-none rounded-lg"
                        title="Portfolio"
                    ></iframe>
                </main>

            </div>
        </div>
    );
};

export default About;
