function genPair(data) {
    let combination = [];

    data.forEach((a, ia) => {
        combination.push(...data.map((b, ib) => {
            if (ia < ib) return [a, b];
            else return null;
        }));
    });

    //Filter undefined
    combination = combination.filter((c) => c);

    return combination;
}

export { genPair };
