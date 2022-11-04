import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';
import {matrix, subtract, size, eigs, round, config, multiply} from 'mathjs'
import {create, all} from 'mathjs'
import styles from '../../styles/Editor.module.css'
import React from "react";
import {colVectorsOfMatrix, matrixToLatex} from "./Graph";

const ViewMatrices = (props) => {
    const math = props.graphInfo.math
    if(props.graphInfo.n > 1) {
        try {
            // const transitionMatrix = math.multiply(math.inv(props.graphInfo.degree.matrix), props.graphInfo.adjacency.matrix)
            // const transitionMatrixEigs = math.eigs(transitionMatrix)
            return (
                <>
                    <TeX block>
                        {'A_G=' + matrixToLatex(props.graphInfo.adjacency.matrix)}
                    </TeX>
                    <TeX block>
                        {'\\lambda(A_G)=' + props.graphInfo.adjacency.eigs.values.map((e) => math.round(e, 3))}
                    </TeX>
                    <TeX block>
                        {'\\Psi(A_G)={' + colVectorsOfMatrix(props.graphInfo.adjacency.eigs.vectors).map((e) => matrixToLatex(e)) + '}'}
                    </TeX>
                    <TeX block>
                        {'L_G=' + matrixToLatex(props.graphInfo.laplace.matrix)}
                    </TeX>
                    <TeX block>
                        {'\\lambda(L_G)=' + props.graphInfo.laplace.eigs.values.map((e) => math.round(e, 3))}
                    </TeX>
                    <TeX block>
                        {'\\Psi(L_G)={' + colVectorsOfMatrix(props.graphInfo.laplace.eigs.vectors).map((e) => matrixToLatex(e)) + '}'}
                    </TeX>
                    {/*<TeX block>*/}
                    {/*    {'T_G=D_G^{-1}A_G=' + matrixToLatex(transitionMatrix)}*/}
                    {/*</TeX>*/}
                    {/*<TeX block>*/}
                    {/*    {'\\lambda(T_G)=' + transitionMatrixEigs.values.map((e) => math.round(e, 3))}*/}
                    {/*</TeX>*/}
                    {/*<TeX block>*/}
                    {/*    {'\\Psi(T_G)={' + colVectorsOfMatrix(transitionMatrixEigs.vectors).map((e) => matrixToLatex(e)) + '}'}*/}
                    {/*</TeX>*/}
                </>
            )
        } catch(e) {
            return (
                <>
                    {"Spectral analysis requires the graph to be connected (otherwise eigenvalues do not converge)."}
                </>
            )
        }

    }
}

export default ViewMatrices