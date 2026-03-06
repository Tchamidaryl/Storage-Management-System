"use client";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 text-slate-900">
            <h1 className="mb-4 text-6xl font-bold text-red">
                Something went wrong
            </h1>
            <p className="mb-6 text-xl font-semibold text-error">
                {error?.message ||
                    "An unexpected error occurred. Please try again or contact support if the issue persists."}
            </p>
            <div className="flex gap-4">
                <button
                    className="px-6 py-2 text-white transition rounded bg-slate-500 hover:bg-slate-600"
                    onClick={() => reset()}
                >
                    Try Again
                </button>
                <Link href="/">
                    <button className="px-6 py-2 text-white transition rounded bg-slate-900 hover:bg-slate-700">
                        Go to Dashboard
                    </button>
                </Link>
            </div>
        </div>
    );
}
