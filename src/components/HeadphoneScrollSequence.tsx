import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const frameCount = 80;

const HeadphoneScrollSequence: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const text1Ref = useRef<HTMLHeadingElement>(null);
    const text2Ref = useRef<HTMLDivElement>(null);
    const text3Ref = useRef<HTMLDivElement>(null);

    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [loaded, setLoaded] = useState(false);

    // Preload images
    useEffect(() => {
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];
            let loadedCount = 0;

            for (let i = 0; i < frameCount; i++) {
                const img = new Image();
                const indexStr = i.toString().padStart(3, '0');
                img.src = `/HeadPhone_Images/headphone_${indexStr}.jpg`;

                await new Promise((resolve) => {
                    img.onload = () => {
                        loadedImages.push(img);
                        loadedCount++;
                        if (loadedCount === frameCount) {
                            setImages(loadedImages);
                            setLoaded(true);
                        }
                        resolve(null);
                    };
                    img.onerror = () => resolve(null);
                });
            }
        };

        loadImages();
    }, []);

    // Setup GSAP animation on canvas and text
    useEffect(() => {
        if (!loaded || !canvasRef.current || !containerRef.current || images.length === 0) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        const render = (frameIndex: number) => {
            if (!images[frameIndex]) return;
            const img = images[frameIndex];
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width - img.width * scale) / 2;
            const y = (canvas.height - img.height * scale) / 2;

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, x, y, img.width * scale, img.height * scale);
        };

        render(0);

        const playhead = { frame: 0 };

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: '+=4000',
                pin: true,
                scrub: 0.5,
                onUpdate: () => render(Math.round(playhead.frame)),
            },
        });

        // 0 to 80 frames over the timeline duration
        tl.to(playhead, {
            frame: frameCount - 1,
            snap: 'frame',
            ease: 'none',
            duration: 10,
        }, 0);

        // Text animations synced with frames
        // Text 1 fades in from frame 5-15, stays, fades out 25-30
        if (text1Ref.current) {
            tl.to(text1Ref.current, { opacity: 1, y: 0, duration: 1 }, (10 / 80) * 10)
                .to(text1Ref.current, { opacity: 0, y: -20, duration: 1 }, (25 / 80) * 10);
        }

        // Text 2 fades in from frame 35-45, fades out 55-60
        if (text2Ref.current) {
            tl.to(text2Ref.current, { opacity: 1, y: 0, duration: 1 }, (35 / 80) * 10)
                .to(text2Ref.current, { opacity: 0, y: -20, duration: 1 }, (55 / 80) * 10);
        }

        // Text 3 fades in from frame 65-75
        if (text3Ref.current) {
            tl.to(text3Ref.current, { opacity: 1, scale: 1, duration: 1 }, (65 / 80) * 10);
        }

        const handleResize = () => render(Math.round(playhead.frame));
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            ScrollTrigger.getAll().forEach((st) => st.kill());
        };
    }, [loaded, images]);

    return (
        <section ref={containerRef} className="relative w-full h-screen bg-background overflow-hidden">
            {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-background z-50">
                    <div className="flex flex-colItems-center gap-4">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-primary font-heading tracking-widest uppercase text-sm mt-4 text-glow">Loading System...</p>
                    </div>
                </div>
            )}
            <canvas
                ref={canvasRef}
                className="w-full h-full block object-cover"
            />

            <div className="absolute inset-0 pointer-events-none">
                {/* Text 1: Left aligned */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full px-10 lg:px-32 flex justify-start">
                    <div ref={text1Ref} className="opacity-0 translate-y-10 max-w-xl">
                        <p className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-4 text-shadow">
                            Spatial Audio Technology
                        </p>
                        <h2 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] text-foreground text-shadow-lg">
                            Hear
                            <br />
                            the <span className="text-gradient-cyan text-glow">Unseen.</span>
                        </h2>
                    </div>
                </div>

                {/* Text 2: Right aligned */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full px-10 lg:px-32 flex justify-end">
                    <div ref={text2Ref} className="opacity-0 translate-y-10 max-w-xl text-right glass-strong p-8 rounded-2xl border-glow">
                        <p className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-4 text-shadow">
                            Aerospace Grade
                        </p>
                        <h2 className="text-foreground text-4xl lg:text-6xl font-heading font-bold mb-4">
                            Engineered for <br /> <span className="text-muted-foreground">Comfort.</span>
                        </h2>
                        <p className="text-muted-foreground font-body text-lg">
                            Crafted with titanium and premium memory foam to sit virtually weightless on your head.
                        </p>
                    </div>
                </div>

                {/* Text 3: Center aligned */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full px-10 lg:px-32 flex justify-center">
                    <div ref={text3Ref} className="opacity-0 scale-90 text-center flex flex-col items-center">
                        <h2 className="text-foreground text-5xl lg:text-7xl font-heading font-bold mb-8">
                            The <span className="text-gradient-cyan text-glow">Future</span> of Audio
                        </h2>
                        <button
                            onClick={() => document.getElementById("preorder")?.scrollIntoView({ behavior: "smooth" })}
                            className="pointer-events-auto px-8 py-4 rounded-full bg-primary text-primary-foreground font-heading font-semibold text-base glow-cyan hover:glow-cyan-strong transition-all duration-300 hover:scale-105"
                        >
                            Pre-Order Now
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeadphoneScrollSequence;
