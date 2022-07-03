import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';
import {matrix, subtract, size, eigs, round, config, multiply} from 'mathjs'
import {create, all} from 'mathjs'

// import styles from '../../styles/Editor.module.css'

function zeroArray(n) {
    return Array(n).fill(0).map(x => Array(n).fill(0))
}

function zeroArrayRect(n, m) {
    return Array(n).fill(0).map(x => Array(m).fill(0))
}

function matrixToLatex(mat) {
    const dim = size(mat)
    let latex = "\\begin{pmatrix}"
    for (let i = 0; i < dim.get([0]); i++) {
        for (let j = 0; j < dim.get([1]); j++) {
            latex += mat.get([i, j]) + (j === dim.get([1]) - 1 ? "\\\\" : "&")
        }
    }
    latex += "\\end{pmatrix}"
    return latex
}

const MathView = (props) => {
    const config = {
        number: 'Fraction'
    }
    const math = create(all, config)
    const graph = props.graph
    const n = graph.length

    let adjMatArr = zeroArray(n)
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < graph[i].adj.length; j++) {
            adjMatArr[i][graph[i].adj[j].index] = 1
        }
    }
    const adjMat = matrix(adjMatArr)

    let degMatArr = zeroArray(n)
    for (let i = 0; i < n; i++) {
        degMatArr[i][i] = graph[i].adj.length
    }
    const degMat = matrix(degMatArr)
    const lapMat = subtract(degMat, adjMat)

    // const incMatArr = []
    // for (let i = 0; i < n; i++) {
    //     for (let j = 0; j < graph[i].adj.length; j++) {
    //
    //     }
    // }

    const adjMat2 = math.multiply(adjMat, adjMat)
    const adjMat3 = math.multiply(adjMat2, adjMat)
    const adjMat4 = math.multiply(adjMat2, adjMat2)

    const Aeigs = math.eigs(adjMat).values.map((e) => round(e, 3))
    const Leigs = math.eigs(lapMat).values.map((e) => round(e, 3))
    let cc = 0
    Leigs.forEach((e) => {
        if(e < 0.001) cc++
    })
    return (
        <>
            <TeX block>
                {'\\text{\\# edges}=\\frac{1}{2}\\sum_{i=1}^n \\lambda_i^2=\\frac{1}{2}\\text{trace}(A_G^2)=' + math.trace(adjMat2)/2}
            </TeX>
            <TeX block>
                {'\\text{\\# triangles}=\\frac{1}{6}\\sum_{i=1}^n \\lambda_i^3=\\frac{1}{6}\\text{trace}(A_G^3)=' + math.trace(adjMat3)/6}
            </TeX>
            <TeX block>
                {'\\text{\\# connected components}=\\text{mult}(\\lambda_0) \\in L_G=' + cc}
            </TeX>
            <TeX block>
                {'A_G=' + matrixToLatex(adjMat)}
            </TeX>
            <TeX block>
                {'\\lambda(A_G)=' + Aeigs}
            </TeX>
            <TeX block>
                {'L_G=' + matrixToLatex(lapMat)}
            </TeX>
            <TeX block>
                {'\\lambda(L_G)=' + Leigs}
            </TeX>
        </>
    )
}

export default MathView