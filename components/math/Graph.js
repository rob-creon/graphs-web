import {all, create, matrix, size, subtract, round, column} from "mathjs";

export const VERTEX_SIZE = 0.015

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
            size: VERTEX_SIZE,
            spectralProjection: []
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
            size: VERTEX_SIZE,
            spectralProjection: []
        })
    }
    for (let i = 0; i < n; i++) {
        graph[i].adj = getAdj(i, n)
    }
    return graph
}

export function matrixToLatex(mat, rounding = 2) {
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
    const degreeMatrix = getDegreeMatrix(graph)

    return {
        math: math,
        graph: graph,
        n: graph.length,
        degree: {
            matrix: degreeMatrix
        },
        adjacency: {
            matrix: adjacencyMatrix,
            eigs: math.eigs(adjacencyMatrix)
        },
        laplace: {
            matrix: laplaceMatrix,
            eigs: math.eigs(laplaceMatrix)
        },
        // camera: {
        //     position: [-2, 0, 0],
        //     rotation:
        // }
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

export function spectralDrawingLazy(info) {
    const math = info.math
    // const DinvA = math.multiply(math.inv(info.degree.matrix), info.adjacency.matrix)

    const eigs = colVectorsOfMatrix(math.eigs(info.laplace.matrix).vectors)

    for (let i = 0; i < info.n; i++) {
        // info.graph[i].spectralProjection = [eigs[1].get([i, 0]), eigs[2].get([i, 0]), eigs[3].get([i, 0])]
        info.graph[i].position = [eigs[1].get([i, 0]), eigs[2].get([i, 0])]
    }
}

export function spectralDrawing(info, p = 2) {

    const math = info.math

    const EPSILON = 10 ** -8
    let u = []
    for (let k = 1; k < p; k++) {
        let uhat = math.random([info.n]) //random vector initialization
        uhat = math.divide(uhat, math.norm(uhat)) //normalize it

        do {
            u.push([...uhat])
            for (let l = 0; l < k - 2; l++) {
                const numer = math.multiply(math.transpose(u[k - 1]), math.multiply(info.degree.matrix, u[l]))
                const denom = math.multiply(math.transpose(u[l]), math.multiply(info.degree.matrix, u[l]))
                u[k - 1] = u[k - 1] - math.multiply(math.divide(numer, denom), u[l])
            }
            for (let i = 0; i < info.n; i++) {
                uhat = math.multiply
                (
                    0.5, math.multiply
                    (
                        u[k - 1], math.add
                        (
                            math.identity(info.n),
                            math.multiply
                            (
                                math.inv(info.degree.matrix),
                                info.adjacency.matrix
                            )
                        )
                    )
                )
                uhat = math.divide(uhat, math.norm(uhat))
            }
        } while (math.dot(uhat, u[k - 1]) < 1 - EPSILON)
        u[k - 1] = uhat
    }

    console.log(u)
}