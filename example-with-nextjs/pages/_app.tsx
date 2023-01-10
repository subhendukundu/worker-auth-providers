import '../styles/globals.css'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <main className="text-center text-gray-700 dark:text-gray-200 flex flex-col h-screen dark">
            <div className="px-4 py-10 flex-grow dark:bg-gray-800">
                <Component {...pageProps} />
            </div>
        </main>
    )
}

export default MyApp