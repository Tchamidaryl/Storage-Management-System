"use client";

import Link from "next/link";
import { Models } from "node-appwrite";
import React from "react";
import Thumbnail from "./Thumbnail";
import { convertFileSize } from "@/lib/utils";
import FormattedDateTime from "./FormattedDateTime";
import ActionsDropdown from "./ActionsDropdown";

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

const CompactCard = ({ file }: { file: FileDocument }) => {
    const fileData = file as Record<string, unknown>;

    return (
        <Link
            href={fileData.url as string}
            target="_blank"
            className="file-card-compact"
        >
            <div className="flex items-start justify-between gap-2">
                <Thumbnail
                    type={fileData.type as string}
                    extension={fileData.extension as string}
                    url={fileData.url as string}
                    className="!size-12 sm:!size-14"
                    imageClassName="!size-6 sm:!size-7"
                />

                <div className="flex flex-col items-end justify-start flex-1 min-w-0 gap-1">
                    <ActionsDropdown file={file} />
                    <p className="text-xs body-2 sm:text-sm">
                        {convertFileSize((fileData.size as number) || 0)}
                    </p>
                </div>
            </div>

            <div className="file-card-details">
                <p className="text-xs subtitle-2 line-clamp-1 sm:text-sm">
                    {fileData.name as string}
                </p>
                <FormattedDateTime
                    date={file.$createdAt}
                    className="text-xs body-2 text-light-100"
                />
                <p className="text-xs caption line-clamp-1 text-light-200">
                    By:{" "}
                    {((fileData.owner as Record<string, unknown>)
                        ?.fullName as string) || "Unknown"}
                </p>
            </div>
        </Link>
    );
};

export default CompactCard;
