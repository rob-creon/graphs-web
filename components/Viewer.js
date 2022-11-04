import React, {useCallback, useRef, useState} from "react"
import useViewer from "./useViewer";
import {matrix, multiply, norm, inv, subtract, number, index, distance} from 'mathjs'
import {disconnectVert, VERTEX_SIZE} from "./math/Graph";

function rgb(r, g, b) {
    return "rgb(" + r + "," + g + "," + b + ")";
}

function distFromLine(line1, line2, point0) {
    const x_1 = line1[0]
    const y_1 = line1[1]

    const x_2 = line2[0]
    const y_2 = line2[1]

    const x_0 = point0[0]
    const y_0 = point0[1]

    if (x_0 - 10 > Math.max(x_1, x_2) || x_0 + 10 < Math.min(x_1, x_2)) {
        return 999
    }
    if (y_0 - 10 > Math.max(y_1, y_2) || y_0 + 10 < Math.min(y_1, y_2)) {
        return 999
    }

    const numerator = (x_2 - x_1) * (y_1 - y_0) - (x_1 - x_0) * (y_2 - y_1)
    const denominator = (x_2 - x_1) ** 2 + (y_2 - y_1) ** 2

    return Math.abs(numerator) / Math.sqrt(denominator)
}

function getProjectionMatrix(width, height) {

    let right = width / 2
    let left = -width / 2
    let top = -width / 2
    let bottom = width / 2
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

let zoom = 1
const cameraX = 0
const cameraY = 0

function coordToScreen(ctx, x, y) {
    const projMatrix = getProjectionMatrix(ctx.canvas.width, ctx.canvas.height)
    const srcPos = matrix([(x - cameraX) * zoom, (y - cameraY) * zoom, 1, 1])
    const projSrcPos = multiply(projMatrix, srcPos)
    return matrix([projSrcPos.get([0]) + ctx.canvas.width / 2, projSrcPos.get([1]) + ctx.canvas.height / 2])
}

function coordToScreenVec(ctx, vec) {
    const projMatrix = getProjectionMatrix(ctx.canvas.width, ctx.canvas.height)
    const srcPos = matrix([(vec.get([0]) - cameraX) * zoom, (vec.get([1]) - cameraY) * zoom, 1, 1])
    const projSrcPos = multiply(projMatrix, srcPos)
    return matrix([projSrcPos.get([0]) + ctx.canvas.width / 2, projSrcPos.get([1]) + ctx.canvas.height / 2])
}

function screenToCoord(ctx, x, y) {
    const projMatrix = getInverseProjectionMatrix(ctx.canvas.width, ctx.canvas.height)
    const srcPos = matrix([x - ctx.canvas.width / 2, y - ctx.canvas.height / 2, 1, 1])
    const projSrcPos = multiply(projMatrix, srcPos)
    return matrix([projSrcPos.get([0]) / zoom + cameraX, projSrcPos.get([1]) / zoom + cameraY])
}

const Viewer = props => {

    const Tools = {
        MoveVertex: {
            cursor: 'default',
            reset: () => {
            },
            draw: (m) => {

            },
            onMouseClickVertex: (v) => {

            },
            onEmptyClick: (m) => {

            },
            onMouseOverEmpty: (m) => {
            },
            onMouseOverVertex: (v) => {
                setCursor('pointer')
            },
            onMouseClickEdge: (e) => {

            },
            onMouseDragVertex: (v, m) => {
                v.position = [m.get([0]), m.get([1])]
                updateGraph(graph)
            }
        },
        AddVertex: {
            cursor: 'pointer',
            reset: () => {
            },
            draw: (m) => {

            },
            onMouseClickVertex: (v) => {

            },
            onEmptyClick: (m) => {
                graph.push({
                        index: graph.length,
                        position: [m.get([0]), m.get([1])],
                        adj: [],
                        size: VERTEX_SIZE
                    }
                )
                updateGraph(graph)
            },
            onMouseOverEmpty: (m) => {
            },
            onMouseOverVertex: (v) => {
                setCursor('not-allowed')
            },
            onMouseClickEdge: (e) => {

            },
            onMouseDragVertex: (v, m) => {

            }
        },
        AddEdge: {
            cursor: 'default',
            srcVert: useRef(null),
            dstVert: useRef(null),
            reset: () => {
                if (Tools['AddEdge'].srcVert !== null)
                    Tools['AddEdge'].srcVert.current = null;
                if (Tools['AddEdge'].dstVert !== null)
                    Tools['AddEdge'].dstVert.current = null;
            },
            draw: (ctx, m) => {
                if (Tools['AddEdge'].srcVert.current != null) {
                    const srcPos = coordToScreenVec(ctx, matrix(Tools['AddEdge'].srcVert.current.position))
                    const dstPos = Tools['AddEdge'].dstVert.current === null ? matrix([m.x, m.y]) : coordToScreenVec(ctx, matrix(Tools['AddEdge'].dstVert.current.position))

                    ctx.strokeStyle = '#c9e6f6'
                    ctx.beginPath()
                    ctx.moveTo(srcPos.get([0]), srcPos.get([1]))
                    ctx.lineTo(dstPos.get([0]), dstPos.get([1]))
                    ctx.stroke()

                    ctx.beginPath()
                    ctx.fillText("srcPos: " + srcPos + ", " + Array(srcPos), 10, 100)
                    ctx.fillText("dstPos: " + dstPos + ", " + Array(dstPos), 10, 120)
                }
            },
            onMouseClickVertex: (v) => {
                if (Tools['AddEdge'].srcVert.current === null) {
                    Tools['AddEdge'].srcVert.current = v
                } else {
                    Tools['AddEdge'].srcVert.current.adj.push(Tools['AddEdge'].dstVert.current)
                    Tools['AddEdge'].dstVert.current.adj.push(Tools['AddEdge'].srcVert.current)
                    Tools['AddEdge'].reset()
                    updateGraph(graph)
                }
            },
            onEmptyClick: (m) => {

            },
            onMouseOverEmpty: (m) => {
                Tools['AddEdge'].dstVert.current = null
            },
            onMouseOverVertex: (graph, v) => {
                setCursor('pointer')
                if (Tools['AddEdge'].srcVert.current !== null) {
                    Tools['AddEdge'].dstVert.current = v
                }
            },
            onMouseClickEdge: (e) => {

            },
            onMouseDragVertex: (v, m) => {

            }
        },
        Eraser: {
            cursor: "url('eraser.cur'), auto",
            deleteList: useRef([]),
            reset: () => {
            },
            draw: (ctx, m) => {

            },
            onMouseClickVertex: (v) => {

            },
            onEmptyClick: (m) => {

            },
            onMouseOverEmpty: (m) => {
            },
            onMouseOverVertex: (graph, v) => {
                if (mouseDown.current) {
                    disconnectVert(graph, v)
                    Tools['Eraser'].deleteList.current.push(v)
                    // updateGraph(graph)
                }
            },
            onMouseClickEdge: (e) => {
                e[0].adj.splice(e[0].adj.indexOf(e[1]), 1)
                e[1].adj.splice(e[1].adj.indexOf(e[0]), 1)
                updateGraph(graph)
            },
            onMouseDragVertex: (v, m) => {

            }
        },
    };

    const lastTool = useRef(null)

    const graph = props.graph
    const updateGraph = props.updateGraph

    let mouse = {x: 0, y: 0}
    let mouseOver = useRef(false)
    let mouseDown = useRef(false)
    let mouseClick = useRef(false)
    let dragTarget = useRef(null)

    const [cursor, setCursor] = useState('cursor')

    const draw = useCallback((ctx, frame) => {

        const tool = Tools[props.tool]

        if (props.tool !== lastTool.current) {
            tool.reset()
            lastTool.current = props.tool
        }

        if (!mouseDown.current) {
            dragTarget.current = null
        }

        // Update Mouse
        if (mouseOver.current) {
            // setCursor('default')
            let mouseOverEmpty = true
            setCursor(tool.cursor)
            // const projMouse = multiply(getInverseProjectionMatrix(ctx.canvas.width, ctx.canvas.height), matrix([mouse.x, mouse.y, 1, 1])).subset(index([0, 1]))
            const projMouse = screenToCoord(ctx, mouse.x, mouse.y)
            if (mouse.x === 0 && mouse.y === 0) { //stupid hack
                return
            }
            graph.forEach((node, index) => {
                const nodePos = matrix([node.position[0], node.position[1]])
                const dist = distance(projMouse, nodePos)

                if (dist <= node.size) {
                    mouseOverEmpty = false
                    // setCursor('pointer')
                    if (dragTarget.current === null && mouseClick.current) {
                        dragTarget.current = index
                    }
                    tool.onMouseOverVertex(graph, node)
                    if (mouseClick.current) {
                        tool.onMouseClickVertex(node)
                    }
                }
                if (mouseDown.current && dragTarget.current === index) {
                    tool.onMouseDragVertex(node, projMouse)
                    // node.position = [projMouse.get([0]), projMouse.get([1])]
                }
            })
            if (mouseOverEmpty) {
                if (mouseClick.current) {
                    if (mouse.x === 0 && mouse.y === 0) {
                        // console.log("ghost click")
                    } else {
                        tool.onEmptyClick(projMouse)
                    }
                } else {
                    tool.onMouseOverEmpty(projMouse)
                }
            }
        }


        // Clear the canvas
        ctx.fillStyle = '#2d3846'
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        const projMatrix = getProjectionMatrix(ctx.canvas.width, ctx.canvas.height)

        tool.draw(ctx, mouse)

        // Render the edges
        graph.forEach(src => {
            src.adj.forEach(dst => {

                // const srcPos = matrix([src.position[0], src.position[1], 1, 1])
                // const projSrcPos = multiply(projMatrix, srcPos)
                const projSrcPos = coordToScreen(ctx, src.position[0], src.position[1])

                // const dstPos = matrix([dst.position[0], dst.position[1], 1, 1])
                // const projDstPos = multiply(projMatrix, dstPos)
                const projDstPos = coordToScreen(ctx, dst.position[0], dst.position[1])

                const projMouse = screenToCoord(ctx, mouse.x, mouse.y)

                ctx.strokeStyle = '#c9e6f6'
                if (props.tool === 'Eraser') {
                    if (distFromLine(
                        [projSrcPos.get([0]), projSrcPos.get([1])],
                        [projDstPos.get([0]), projDstPos.get([1])],
                        [mouse.x, mouse.y]) < 6) {
                        ctx.strokeStyle = '#ff0000'
                        if (mouseDown.current) {
                            tool.onMouseClickEdge([src, dst])
                        }
                    }
                }


                ctx.beginPath()
                ctx.moveTo(projSrcPos.get([0]), projSrcPos.get([1]))
                ctx.lineTo(projDstPos.get([0]), projDstPos.get([1]))
                ctx.stroke()


            })
        })

        // Render the vertices
        const numNodes = graph.length
        const nodeAnimIncr = (Math.PI) / numNodes
        graph.forEach((node, index) => {
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

            if (props.vertexLabelsEnabled.current) {
                ctx.fillStyle = '#ffffff'
                ctx.font = finalSize * 8 + '% sans-serif';

                const textWidth = ctx.measureText(node.index + 1).width;

                ctx.beginPath()
                ctx.fillText(node.index + 1, projPos.get([0]) - textWidth / 2, projPos.get([1]) + finalSize / 2)
                ctx.stroke()
            }
        })

        if (mouseOver.current) {
            // ctx.beginPath()
            // ctx.fillText("X: " + mouse.x + ", Y: " + mouse.y, 10, 20);
            // ctx.fillText("dragTarget: " + dragTarget.current, 10, 40)
            // ctx.fillText("click: " + mouseClick.current, 10, 60)
            // ctx.fillText("down: " + mouseDown.current, 10, 80)
        }
        mouseClick.current = false

        let change = false
        Tools['Eraser'].deleteList.current.forEach((v) => {
            for (let i = 0; i < graph.length; i++) {
                if (graph[i] === v) {
                    graph.splice(i, 1)
                }
            }
            change = true
        })
        if (change) {
            for (let i = 0; i < graph.length; i++) {
                graph[i].index = i
            }
            updateGraph(graph)
        }
        Tools['Eraser'].deleteList.current = []

    }, [props.tool, props.animationEnabled, graph, updateGraph, mouse.x, mouse.y, mouseDown, mouseClick, mouseOver])

    const canvasRef = useViewer(draw,
        (m) => {
            mouse = m
        },
        (c) => {
            mouseDown.current = c
            if (mouseDown.current) {
                mouseClick.current = true
            }
        },
        (o) => {
            mouseOver.current = o
        })

    return (
        <canvas ref={canvasRef} style={{cursor: cursor}}/>
    )
}

export default Viewer