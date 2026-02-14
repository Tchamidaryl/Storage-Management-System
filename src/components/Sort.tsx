"use client";
import React from "react";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import { usePathname, useRouter } from "next/navigation";
import { sortTypes } from "@/constants";

const Sort = () => {
    const router = useRouter();
    const path = usePathname();

    const handleSort = (value: string) => {
        router.push(`${path}?sort=${value}`);
    };

    return (
        <Select onValueChange={handleSort} defaultValue={sortTypes[0].value}>
            <SelectTrigger className="sort-select">
                <SelectValue placeholder={sortTypes[0].value} />
            </SelectTrigger>
            <SelectContent className="sort-select-content">
                <SelectGroup>
                    {sortTypes.map((sort) => {
                        const { value, label } = sort;
                        return (
                            <SelectItem key={label} value={value}>
                                {label}
                            </SelectItem>
                        );
                    })}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default Sort;
