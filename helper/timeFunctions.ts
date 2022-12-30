export const convertDate = (date: Date) =>
    date.toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

export const convertTime = (date: Date) =>
    date.toLocaleString("en-GB", {
        hour: "numeric",
        minute: "numeric",
    });

export const convertDateTime = (date: Date) =>
    date.toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
    });
