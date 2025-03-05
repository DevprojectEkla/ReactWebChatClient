import { useEffect, useRef } from 'react';
import init from '../wasm/utils_wasm_lib';
import { start } from '../wasm/utils_wasm_lib';

export default function BevyCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        (async () => {
            try {
                await init(); // Initialize Bevy WebAssembly module
                start();
            } catch (error) {
                console.error('Failed to load Bevy WebAssembly:', error);
            }
        })();
    }, []);

    return <canvas ref={canvasRef} id='bevy-canvas' />;
}
