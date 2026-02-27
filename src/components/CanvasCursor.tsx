import React from 'react';
import useCanvasCursor from '../hooks/use-canvasCursor';

const CanvasCursor: React.FC = () => {
    useCanvasCursor();

    // Added z-index to ensure it sits above other canvas elements but below interactive components if needed
    return <canvas className="pointer-events-none fixed inset-0 z-50" id="canvas" />;
};

export default CanvasCursor;
