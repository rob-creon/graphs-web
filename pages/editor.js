import Head from "next/head"
import React from "react"
import Viewer from "./components/Viewer"

const Editor = () => {
    const test_graph = [
        {position: [-0.2, -0.25], adj: [1], size: 0.01},
        {position: [-0.1, -0.5], adj: [2], size: 0.01},
        {position: [0.0, -0.5], adj: [3], size: 0.01},
        {position: [0.2, -0.25], adj: [4], size: 0.01},
        {position: [0.0, 0], adj: [0], size: 0.01}
    ]
    const circle_graph = []
    const n = 18
    for (let i = 0; i < n; i++) {
        circle_graph.push({position: [Math.cos(i * Math.PI*2 / n)/4, 0.5+Math.sin(i * Math.PI*2 / n)/4], adj: [i!==0 ? i-1 : n-1], size: 0.01})
    }

    const connected_graph = []
    let getAdj = (index, n) => {
        const ret = []
        for(let i = 0; i < n; i++) {
            if(i !== index) {
                ret.push(i)
            }
        }
        return ret
    }
    for (let i = 0; i < n; i++) {
        connected_graph.push({position: [Math.cos(i * Math.PI*2 / n)/4, 0.5+Math.sin(i * Math.PI*2 / n)/4], adj: getAdj(i, n), size: 0.01})
    }
    const origin_graph = [
        {position: [0, 0], adj: [], size: 0.1}
    ]
    return (<>
        <Head>
            <title>Editor | Graphs</title>
            <meta
                name="description"
                content="Graph Editor"
            />
        </Head>
        <div className="editor-page">
            <Viewer graph={connected_graph}/>
        </div>
    </>)
}

export default Editor