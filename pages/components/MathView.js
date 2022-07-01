import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';
import {matrix, subtract, size} from 'mathjs'

// import styles from '../../styles/Editor.module.css'

function zeroArray(n) {
    return Array(n).fill(0).map(x => Array(n).fill(0))
}

function matrixToLatex(mat) {
    const dim = size(mat)
    let latex = "\\begin{pmatrix}"
    for (let i = 0; i < dim.get([0]); i++) {
        for (let j = 0; j < dim.get([1]); j++) {
            latex += mat.get([i, j]) + (j === dim.get([1])-1 ? "\\\\" : "&")
        }
    }
    latex += "\\end{pmatrix}"
    return latex
}

const MathView = (props) => {
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

    return (
        <>
            <TeX block>
                {'A_G=' + matrixToLatex(adjMat)}
            </TeX>
            <TeX block>
                {'D_G=' + matrixToLatex(degMat)}
            </TeX>
            <TeX block>
                {'L_G=' + matrixToLatex(lapMat)}
            </TeX>
        </>
    )
}

export default MathView