"use client";

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from "recharts";
import { convertFileSize } from "@/lib/utils";

interface DashboardStorageChartProps {
    totalStorage: number;
    usedStorage: number;
}

const DashboardStorageChart = ({
    totalStorage,
    usedStorage,
}: DashboardStorageChartProps) => {
    const freeStorage = Math.max(0, totalStorage - usedStorage);

    const data = [
        { name: "Used", value: usedStorage, fill: "#FA7275" },
        { name: "Free", value: freeStorage, fill: "#A3B2C7" },
    ];

    return (
        <div className="rounded-[20px] bg-white p-4 sm:p-5 xl:p-7 h-full">
            <div className="flex flex-col gap-4">
                <h3 className="h5 text-sm sm:text-base">Storage Overview</h3>
                <div className="flex items-center justify-center w-full">
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.fill}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number | undefined) =>
                                    convertFileSize(value || 0)
                                }
                                contentStyle={{
                                    backgroundColor: "red",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                formatter={(value) => {
                                    const dataEntry = data.find(
                                        (d) => d.name === value,
                                    );
                                    return `${value}: ${convertFileSize(dataEntry?.value || 0)}`;
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="body-2 text-light-200 text-xs sm:text-sm">
                            Total Storage
                        </span>
                        <span className="h5 text-sm sm:text-base">
                            {convertFileSize(totalStorage)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="body-2 text-light-200 text-xs sm:text-sm">
                            Used
                        </span>
                        <span className="h5 text-brand text-sm sm:text-base">
                            {convertFileSize(usedStorage)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="body-2 text-light-200 text-xs sm:text-sm">
                            Available
                        </span>
                        <span className="h5 text-light-100 text-sm sm:text-base">
                            {convertFileSize(freeStorage)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStorageChart;
