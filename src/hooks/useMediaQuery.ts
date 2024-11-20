import {useEffect, useState} from "react";

export default function useMediaQuery(query: string) {
    const [matches, setMatches] = useState<boolean>();

    useEffect(() => {
        const matchQueryList = window.matchMedia(query);

        function handleChange(e: MediaQueryListEvent) {
            setMatches(e.matches);
        }

        if (matches === undefined) {
            setMatches(matchQueryList.matches);
        }

        matchQueryList.addEventListener("change", handleChange);

        return () => {
            matchQueryList.removeEventListener("change", handleChange);
        };
    }, [query, matches]);

    return matches;
}