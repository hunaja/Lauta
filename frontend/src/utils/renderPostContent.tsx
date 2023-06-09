/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import PostLink from "../components/PostLink";

export const renderPostLinks = (text: string) => {
    text = text.replaceAll("\r\n", "\n");
    const newText = text.slice(-1) === "\n" ? text : `${text}\n`;
    const substrings = [
        ...newText.matchAll(/>>([0-9]+)|.+?(?=>>([0-9]+)|(\n|\r)|$)+|\n|\r/g),
    ];
    return substrings.map((matchArray) => {
        const [match, postNumberStr] = matchArray;

        const postNumber = Number(postNumberStr);

        if (postNumber) {
            return <PostLink postNumber={postNumber} />;
        }

        if (match === "\n") {
            return <br />;
        }

        return match;
    });
};

export const renderQuotes = (elements: (string | JSX.Element)[]) =>
    elements
        // Each array item is one line, this places <br />s into them correctly
        .reduce<(string | JSX.Element)[][]>(
            (result, element) => {
                let currentLine = result.at(-1)!;
                const currentLineLast = currentLine.at(-1);

                // If the line ends with text, append a <br />; otherwise <br /> just starts a new line.
                if (
                    currentLineLast &&
                    typeof currentLineLast !== "string" &&
                    currentLineLast.type === "br"
                ) {
                    result.push([]);
                    currentLine = result.at(-1)!;
                }

                currentLine.push(element);
                return result;
            },
            [[]]
        )
        .map((line) => {
            // If the line starts with text, it can be decorated
            if (typeof line[0] === "string") {
                // Greentexting
                if (line[0].startsWith(">")) {
                    // eslint-disable-next-line react/no-array-index-key
                    return <span className="text-green-600">{line}</span>;
                }

                // "Bluetexting"
                if (line[0].startsWith("<")) {
                    // eslint-disable-next-line react/no-array-index-key
                    return <span className="text-sky-700">{line}</span>;
                }
            }

            // Else just render it
            return line;
        });

export default (text: string) => renderQuotes(renderPostLinks(text));
