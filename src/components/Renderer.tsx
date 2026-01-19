"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const Renderer = () => {
    const path = usePathname();
    const [message, setMessage] = useState("");

    const tester = () => {
        if (path.includes("documents")) {
            setMessage("This is the documents section.");
        } else if (path.includes("media")) {
            setMessage("This is the media section.");
        } else if (path.includes("images")) {
            setMessage("This is the images section.");
        } else if (path.includes("videos")) {
            setMessage("This is the videos section.");
        } else {
            setMessage("This is the others section.");
        }
    };

    useEffect(() => {
        tester();
    }, []);

    return <div>{message}</div>;
};

export default Renderer;
