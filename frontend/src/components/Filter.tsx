"use client";

import { createPortal } from "react-dom";
import { CheckIcon, MixerHorizontalIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery, useOnClickOutside } from "usehooks-ts";
import { useSearchParams } from "react-router";
import { isEqual } from "lodash";

function FilterTitle({ text }: { text: string }) {
    return (
        <div className="flex flex-col text-white uppercase text-sm mb-4">
            <p className="mb-2 text-zinc-300">{text}</p>
            <hr className="border-zinc-600" />
        </div>
    );
}

function FilterItem({
    label,
    onClick,
    isActive,
}: {
    label: string;
    onClick: () => void;
    isActive: boolean;
}) {
    return (
        <button
            className="flex justify-between cursor-pointer text-start text-white"
            onClick={onClick}
        >
            <span>{label}</span>
            {isActive && <CheckIcon />}
        </button>
    );
}

function FilterOverlay({ children }: { children: React.ReactNode }) {
    const matches = useMediaQuery("(max-width: 768px)");
    const targetRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!matches) {
            return;
        }

        targetRef.current = document.body;

        targetRef.current.style.overflow = "hidden";

        return () => {
            targetRef.current!.style.overflow = "auto";
        };
    }, [matches]);

    if (!matches) {
        return children;
    }

    return createPortal(
        <div className="fixed min-h-screen min-w-screen backdrop-blur-xl bg-black/60 top-1/2 -right-1/2 -translate-1/2 p-8 place-content-center">
            {children}
        </div>,
        document.body
    );
}

function FilterDrawer({
    isFilterOpened,
    closeFilter,
    setTimeFormat,
    setSpeed,
}: {
    isFilterOpened: boolean;
    closeFilter: () => void;
    setTimeFormat: (timeFormat: TimeFormat) => void;
    setSpeed: (speed: Speed) => void;
}) {
    const ref = useRef(null);
    const matches = useMediaQuery("(max-width: 768px)");

    const [searchParams, setSearchParams] = useSearchParams();

    const timeFormat: Array<{ label: string; filter: TimeFormat }> = [
        { label: "In days", filter: "dd" },
        { label: "In hours", filter: "hh" },
        { label: "In minutes", filter: "mm" },
    ];

    const speed: Array<{ label: string; speed: Speed }> = [
        { label: "0.25", speed: ".25" },
        { label: "0.5", speed: ".5" },
        { label: "0.75", speed: ".75" },
        { label: "Normal", speed: "1" },
        { label: "1.25", speed: "1.25" },
        { label: "1.5", speed: "1.5" },
        { label: "1.75", speed: "1.75" },
        { label: "2", speed: "2" },
    ];

    useOnClickOutside<HTMLElement>(
        ref as unknown as React.RefObject<HTMLElement>,
        closeFilter
    );

    if (!isFilterOpened) {
        return null;
    }

    return (
        <FilterOverlay>
            <div
                ref={matches ? ref : null}
                className="z-50 md:absolute md:right-0 shadow-2xl flex flex-col gap-6 mt-2 bg-zinc-900 px-3.5 py-4 rounded-lg w-full md:min-w-80"
            >
                <div className="flex flex-col gap-2">
                    <FilterTitle text="Time Format" />
                    {timeFormat.map((item) => (
                        <FilterItem
                            key={item.label}
                            label={item.label}
                            onClick={() => {
                                setTimeFormat(item.filter);
                                setSearchParams((prevParams) => {
                                    const newParams = new URLSearchParams(
                                        prevParams
                                    );
                                    newParams.set("timeFormat", item.filter);
                                    return newParams;
                                });

                                closeFilter();
                            }}
                            isActive={isEqual(
                                searchParams.get("timeFormat"),
                                item.filter
                            )}
                        />
                    ))}
                </div>
                <div className="flex flex-col gap-2">
                    <FilterTitle text="Speed" />
                    {speed.map((item) => (
                        <FilterItem
                            key={item.label}
                            label={item.label}
                            onClick={() => {
                                setSpeed(item.speed);
                                setSearchParams((prevParams) => {
                                    prevParams.set("speed", item.speed);
                                    return prevParams;
                                });

                                closeFilter();
                            }}
                            isActive={isEqual(
                                searchParams.get("speed"),
                                item.speed
                            )}
                        />
                    ))}
                </div>
            </div>
        </FilterOverlay>
    );
}

export default function Filter({
    setTimeFormat,
    setSpeed,
}: {
    setTimeFormat: (timeFormat: TimeFormat) => void;
    setSpeed: (speed: Speed) => void;
}) {
    const [isFilterOpened, setIsFilterOpened] = useState(false);
    const ref = useRef(null);
    const matches = useMediaQuery("(max-width: 768px)");

    const handleCloseFilter = () => {
        setIsFilterOpened(false);
    };

    useOnClickOutside<HTMLElement>(
        ref as unknown as React.RefObject<HTMLElement>,
        handleCloseFilter
    );

    return (
        <div id="filter" ref={matches ? null : ref} className="md:relative">
            <button
                className="flex gap-[6px] items-center text-zinc-50 cursor-pointer"
                onClick={() => setIsFilterOpened((prev) => !prev)}
            >
                <span>Filters</span> <MixerHorizontalIcon />
            </button>
            <FilterDrawer
                isFilterOpened={isFilterOpened}
                closeFilter={handleCloseFilter}
                setTimeFormat={setTimeFormat}
                setSpeed={setSpeed}
            />
        </div>
    );
}
