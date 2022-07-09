import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';
import styles from '../../styles/Editor.module.css'
import {getNumConnectedComponents, getNumEdges} from "./Graph";

const ViewSummary = (props) => {

    return (
        <>
            <Button />
            <TeX block>
                {'\\text{\\# edges}=\\frac{1}{2}\\sum_{i=1}^n \\lambda_i^2=\\frac{1}{2}\\text{trace}(A_G^2)=' + getNumEdges(props.graphInfo)}
            </TeX>
            <TeX block>
                {'\\text{\\# connected components}=\\text{mult}(\\lambda_0) \\in L_G=' + getNumConnectedComponents(props.graphInfo)}
            </TeX>
        </>
    )
}

export default ViewSummary