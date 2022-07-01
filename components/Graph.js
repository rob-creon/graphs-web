export function disconnectVert(graph, victim) {
    const n = graph.length
    for (let i = 0; i < n; i++) {
        const v = graph[i]
        while (v.adj.includes(victim)) {
            v.adj.splice(v.adj.indexOf(victim), 1) //delete the reference to the victim
        }
    }
    victim.adj = [] //delete all edges from the victim
}

export function createCircleGraph(n) {
    const graph = []
    for (let i = 0; i < n; i++) {
        graph.push({
            index: i,
            position: [Math.cos(i * Math.PI * 2 / n) / 4, Math.sin(i * Math.PI * 2 / n) / 4],
            adj: [],
            size: 0.01
        })
    }
    graph[0].adj = [graph[graph.length - 1], graph[1]]
    for (let i = 1; i < n; i++) {
        graph[i].adj = [graph[i-1], graph[(i+1)%n]]
    }
    return graph
}

export function createConnectedGraph(n) {
    const graph = []
    let getAdj = (index, n) => {
        const ret = []
        for (let i = 0; i < n; i++) {
            if (i !== index) {
                ret.push(graph[i])
            }
        }
        return ret
    }
    for (let i = 0; i < n; i++) {
        graph.push({
            index: i,
            position: [Math.cos(i * Math.PI * 2 / n) / 4, Math.sin(i * Math.PI * 2 / n) / 4],
            adj: [],
            size: 0.01
        })
    }
    for (let i = 0; i < n; i++) {
        graph[i].adj = getAdj(i, n)
    }
    return graph
}