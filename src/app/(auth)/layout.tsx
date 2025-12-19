import Image from "next/image";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex min-h-screen">
            <section className="bg-brand p-10">
                <div className="">
                    <Image
                        src="/assets/icons/logo-full.svg"
                        alt="logo"
                        width={224}
                        height={82}
                        className="h-auto"
                        loading="lazy"
                    />

                    <div className="space-y-5 text-white">
                        <h1 className="h1">Manage your files the best way</h1>
                        <p className="body-1">
                            This is a place where you can store all your
                            documents.
                        </p>
                    </div>
                    <Image
                        src="/assets/images/files.png"
                        alt="Files"
                        width={342}
                        height={342}
                        className="transition-all hover:rotate-2 hover:scale-105"
                        loading="lazy"
                    />
                </div>
            </section>
            {children}
        </div>
    );
};

export default Layout;
