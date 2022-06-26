import Head from "next/head"
import React from "react"
import Viewer from "./components/Viewer"
import Layout from "./components/Layout"
import styles from '../styles/Editor.module.css'
import EditorSwitch from './components/EditorSwitch'
import {createConnectedGraph, createCircleGraph} from "./components/Graph";
import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';
import Split from "react-split";

const Editor = () => {

    const animationEnabled = React.useRef(true)
    const displayMat = React.useRef(false)

    return (<Layout>
            <Head>
                <title>Editor | Graphs</title>
                <meta
                    name="description"
                    content="Graph Editor"
                />
            </Head>

            <div className={styles.navbar}>
                {/*<TeX block className={styles.latex}>*/}
                {/*    {"\\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}"}*/}
                {/*</TeX>*/}
                {/*<button className={styles.button} onClick={() => {*/}
                {/*}}>Adjacency Matrix*/}
                {/*</button>*/}
                <button className={styles.button} onClick={() => {
                }}>View Matrix Info
                </button>
                {/*<EditorSwitch name="Matrix Info" initialChecked={displayMat.current} onChange={(c)=>{*/}
                {/*    displayMat.current = c*/}
                {/*}}/>*/}
                <EditorSwitch name="Animation" initialChecked={animationEnabled.current} onChange={(c) => {
                    animationEnabled.current = c
                }}/>
            </div>

            <Split className={styles.split}>
                <div className={styles.splitViewer}>
                    <Viewer graph={createCircleGraph(12)} animationEnabled={animationEnabled}/>
                </div>
                <div className={styles.splitMath}/>
            </Split>

        </Layout>


    )
}

export default Editor