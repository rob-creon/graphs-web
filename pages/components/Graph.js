export function createCircleGraph(n) {
    const graph = []
    for (let i = 0; i < n; i++) {
        graph.push({
            position: [Math.cos(i * Math.PI * 2 / n) / 4, Math.sin(i * Math.PI * 2 / n) / 4],
            adj: [i !== 0 ? i - 1 : n - 1],
            size: 0.01
        })
    }
    return graph
}

export function createConnectedGraph(n) {
    const graph = []
    let getAdj = (index, n) => {
        const ret = []
        for (let i = 0; i < n; i++) {
            if (i !== index) {
                ret.push(i)
            }
        }
        return ret
    }
    for (let i = 0; i < n; i++) {
        graph.push({
            position: [Math.cos(i * Math.PI * 2 / n) / 4, Math.sin(i * Math.PI * 2 / n) / 4],
            adj: getAdj(i, n),
            size: 0.01
        })
    }
    return graph
}