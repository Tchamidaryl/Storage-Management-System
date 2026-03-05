import { Models } from "node-appwrite";
import React from "react";
import Thumbnail from "./Thumbnail";
import FormattedDateTime from "./FormattedDateTime";
import { convertFileSize, formatDateTime } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";
import { Plus } from "lucide-react";

interface FileDocument extends Models.Document {
    name: string;
    size: number;
    type: string;
    extension: string;
    url: string;
    owner: {
        fullName: string;
    };
    users: string[];
}

const ImageThumbnail = ({ file }: { file: FileDocument }) => (
    <div className="file-details-thumbnail">
        <Thumbnail type={file.type} extension={file.extension} url={file.url} />
        <div className="flex flex-col max-w-[250px]">
            <p className="mb-1 truncate subtitle-2">{file.name}</p>
            <FormattedDateTime date={file.$createdAt} className="caption" />
        </div>
    </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex">
        <p className="text-left file-details-label">{label}</p>
        <p className="text-left file-details-value">{value}</p>
    </div>
);

export const FileDetails = ({ file }: { file: FileDocument }) => {
    return (
        <>
            <ImageThumbnail file={file} />
            <div className="px-2 pt-2 space-y-4">
                <DetailRow label="Format:" value={file.extension} />
                <DetailRow label="Size:" value={convertFileSize(file.size)} />
                <DetailRow label="Owner:" value={file.owner.fullName} />
                <DetailRow
                    label="Last edit:"
                    value={formatDateTime(file.$updatedAt)}
                />
            </div>
        </>
    );
};

interface Props {
    file: FileDocument;
    emails: string[];
    onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
    onRemove: (email: string) => void;
}

export const ShareInput = ({
    file,
    emails,
    onInputChange,
    onRemove,
}: Props) => {
    const [inputValue, setInputValue] = React.useState("");

    const handleAddEmail = () => {
        const email = inputValue.trim();
        if (email && !emails.includes(email)) {
            onInputChange([...emails, email]);
            setInputValue("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddEmail();
        }
    };

    return (
        <>
            <ImageThumbnail file={file} />

            <div className="share-wrapper">
                <p className="pl-1 subtitle-2 text-light-100">
                    Share file with other users
                </p>
                <div className="flex items-center gap-2">
                    <Input
                        type="email"
                        placeholder="Enter email address"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="share-input-field"
                    />
                    <Button
                        onClick={handleAddEmail}
                        className="bg-transparent border-none hover:bg-transparent text-slate-950"
                    >
                        <Plus className="" />
                    </Button>
                </div>
                <div className="pt-4">
                    <div className="flex justify-between">
                        <p className="subtitle-2 text-light-100">Share with</p>
                        <p className="subtitle-2 text-light-200">
                            {emails.length} users
                        </p>
                    </div>
                    <ul className="pt-2">
                        {emails.map((email: string) => (
                            <li
                                key={email}
                                className="flex items-center justify-between gap-2"
                            >
                                <p className="subtitle-2">{email}</p>
                                <Button
                                    onClick={() => onRemove(email)}
                                    className="share-remove-user"
                                >
                                    <Image
                                        src="/assets/icons/remove.svg"
                                        alt="Remove"
                                        width={24}
                                        height={24}
                                        className="remove-icon"
                                    />
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};
