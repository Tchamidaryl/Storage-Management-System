"use client";

import { convertFileSize } from "@/lib/utils";
import { FileText, Image, Video, FileQuestion } from "lucide-react";

interface FileTypeCardProps {
    type: "document" | "image" | "media" | "other";
    size: number;
}

const FileTypeCard = ({ type, size }: FileTypeCardProps) => {
    const typeConfig = {
        document: {
            label: "Documents",
            icon: FileText,
            color: "text-brand",
            bgColor: "bg-red/10",
        },
        image: {
            label: "Images",
            icon: Image,
            color: "text-blue",
            bgColor: "bg-blue/10",
        },
        media: {
            label: "Media",
            icon: Video,
            color: "text-pink",
            bgColor: "bg-pink/10",
        },
        other: {
            label: "Others",
            icon: FileQuestion,
            color: "text-orange",
            bgColor: "bg-orange/10",
        },
    };

    const config = typeConfig[type];
    const IconComponent = config.icon;

    return (
        <div className="dashboard-summary-card h-full">
            <div
                className={`flex items-center justify-center ${config.bgColor} rounded-lg w-12 h-12`}
            >
                <IconComponent className={`${config.color} w-6 h-6`} />
            </div>
            <div className="mt-4">
                <p className="summary-type-title text-sm">{config.label}</p>
                <p className="summary-type-size text-base mt-1">
                    {convertFileSize(size)}
                </p>
            </div>
        </div>
    );
};

export default FileTypeCard;
