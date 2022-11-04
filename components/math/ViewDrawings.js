import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';
import styles from '../../styles/Editor.module.css'
import {
    colVectorsOfMatrix,
    getNumConnectedComponents,
    getNumEdges,
    spectralDrawing,
    spectralDrawingLazy
} from "./Graph";

const ViewDrawings = (props) => {

    const info = props.graphInfo
    const math = info.math

    let numer = 0
    let denom = 0

    // To compute for every edge exactly once we traverse the upper triangular half of the adjacency matrix
    for (let i = 0; i < info.n; i++) {
        for (let j = i + 1; j < info.n; j++) {

            const vi = math.matrix(info.graph[i].position)
            const vj = math.matrix(info.graph[j].position)
            const dij = math.distance(vi, vj)

            //Check if we have an adjacent edge
            if (info.adjacency.matrix.get([i, j]) === 1) {
                numer += dij
            }
            denom += dij
        }
    }

    const E = numer / denom

    let averageX = 0
    let averageY = 0
    info.graph.forEach((v) => {
        averageX += v.position[0]
        averageY += v.position[1]
    })
    averageX /= info.n
    averageY /= info.n
    averageX = info.math.round(averageX, 3)
    averageY = info.math.round(averageY, 3)

    let varianceX = 0
    let varianceY = 0
    info.graph.forEach((v)=> {
        varianceX += (averageX - v.position[0])**2
        varianceY += (averageY - v.position[1])**2
    })
    varianceX /= info.n
    varianceY /= info.n
    varianceX = info.math.round(varianceX, 3)
    varianceY = info.math.round(varianceY, 3)


    const bestE = info.laplace.eigs.values.get([1]) + info.laplace.eigs.values.get([2])

    return (
        <div style={{
            alignContent: 'center',
            flex: 1,
            flexDirection: 'column',
            display: 'flex',

        }}>
            <button className={styles.button} onClick={() => {
                // Find first two nontrivial eigenvectors
                const eigVals = props.graphInfo.laplace.eigs.values
                const eigVecs = colVectorsOfMatrix(props.graphInfo.laplace.eigs.vectors)

                spectralDrawingLazy(props.graphInfo)
                props.updateGraph(props.graphInfo.graph)

            }}> Find Spectral Graph Drawing
            </button>
            <TeX block>
                {'\\textbf{Average Position}=(' + averageX + ',' + averageY + ')'}
            </TeX>
            <TeX block>
                {'\\textbf{Variance}=(' + varianceX + ',' + varianceY + ')'}
            </TeX>
            <TeX block>
                {'\\textbf{Energy}=' + E}
            </TeX>
            <TeX block>
                {'\\textbf{Min Energy}=' + bestE}
            </TeX>
        </div>
    )
}

export default ViewDrawings