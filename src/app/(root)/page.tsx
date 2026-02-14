import React from "react";
import { getDashboardData } from "@/lib/actions/file.actions";
import DashboardStorageChart from "@/components/DashboardStorageChart";
import FileTypeCard from "@/components/FileTypeCard";
import RecentFilesCard from "@/components/RecentFilesCard";

const dashboard = async () => {
    const {
        totalStorage = 0,
        storageByType = {},
        recentFiles = [],
    } = (await getDashboardData()) || {};

    // Calculate 5GB limit (5 * 1024 * 1024 * 1024 bytes)
    const STORAGE_LIMIT = 5 * 1024 * 1024 * 1024;

    return (
        <div className="space-y-6 pb-10">
            <div>
                <h1 className="h1">Dashboard</h1>
                <p className="body-2 text-light-200 mt-2">
                    Welcome back! Here&apos;s your storage overview
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 xl:gap-8">
                {/* Left Section - Storage Chart and File Type Cards */}
                <div className="lg:col-span-2 -space-y-1">
                    {/* Storage Chart */}
                    <div className="">
                        <DashboardStorageChart
                            totalStorage={STORAGE_LIMIT}
                            usedStorage={totalStorage}
                        />
                    </div>

                    {/* File Type Cards */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
                        <FileTypeCard
                            type="document"
                            size={storageByType.document || 0}
                        />
                        <FileTypeCard
                            type="image"
                            size={storageByType.image || 0}
                        />
                        <FileTypeCard
                            type="media"
                            size={storageByType.media || 0}
                        />
                        <FileTypeCard
                            type="other"
                            size={storageByType.other || 0}
                        />
                    </div>
                </div>

                {/* Right Section - Recent Files */}
                <div className="lg:col-span-1">
                    <RecentFilesCard files={recentFiles} />
                </div>
            </div>
        </div>
    );
};

export default dashboard;
