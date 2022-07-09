import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';
import {matrix, subtract, size, eigs, round, config, multiply} from 'mathjs'
import {create, all} from 'mathjs'
import styles from '../styles/Editor.module.css'
import React from "react";
import ViewSummary from './math/ViewSummary'
import ViewMatrices from "./math/ViewMatrices";
import ViewWalks from "./math/ViewWalks";
import {getGraphInfo} from "./math/Graph";

// import styles from '../../styles/Editor.module.css'

const unselectedButtonColor = 'rgba(120,145,148,0.45)'

const MathButton = (props) => {
    const name = props.name
    const mathMode = props.mode
    const setMathMode = props.setMode
    const color = props.color

    return (
        <button className={styles.buttonmath} onClick={() => setMathMode(name)}
                style={{backgroundColor: mathMode === name ? color : unselectedButtonColor}}>
            {props.children}
        </button>
    )
}

const MathView = (props) => {

    const [mode, setMode] = React.useState('summary')

    if (props.graph.length > 0) {
        const graphInfo = getGraphInfo(props.graph)
        const Views = {
            summary: (<ViewSummary graphInfo={graphInfo}/>),
            matrices: (<ViewMatrices graphInfo={graphInfo}/>),
            walks: (<ViewWalks graphInfo={graphInfo}/>),
        }

        return (
            <>
                <div className={styles.navbar} style={{backgroundColor: 'rgb(197,200,203)'}}>
                    <MathButton name={'summary'} mode={mode} setMode={setMode} color={'#ff7f7f'}>Summary</MathButton>
                    <MathButton name={'matrices'} mode={mode} setMode={setMode} color={'#ff9975'}>Matrices</MathButton>
                    <MathButton name={'walks'} mode={mode} setMode={setMode} color={'#ffe07a'}>k-walks</MathButton>
                </div>
                {Views[mode]}
            </>
        )
    } else {
        return (<TeX block>
            {'\\text{Empty Graph}'}
        </TeX>)
    }
}

export default MathView