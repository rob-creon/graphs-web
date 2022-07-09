import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';
import {matrix, subtract, size, eigs, round, config, multiply} from 'mathjs'
import {create, all} from 'mathjs'
import styles from '../../styles/Editor.module.css'
import React, {useRef} from "react";
import InputBox from "../InputBox";

const ViewWalks = (props) => {

    const [k, setK] = React.useState(3)
    const [i, setI] = React.useState(1)
    const [j, setJ] = React.useState(1)

    const kWalk = () => {
        const math = props.graphInfo.math
        const matPow = math.pow(props.graphInfo.adjacency.matrix, k)
        return matPow.get([i-1, j-1])
    }

    return (
        <div>
            <p>
                {'Number of '}
                <InputBox size={1} min={3} max={props.graphInfo.n} onChange={setK}/>
                {'-walks from vertex '}
                <InputBox size={1} min={1} max={props.graphInfo.n} onChange={setI}/>
                {' to vertex '}
                <InputBox size={1} min={1} max={props.graphInfo.n} onChange={setJ}/>
                {' = '}
                <bold>{kWalk()}</bold>

            </p>
        </div>
    )
}

export default ViewWalks