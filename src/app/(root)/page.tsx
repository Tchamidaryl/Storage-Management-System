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

    // Calculate 2GB limit (2 * 1024 * 1024 * 1024 bytes)
    const STORAGE_LIMIT = 2 * 1024 * 1024 * 1024;

    return (
        <div className="pb-10 space-y-6">
            <div>
                <h1 className="h1">Dashboard</h1>
                <p className="mt-2 body-2 text-light-200">
                    Welcome back! Here&apos;s your storage overview
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 xl:gap-8">
                {/* Left Section - Storage Chart and File Type Cards */}
                <div className="-space-y-1 lg:col-span-2">
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
