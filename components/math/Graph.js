import {all, create, matrix, size, subtract, round, column} from "mathjs";

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
            size: 0.015
        })
    }
    graph[0].adj = [graph[graph.length - 1], graph[1]]
    for (let i = 1; i < n; i++) {
        graph[i].adj = [graph[i - 1], graph[(i + 1) % n]]
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
            size: 0.015
        })
    }
    for (let i = 0; i < n; i++) {
        graph[i].adj = getAdj(i, n)
    }
    return graph
}

export function matrixToLatex(mat, rounding=2) {
    const dim = size(mat)
    let latex = "\\begin{pmatrix}"
    for (let i = 0; i < dim.get([0]); i++) {
        for (let j = 0; j < dim.get([1]); j++) {
            latex += round(mat.get([i, j]), rounding) + (j === dim.get([1]) - 1 ? "\\\\" : "&")
        }
    }
    latex += "\\end{pmatrix}"
    return latex
}

export function colVectorsOfMatrix(mat) {
    const dim = size(mat)
    let cols = []
    for (let i = 0; i < dim.get([0]); i++) {
        cols.push(column(mat, i))
    }
    return cols
}

function zeroArray(n) {
    return Array(n).fill(0).map(x => Array(n).fill(0))
}

function zeroArrayRect(n, m) {
    return Array(n).fill(0).map(x => Array(m).fill(0))
}

function getAdjacencyMatrix(graph) {
    let adjMatArr = zeroArray(graph.length)
    for (let i = 0; i < graph.length; i++) {
        for (let j = 0; j < graph[i].adj.length; j++) {
            adjMatArr[i][graph[i].adj[j].index] = 1
        }
    }
    return matrix(adjMatArr)
}

function getDegreeMatrix(graph) {
    let degMatArr = zeroArray(graph.length)
    for (let i = 0; i < graph.length; i++) {
        degMatArr[i][i] = graph[i].adj.length
    }
    return matrix(degMatArr)
}

function getLaplaceMatrix(graph) {
    return subtract(getDegreeMatrix(graph), getAdjacencyMatrix(graph))
}

export function getGraphInfo(graph) {

    const math = create(all, {number: 'Fraction'})

    const adjacencyMatrix = getAdjacencyMatrix(graph)
    const laplaceMatrix = getLaplaceMatrix(graph)

    return {
        math: math,
        graph: graph,
        n: graph.length,
        adjacency: {
            matrix: adjacencyMatrix,
            eigs: math.eigs(adjacencyMatrix)
        },
        laplace: {
            matrix: laplaceMatrix,
            eigs: math.eigs(laplaceMatrix)
        }
    }
}

export function getNumEdges(info) {
    let count = 0
    info.adjacency.eigs.values.forEach((e) => count += e ** 2)
    return info.math.round(count / 2, 1)
}

export function getNumConnectedComponents(info) {
    let count = 0
    info.laplace.eigs.values.forEach((e) => count += e < 0.000000001 ? 1 : 0)
    return count
}