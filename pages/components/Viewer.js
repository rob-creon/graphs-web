import React, {useCallback, useRef, useState} from "react"
import useViewer from "./useViewer";
import {matrix, multiply, norm, inv, subtract, number, index, distance} from 'mathjs'

const cameraX = 0
const cameraY = 0

function rgb(r, g, b) {
    return "rgb(" + r + "," + g + "," + b + ")";
}

function getProjectionMatrix(width, height) {

    console.log("w=", width, "h=", height)

    let right = width/2
    let left = -width/2
    let top = -width/2
    let bottom = width/2
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

function coordToScreen(ctx, x, y) {
    const projMatrix = getProjectionMatrix(ctx.canvas.width, ctx.canvas.height)
    const srcPos = matrix([x, y, 1, 1])
    const projSrcPos = multiply(projMatrix, srcPos)
    return matrix([projSrcPos.get([0]) + ctx.canvas.width/2, projSrcPos.get([1]) + ctx.canvas.height/2])
}

function screenToCoord(ctx, x, y) {
    const projMatrix = getInverseProjectionMatrix(ctx.canvas.width, ctx.canvas.height)
    const srcPos = matrix([x - ctx.canvas.width/2, y - ctx.canvas.height/2, 1, 1])
    const projSrcPos = multiply(projMatrix, srcPos)
    return matrix([projSrcPos.get([0]), projSrcPos.get([1])])
}

const Viewer = props => {

    let mouse = {x: 0, y: 0}
    let mouseOver = useRef(false)
    let mouseDown = useRef(false)
    let mouseClick = useRef(false)
    let dragTarget = useRef(null)

    const [cursor, setCursor] = useState('cursor')

    const draw = useCallback((ctx, frame) => {

        if (!mouseDown.current) {
            dragTarget.current = null
        }

        // Update Mouse
        if (mouseOver.current) {
            setCursor('default')
            // const projMouse = multiply(getInverseProjectionMatrix(ctx.canvas.width, ctx.canvas.height), matrix([mouse.x, mouse.y, 1, 1])).subset(index([0, 1]))
            const projMouse = screenToCoord(ctx, mouse.x, mouse.y)
            props.graph.forEach((node, index) => {
                const nodePos = matrix([node.position[0], node.position[1]])
                const dist = distance(projMouse, nodePos)

                if (dist <= node.size) {
                    setCursor('pointer')
                    if (dragTarget.current === null) {
                        dragTarget.current = index
                    }
                }
                if (mouseDown.current && dragTarget.current === index) {
                    node.position = [projMouse.get([0]), projMouse.get([1])]
                }
            })
        }

        // Clear the canvas
        ctx.fillStyle = '#2d3846'
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        const projMatrix = getProjectionMatrix(ctx.canvas.width, ctx.canvas.height)

        // Render the edges
        props.graph.forEach(src => {
            src.adj.forEach(dstInd => {
                const dst = props.graph[dstInd]

                // const srcPos = matrix([src.position[0], src.position[1], 1, 1])
                // const projSrcPos = multiply(projMatrix, srcPos)
                const projSrcPos = coordToScreen(ctx, src.position[0], src.position[1])

                // const dstPos = matrix([dst.position[0], dst.position[1], 1, 1])
                // const projDstPos = multiply(projMatrix, dstPos)
                const projDstPos = coordToScreen(ctx, dst.position[0], dst.position[1])

                ctx.strokeStyle = '#c9e6f6'
                ctx.beginPath()
                ctx.moveTo(projSrcPos.get([0]), projSrcPos.get([1]))
                ctx.lineTo(projDstPos.get([0]), projDstPos.get([1]))
                ctx.stroke()
            })
        })

        // Render the vertices
        const numNodes = props.graph.length
        const nodeAnimIncr = (Math.PI) / numNodes
        props.graph.forEach((node, index) => {
            // const pos = matrix([node.position[0], node.position[1], 1, 1])
            // const projPos = multiply(projMatrix, pos)
            const projPos = coordToScreen(ctx, node.position[0], node.position[1])

            const origin = multiply(projMatrix, matrix([0, 0, 1, 1]))
            const tmp = multiply(projMatrix, matrix([node.size, node.size, 1, 1]))
            const projNodeSize = number(norm(subtract(origin, tmp), 2))

            const animSpeed = 0.02
            const animOffset = index * nodeAnimIncr
            let animFactor = Math.sin(animOffset + (frame * animSpeed)) ** 2

            if (!props.animationEnabled.current) {
                animFactor = 0
            }

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

        if (mouseOver.current) {
            // ctx.beginPath()
            // ctx.fillText("X: " + mouse.x + ", Y: " + mouse.y, 10, 20);
            // ctx.fillText("dragTarget: " + dragTarget.current, 10, 40)
        }

    }, [props.graph, mouse.x, mouse.y, mouseDown, mouseOver, props.animationEnabled])

    const canvasRef = useViewer(draw,
        (m) => {
            mouse = m
        },
        (c) => {
            mouseClick.current = !mouseDown.current
            mouseDown.current = c
        },
        (o) => {
            mouseOver.current = o
        })

    return (
        <canvas ref={canvasRef} style={{cursor: cursor}}/>
    )
}

export default Viewer