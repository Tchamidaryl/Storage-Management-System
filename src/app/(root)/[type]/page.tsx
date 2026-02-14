// import Renderer from "@/components/Renderer";
import Card from "@/components/Card";
import Sort from "@/components/Sort";
import { getFiles } from "@/lib/actions/file.actions";
import { convertFileSize, getFileTypesParams } from "@/lib/utils";
import { Models } from "node-appwrite";
import React from "react";

interface FileDocument extends Models.Document {
  size: number
  type: string
  extension: string
  url: string
}

const page = async ({ params, searchParams }: SearchParamProps) => {
    const type = ((await params)?.type as string) || "";
    const searchText = ((await searchParams)?.query as string) || "";
    const sort = ((await searchParams)?.sort as string) || "";

    const types = getFileTypesParams(type) as FileType[];

    const files = await getFiles({ types, searchText, sort });
    
    const totalSize = files.documents.reduce((sum: number, file: FileDocument) => {
        return sum + (file.size || 0)
    }, 0)
    return (
        <div className="page-container">
            <section className="w-full">
                <h1 className="capitalize h1">{type}</h1>

                <div className="total-size-section">
                    <p className="body-1">
                        Total: <span className="h5">{convertFileSize(totalSize)}</span>
                    </p>

                    <div className="sort-container">
                        <p className="hidden body-1 sm:block text-light-200">
                            Sort By:
                        </p>

                        <Sort />
                    </div>
                </div>
            </section>

            {/* Render the files */}
            {files.total > 0 ? (
                <section className="file-list">
                    {files.documents.map((file: Models.Document) => (
                        <Card key={file.$id} file={file} />
                    ))}
                </section>
            ) : (
                    <p className="empty-list">No files Uploaded</p>
            )}
        </div>
    );
};

export default page;
