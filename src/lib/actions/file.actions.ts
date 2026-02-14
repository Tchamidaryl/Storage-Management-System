"use server";

import { createAdminClient } from "../appwrite";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "../appwrite/config";
import { ID, Models, Query } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.actions";

const handleError = (error: unknown, message: string) => {
    console.log(error, message);
    throw error;
};

export const uploadFile = async ({
    file,
    ownerId,
    accountId,
    path,
}: UploadFileProps) => {
    const { storage, databases } = await createAdminClient();

    try {
        const inputFile = InputFile.fromBuffer(file, file.name);

        const bucketFile = await storage.createFile(
            appwriteConfig.bucketId,
            ID.unique(),
            inputFile,
        );

        const fileDocument = {
            type: getFileType(bucketFile.name).type,
            name: bucketFile.name,
            url: constructFileUrl(bucketFile.$id),
            extension: getFileType(bucketFile.name).extension,
            size: bucketFile.sizeOriginal,
            owner: ownerId,
            accountId,
            users: [],
            bucketFileId: bucketFile.$id,
        };

        const newFile = await databases
            .createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.filesCollectionId,
                ID.unique(),
                fileDocument,
            )
            .catch(async (error: unknown) => {
                await storage.deleteFile(
                    appwriteConfig.bucketId,
                    bucketFile.$id,
                );
                handleError(error, "Failed to create file document");
            });

        revalidatePath(path);
        return parseStringify(newFile);
    } catch (error) {
        handleError(error, "Failed to upload file");
    }
};

const createQueries = (
    currentUser: Models.Document,
    types: string[],
    searchText: string,
    sort: string,
    limit?: number,
) => {
    const userEmail = (currentUser as Record<string, unknown>).email as string;

    const queries = [
        Query.or([
            Query.equal("owner", [currentUser.$id]),
            Query.contains("users", [userEmail]),
        ]),
    ];

    if (types.length > 0) queries.push(Query.equal("type", types));

    //TODO: Search, sort, limits ...
    if (searchText) queries.push(Query.contains("name", searchText));
    if (limit) queries.push(Query.limit(limit));

    if (sort) {
        const [sortBy, orderBy] = sort.split("-");
        queries.push(
            orderBy === "asc"
                ? Query.orderAsc(sortBy)
                : Query.orderDesc(sortBy),
        );
    }

    return queries;
};

export const getFiles = async ({
    types = [],
    searchText = "",
    sort = "$createdAt-desc",
    limit,
}: GetFilesProps) => {
    const { databases } = await createAdminClient();

    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) throw new Error("User not found");

        const queries = createQueries(
            currentUser,
            types,
            searchText,
            sort,
            limit,
        );

        const files = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            queries,
        );

        // Populate owner information for each file
        const filesWithOwner = await Promise.all(
            files.documents.map(async (file) => {
                try {
                    const ownerDoc = await databases.getDocument(
                        appwriteConfig.databaseId,
                        appwriteConfig.usersCollectionId,
                        file.owner,
                    );
                    return {
                        ...file,
                        owner: ownerDoc,
                    };
                } catch (error) {
                    console.log("Failed to fetch owner:", error);
                    // Return file with owner as an object with fallback values
                    return {
                        ...file,
                        owner: { fullName: "Unknown User" },
                    };
                }
            }),
        );

        return parseStringify({
            ...files,
            documents: filesWithOwner,
        });
    } catch (error) {
        handleError(error, "Failed to get files");
    }
};

export const renameFile = async ({
    fileId,
    name,
    extension,
    path,
}: RenameFileProps) => {
    const { databases } = await createAdminClient();

    try {
        const newName = `${name}.${extension}`;
        const updatedFile = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId,
            {
                name: newName,
            },
        );

        revalidatePath(path);
        return parseStringify(updatedFile);
    } catch (error) {
        handleError(error, "Failed to rename file");
    }
};

export const updateFileUsers = async ({
    fileId,
    emails,
    path,
}: UpdateFileUsersProps) => {
    const { databases } = await createAdminClient();

    try {
        const updatedFile = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId,
            {
                users: emails,
            },
        );

        revalidatePath(path);
        return parseStringify(updatedFile);
    } catch (error) {
        handleError(error, "Failed to share file");
    }
};

export const deleteFile = async ({
    fileId,
    bucketFileId,
    path,
}: DeleteFileProps) => {
    const { databases, storage } = await createAdminClient();

    try {
        const deletedFile = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId,
        );

        if (deletedFile) {
            await storage.deleteFile(appwriteConfig.bucketId, bucketFileId);
        }

        revalidatePath(path);
        return parseStringify({ status: "success" });
    } catch (error) {
        handleError(error, "Failed to delete file");
    }
};

export const getDashboardData = async () => {
    const { databases } = await createAdminClient();

    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) throw new Error("User not found");

        const userEmail = (currentUser as Record<string, unknown>)
            .email as string;

        const queries = [
            Query.or([
                Query.equal("owner", [currentUser.$id]),
                Query.contains("users", [userEmail]),
            ]),
        ];

        const files = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            queries,
        );

        // Populate owner information for each file
        const filesWithOwner = await Promise.all(
            files.documents.map(async (file) => {
                try {
                    const ownerDoc = await databases.getDocument(
                        appwriteConfig.databaseId,
                        appwriteConfig.usersCollectionId,
                        file.owner,
                    );
                    return {
                        ...file,
                        owner: ownerDoc,
                    };
                } catch (error) {
                    console.log("Failed to fetch owner:", error);
                    return {
                        ...file,
                        owner: { fullName: "Unknown User" },
                    };
                }
            }),
        );

        // Calculate storage by type
        const storageByType = {
            document: 0,
            image: 0,
            media: 0,
            other: 0,
        };

        let totalStorage = 0;

        filesWithOwner.forEach((file) => {
            const fileSize =
                ((file as Record<string, unknown>).size as number) || 0;
            totalStorage += fileSize;
            const fileType = (file as Record<string, unknown>).type as string;

            if (fileType === "document") {
                storageByType.document += fileSize;
            } else if (fileType === "image") {
                storageByType.image += fileSize;
            } else if (fileType === "video" || fileType === "audio") {
                storageByType.media += fileSize;
            } else {
                storageByType.other += fileSize;
            }
        });

        // Get 10 most recent files
        const recentQueries = [
            Query.or([
                Query.equal("owner", [currentUser.$id]),
                Query.contains("users", [userEmail]),
            ]),
            Query.orderDesc("$createdAt"),
            Query.limit(10),
        ];

        const recentFiles = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            recentQueries,
        );

        const recentFilesWithOwner = await Promise.all(
            recentFiles.documents.map(async (file) => {
                try {
                    const ownerDoc = await databases.getDocument(
                        appwriteConfig.databaseId,
                        appwriteConfig.usersCollectionId,
                        file.owner,
                    );
                    return {
                        ...file,
                        owner: ownerDoc,
                    };
                } catch (error) {
                    console.log("Failed to fetch owner:", error);
                    return {
                        ...file,
                        owner: { fullName: "Unknown User" },
                    };
                }
            }),
        );

        return parseStringify({
            totalStorage,
            storageByType,
            recentFiles: recentFilesWithOwner,
        });
    } catch (error) {
        handleError(error, "Failed to get dashboard data");
    }
};
