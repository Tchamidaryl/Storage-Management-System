import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-black bg-white">
            <h1 className="mb-4 text-6xl font-bold text-red">
                404 - NOT FOUND
            </h1>
            <p className="mb-6 text-xl text-black">
                Oops! The page you are looking for does not exist.
            </p>
            <Link href="/">
                <button className="px-6 py-2 text-white transition rounded bg-red hover:bg-black">
                    Go to Dashboard
                </button>
            </Link>
        </div>
    );
}
