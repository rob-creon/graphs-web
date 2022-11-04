import Head from "next/head"
import React from "react"
import Viewer from "../components/Viewer"
import MathView from "../components/MathView"
import Layout from "../components/Layout"
import styles from '../styles/Editor.module.css'
import EditorSwitch from '../components/EditorSwitch'
import {createConnectedGraph, createCircleGraph} from "../components/math/Graph";
import Split from "react-split";

const Editor = () => {

    const [graph, setGraph] = React.useState(createConnectedGraph(8))

    const animationEnabled = React.useRef(true)
    const vertexLabelsEnabled = React.useRef(false)
    const [tool, setTool] = React.useState('MoveVertex')
    const [showMath, setShowMath] = React.useState(true)

    const GetViewer = () => {
        return (
            <div className={styles.splitViewer}>
                <Viewer graph={graph} animationEnabled={animationEnabled} vertexLabelsEnabled={vertexLabelsEnabled}
                        tool={tool} updateGraph={(g) => {
                    setGraph([...g])
                }}/>
            </div>
        )
    }

    const SplitView = () => {
        if (showMath) {
            return (
                <Split className={styles.split} sizes={[70, 30]}>
                    {GetViewer()}
                    <div className={styles.splitMath} hidden={showMath.current}>
                        <MathView graph={graph} updateGraph={(g) => {
                            setGraph([...g])
                        }}/>
                    </div>
                </Split>
            )
        } else {
            return (
                <div className={styles.split}>
                    {GetViewer()}
                </div>
            )
        }
    }

    return (<Layout>
            <Head>
                <title>Editor | Graphs</title>
                <meta
                    name="description"
                    content="Graph Editor"
                />
            </Head>

            <div className={styles.navbar}>

                <button className={styles.button}
                        onClick={() => setTool('MoveVertex')}
                        style={tool === 'MoveVertex' ? {color: '#51ffed'} : {}}
                >Move
                </button>
                <button className={styles.button}
                        onClick={() => setTool('AddVertex')}
                        style={tool === 'AddVertex' ? {color: '#51ffed'} : {}}
                >Add Vertex
                </button>
                <button className={styles.button}
                        onClick={() => setTool('AddEdge')}
                        style={tool === 'AddEdge' ? {color: '#51ffed'} : {}}
                >Add Edge
                </button>
                <button className={styles.button}
                        onClick={() => setTool('Eraser')}
                        style={tool === 'Eraser' ? {color: '#51ffed'} : {}}
                >Eraser
                </button>
                <button className={styles.button} onClick={() => {
                    setShowMath(!showMath)
                }}>{showMath ? "Hide Math" : "Show Math"}
                </button>
                <EditorSwitch name="Animation" initialChecked={animationEnabled.current} onChange={(c) => {
                    animationEnabled.current = c
                }}/>
                <EditorSwitch name="Vertex Labels" initialChecked={vertexLabelsEnabled.current} onChange={(c) => {
                    vertexLabelsEnabled.current = c
                }}/>
            </div>
            {SplitView()}

        </Layout>
    )
}

export default Editor