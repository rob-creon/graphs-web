import React, {useCallback, useRef, useState} from "react"
import useViewer from "./useViewer";
import {matrix, multiply, norm, inv, subtract, number, index, distance} from 'mathjs'

function rgb(r, g, b) {
    return "rgb(" + r + "," + g + "," + b + ")";
}

function getProjectionMatrix(width, height) {

    let ratio = height/width

    let right = width
    let left = 0
    let top = 0
    let bottom = height/ratio
    let far = 10
    let near = -10

    return matrix([
        [(right - left) / 2, 0, 0, (right + left) / 2],
        [0, (top - bottom) / 2, 0, (top + bottom) / 2],
        [0, 0, (far - near) / -2, -(far + near) / 2],
        [0, 0, 0, 1]
    ])
}

function getInverseProjectionMatrix(width, height) {
    return inv(getProjectionMatrix(width, height))
}

const Viewer = graph => {

    let mouse = {x: 0, y: 0}
    let mouseDown = useRef(false)
    let mouseClick = useRef(false)
    let dragTarget = useRef(null)

    const [cursor, setCursor] = useState('cursor')

    const draw = useCallback((ctx, frame) => {

        if(!mouseDown.current) {
            dragTarget.current = null
        }

        // Update Mouse
        const projMouse = multiply(getInverseProjectionMatrix(ctx.canvas.width, ctx.canvas.height), matrix([mouse.x, mouse.y, 1, 1])).subset(index([0, 1]))
        setCursor('default')
        graph.graph.forEach((node, index) => {
            const nodePos = matrix([node.position[0], node.position[1]])
            const dist = distance(projMouse, nodePos)

            if (dist <= node.size) {
                setCursor('pointer')

                if (mouseClick.current) {
                    dragTarget.current = index
                }
            }

            if (mouseDown.current && dragTarget.current === index) {
                node.position = [projMouse.get([0]), projMouse.get([1])]
            }
        })

        // Clear the canvas
        ctx.fillStyle = '#2d3846'
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        const projMatrix = getProjectionMatrix(ctx.canvas.width, ctx.canvas.height)

        // Render the edges
        graph.graph.forEach(src => {
            src.adj.forEach(dstInd => {
                const dst = graph.graph[dstInd]

                const srcPos = matrix([src.position[0], src.position[1], 1, 1])
                const projSrcPos = multiply(projMatrix, srcPos)

                const dstPos = matrix([dst.position[0], dst.position[1], 1, 1])
                const projDstPos = multiply(projMatrix, dstPos)

                ctx.strokeStyle = '#c9e6f6'
                ctx.beginPath()
                ctx.moveTo(projSrcPos.get([0]), projSrcPos.get([1]))
                ctx.lineTo(projDstPos.get([0]), projDstPos.get([1]))
                ctx.stroke()
            })
        })

        // Render the vertices
        const numNodes = graph.graph.length
        const nodeAnimIncr = (Math.PI) / numNodes
        graph.graph.forEach((node, index) => {
            const pos = matrix([node.position[0], node.position[1], 1, 1])
            const projPos = multiply(projMatrix, pos)

            const origin = multiply(projMatrix, matrix([0, 0, 1, 1]))
            const tmp = multiply(projMatrix, matrix([node.size, node.size, 1, 1]))
            const projNodeSize = number(norm(subtract(origin, tmp), 2))

            const animSpeed = 0.02
            const animOffset = index * nodeAnimIncr
            const animFactor = Math.sin(animOffset + (frame * animSpeed))**2

            const minSize = projNodeSize * 0.8
            const sizeOffset = projNodeSize - minSize
            const finalSize = minSize + animFactor * sizeOffset

            const minRed = 148
            const maxRed = 255
            const redOffset = maxRed - minRed
            const finalRed = minRed + animFactor * redOffset

            ctx.fillStyle = rgb(finalRed, 148, 255)

            ctx.beginPath()
            ctx.arc(projPos.get([0]), projPos.get([1]), finalSize, 0, 2 * Math.PI)
            ctx.fill()
        })

        ctx.beginPath()
        ctx.fillText("X: " + mouse.x + ", Y: " + mouse.y, 10, 20);
        ctx.fillText("dragTarget: " + dragTarget.current, 10, 40)

    }, [graph.graph, mouse.x, mouse.y, mouseClick, mouseDown])

    const canvasRef = useViewer(draw, (m) => mouse = m, (c) => {
        mouseClick.current = !mouseDown.current;
        mouseDown.current = c
    })

    return <div className="viewer">
        <canvas ref={canvasRef} style={{cursor: cursor}}/>
    </div>
}

export default Viewer