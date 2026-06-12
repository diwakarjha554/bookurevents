"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

export default function SmoothScroll({ children }: { children: ReactNode }) {
    return (
        <ReactLenis
            root
            options={{
                lerp: 0.09,
                duration: 1.2,
                smoothWheel: true,
                wheelMultiplier: 1,
                touchMultiplier: 1.6,
                // smooth-scroll to in-page anchors, clearing the fixed header
                anchors: { offset: -90, duration: 1.4 },
            }}
        >
            {children}
        </ReactLenis>
    );
}
