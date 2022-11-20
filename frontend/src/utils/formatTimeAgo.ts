const formatter = new Intl.RelativeTimeFormat("fi", {
    numeric: "auto",
    style: "narrow",
});

interface Unit {
    name: Intl.RelativeTimeFormatUnit;
    amount: number;
}

const formatTimeAgo = (timestamp: string) => {
    let duration = (+new Date() - +new Date(timestamp)) / 1000;

    const units: Unit[] = [
        { name: "seconds", amount: 60 },
        { name: "minutes", amount: 60 },
        { name: "hours", amount: 24 },
        { name: "days", amount: 7 },
    ];

    // TODO!
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const unit of units) {
        if (duration < unit.amount) {
            return formatter.format(-Math.round(duration), unit.name);
        }

        duration /= unit.amount;
    }

    return formatter.format(-Math.round(duration / 4.34524), "weeks");
};

export default formatTimeAgo;
