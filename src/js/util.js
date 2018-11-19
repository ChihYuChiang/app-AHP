function genPair(data) {
    let combination = [];
    data.forEach((a) => {
        combination.push(...data.map((b) => [a, b]));
    });
    combination = combination.filter((com) => com[0] !== com[1]);
}

export { genPair };