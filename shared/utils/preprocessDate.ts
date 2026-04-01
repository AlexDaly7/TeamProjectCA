import z from "zod";

export const preprocessDate = z.preprocess((value) => {
    // Since we submit the values as a date string, but we need
    // to format them into a Date instance back on the server, just
    // throw it into a new Date
    if (typeof value === "string" && value.trim() !== "") return new Date(value);

    return value;
}, z.date());