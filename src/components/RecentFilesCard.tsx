"use client";

import { Models } from "node-appwrite";
import CompactCard from "./CompactCard";

interface RecentFilesCardProps {
    files: Models.Document[];
}

const RecentFilesCard = ({ files }: RecentFilesCardProps) => {
    return (
        <div className="dashboard-recent-files min-h-[400px] sm:min-h-[500px] lg:min-h-[650px]">
            <h3 className="h5 mb-4 text-sm sm:text-base">Recent Uploads</h3>
            <div className="space-y-2 sm:space-y-3">
                {files && files.length > 0 ? (
                    files.map((file) => (
                        <div key={file.$id} className="w-full overflow-hidden">
                            <CompactCard file={file} />
                        </div>
                    ))
                ) : (
                    <div className="flex-center h-40">
                        <p className="body-2 text-light-200">
                            No files uploaded yet
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentFilesCard;
