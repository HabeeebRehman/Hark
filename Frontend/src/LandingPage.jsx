import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react'
import Logo from "./assets/logo.jpg"
import { Navigate } from 'react-router-dom'
function LandingPage() {
    return (
        <div className="fixed inset-0 overflow-hidden bg-black">
            {/* Static Shader Gradient Background */}
            <div className="absolute inset-0">
                <ShaderGradientCanvas
                    style={{
                        position: 'absolute',
                        inset: 0,
                        pointerEvents: 'none', // Prevent interaction with gradient
                        userSelect: 'none',    // Prevent text selection
                        touchAction: 'none'    // Prevent touch gestures
                    }}
                    pixelDensity={1}
                    fov={45}
                    zoomOut={false}
                >
                    <ShaderGradient
                        animate="on"
                        axesHelper="off"
                        brightness={1}
                        cAzimuthAngle={180}
                        cDistance={2.8}
                        cPolarAngle={80}
                        cameraZoom={9.1}
                        color1="#606080"
                        color2="#8d7dca"
                        color3="#212121"
                        destination="onCanvas"
                        embedMode="off"
                        envPreset="city"
                        format="gif"
                        frameRate={10}
                        gizmoHelper="hide"
                        grain="on"
                        lightType="3d"
                        pixelDensity={1}
                        positionX={0}
                        positionY={0}
                        positionZ={0}
                        range="disabled"
                        rangeEnd={40}
                        rangeStart={0}
                        reflection={0.1}
                        rotationX={50}
                        rotationY={0}
                        rotationZ={-60}
                        shader="defaults"
                        type="waterPlane"
                        uAmplitude={0}
                        uDensity={1.5}
                        uFrequency={0}
                        uSpeed={0.3}
                        uStrength={1.5}
                        uTime={8}
                        wireframe={false}
                        zoomOut={false}
                    />
                </ShaderGradientCanvas>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className="text-center text-white max-w-4xl mx-auto">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <img
                            src={Logo}
                            alt="Hark Logo"
                            className="w-32 h-32 object-contain"
                        />
                    </div>

                    {/* Main Title */}
                    {/* <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-100 via-gray-300 to-gray-500 bg-clip-text text-transparent">
                        Hark
                    </h1> */}

                    {/* Subtitle */}
                    <p className="text-xl md:text-2xl text-gray-300 mb-12 font-bold">
                        Know who owns the code — without leaving VS Code.

                    </p>

                    {/* Description */}
                    <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        HARK is an integrated web and VS Code solution designed to solve the problem of unclear code ownership in modern software projects. It allows managers to assign tasks and file ownership through a centralized dashboard, while developers see responsibilities, documentation, and context directly inside their editor. HARK improves collaboration, reduces unsafe changes, and preserves knowledge across teams.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a
                            href="/signup"
                            className="px-8 py-4 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                            Get Started
                        </a>
                    </div>

                    {/* Feature Highlights */}

                </div>
            </div>

            {/* Prevent zoom and scroll */}
            <style jsx>{`
        /* Prevent scroll */
        body {
          overflow: hidden;
          position: fixed;
          width: 100%;
          height: 100%;
        }
        
        /* Prevent pinch zoom */
        * {
          touch-action: none;
          -ms-touch-action: none;
        }
      `}</style>
        </div>
    )
}

export default LandingPage