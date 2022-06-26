import {useRef, useEffect, useState} from 'react'

function getWindowDimensions() {
    let { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

const useViewer = (draw, mouseListener, clickListener, overListener) => {

    const canvasRef = useRef(null)
    const frameCtr = useRef(0)

    useEffect(() => {

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        let frameID

        canvas.addEventListener("mousemove", (event) => {
            const rect = canvas.getBoundingClientRect(), // abs. size of element
                scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for x
                scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for y
            mouseListener({x: (event.clientX - rect.left) * scaleX, y: (event.clientY - rect.top) * scaleY})
        })
        canvas.addEventListener("mousedown", (event) => {
            clickListener(true)
        })
        canvas.addEventListener("mouseup", (event) => {
            clickListener(false)
        })
        canvas.addEventListener("mouseleave", (event) => {
            overListener(false)
        })
        canvas.addEventListener("mouseenter", (event) => {
            overListener(true)
        })

        const render = () => {
            frameCtr.current++
            const width = canvas.parentElement.offsetWidth-4 //TODO insanely stupid hack
            const height = canvas.parentElement.offsetHeight-4 //TODO insanely stupid hack
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width
                canvas.height = height
            }
            ctx.translate(0.5,0.5);
            draw(ctx, frameCtr.current)
            ctx.translate(-0.5,-0.5);
            frameID = window.requestAnimationFrame(render)
        }
        render()

        return () => {
            window.cancelAnimationFrame(frameID)
        }
    }, [clickListener, draw, frameCtr, mouseListener, overListener])

    return canvasRef
}

export default useViewer