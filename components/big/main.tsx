import Footer from './footer';
import Navbar from './nav';

export default async function Main({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="min-h-screen flex flex-col justify-between min-w-0 px-2 md:px-0 max-w-7xl md:mx-auto">
            <div className="space-y-2 grow flex flex-col">
                <Navbar />
                {children}
            </div>
            <Footer />
        </div>
    )
}