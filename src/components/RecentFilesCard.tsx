"use client";

import { Models } from "node-appwrite";
import CompactCard from "./CompactCard";

interface FileDocument extends Models.Document {
  name: string;
  size: number;
  type: string;
  extension: string;
  url: string;
    ownerId: string;
    bucketFileId: string;
    owner: {
        fullName: string;
    }
    users: string[];
}

interface RecentFilesCardProps {
    files: FileDocument[];
}

const RecentFilesCard = ({ files }: RecentFilesCardProps) => {
    return (
        <div className="dashboard-recent-files min-h-[400px] sm:min-h-[500px] lg:min-h-[650px]">
            <h3 className="mb-4 text-sm h5 sm:text-base">Recent Uploads</h3>
            <div className="space-y-2 sm:space-y-3">
                {files && files.length > 0 ? (
                    files.map((file) => (
                        <div key={file.$id} className="w-full overflow-hidden">
                            <CompactCard file={file} />
                        </div>
                    ))
                ) : (
                    <div className="h-40 flex-center">
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
