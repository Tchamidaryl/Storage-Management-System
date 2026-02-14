"use client";

import Link from "next/link";
import { Models } from "node-appwrite";
import React from "react";
import Thumbnail from "./Thumbnail";
import { convertFileSize } from "@/lib/utils";
import FormattedDateTime from "./FormattedDateTime";
import ActionsDropdown from "./ActionsDropdown";

const CompactCard = ({ file }: { file: Models.Document }) => {
    const fileData = file as Record<string, unknown>;

    return (
        <Link
            href={fileData.url as string}
            target="_blank"
            className="file-card-compact"
        >
            <div className="flex justify-between items-start gap-2">
                <Thumbnail
                    type={fileData.type as string}
                    extension={fileData.extension as string}
                    url={fileData.url as string}
                    className="!size-12 sm:!size-14"
                    imageClassName="!size-6 sm:!size-7"
                />

                <div className="flex flex-col items-end justify-start gap-1 flex-1 min-w-0">
                    <ActionsDropdown file={file} />
                    <p className="body-2 text-xs sm:text-sm">
                        {convertFileSize((fileData.size as number) || 0)}
                    </p>
                </div>
            </div>

            <div className="file-card-details">
                <p className="subtitle-2 line-clamp-1 text-xs sm:text-sm">
                    {fileData.name as string}
                </p>
                <FormattedDateTime
                    date={file.$createdAt}
                    className="body-2 text-light-100 text-xs"
                />
                <p className="caption line-clamp-1 text-light-200 text-xs">
                    By:{" "}
                    {((fileData.owner as Record<string, unknown>)
                        ?.fullName as string) || "Unknown"}
                </p>
            </div>
        </Link>
    );
};

export default CompactCard;
