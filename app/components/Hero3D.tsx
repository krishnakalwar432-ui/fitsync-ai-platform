"use client"

import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Float, Sphere, Box, Torus, Environment, Effects, Sparkles } from '@react-three/drei'
import { Button } from '@/components/ui/button'
import { Play, Zap, Target, TrendingUp, Award } from 'lucide-react'
import * as THREE from 'three'

// 3D Fitness Equipment Components
function Dumbbell({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.2
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
  })

  return (
    <group ref={ref} position={position}>
      {/* Dumbbell Handle */}
      <Box args={[1.5, 0.1, 0.1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#e5e7eb" metalness={0.8} roughness={0.2} />
      </Box>
      {/* Left Weight */}
      <Box args={[0.3, 0.4, 0.4]} position={[-0.6, 0, 0]}>
        <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
      </Box>
      {/* Right Weight */}
      <Box args={[0.3, 0.4, 0.4]} position={[0.6, 0, 0]}>
        <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
      </Box>
    </group>
  )
}

function Kettlebell({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.7) * 0.1
    ref.current.position.y = position[1] + Math.cos(state.clock.elapsedTime * 0.3) * 0.15
  })

  return (
    <group ref={ref} position={position}>
      {/* Base */}
      <Sphere args={[0.3]} position={[0, -0.2, 0]}>
        <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
      </Sphere>
      {/* Handle */}
      <Torus args={[0.15, 0.03]} position={[0, 0.1, 0]} rotation={[0, 0, 0]}>
        <meshStandardMaterial color="#6b7280" metalness={0.8} roughness={0.2} />
      </Torus>
    </group>
  )
}

function PulsatingOrb({ position = [0, 0, 0], color = "#06b6d4" }: { position?: [number, number, number], color?: string }) {
  const ref = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2
    ref.current.scale.setScalar(scale)
    ref.current.rotation.y += 0.01
  })

  return (
    <Sphere ref={ref} args={[0.1]} position={position}>
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={0.5}
        transparent
        opacity={0.8}
      />
    </Sphere>
  )
}

function Scene3D() {
  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#06b6d4" />
      <pointLight position={[-10, 5, 5]} intensity={0.8} color="#8b5cf6" />
      <spotLight position={[0, 15, 0]} angle={0.3} penumbra={1} intensity={1} color="#ec4899" />
      
      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
        <Dumbbell position={[-3, 0, 0]} />
      </Float>
      
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
        <Kettlebell position={[3, 0, 0]} />
      </Float>
      
      {/* Floating Energy Orbs */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <PulsatingOrb position={[-2, 2, -1]} color="#06b6d4" />
      </Float>
      <Float speed={1.8} rotationIntensity={1} floatIntensity={1.2}>
        <PulsatingOrb position={[2, -1, -1]} color="#8b5cf6" />
      </Float>
      <Float speed={2.2} rotationIntensity={1} floatIntensity={0.8}>
        <PulsatingOrb position={[0, 3, -2]} color="#ec4899" />
      </Float>
      
      {/* 3D Text */}
      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <Text
          position={[0, 1.5, -3]}
          fontSize={0.8}
          color="#06b6d4"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          FitSync AI
        </Text>
      </Float>
      
      {/* Sparkles Effect */}
      <Sparkles count={50} scale={[10, 10, 10]} size={2} speed={0.4} color="#06b6d4" />
      
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </>
  )
}

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: {
  icon: any
  title: string
  description: string
  delay?: number
}) => (
  <div 
    className="card-3d glass-card p-6 hover:shadow-neon-cyan group cursor-pointer"
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="flex items-center space-x-3 mb-4">
      <div className="p-3 rounded-xl bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 group-hover:from-neon-cyan/30 group-hover:to-neon-purple/30 transition-all duration-300">
        <Icon className="h-6 w-6 text-neon-cyan group-hover:scale-110 transition-transform duration-300" />
      </div>
      <h3 className="text-xl font-semibold text-neon-gradient">{title}</h3>
    </div>
    <p className="text-gray-300 leading-relaxed">{description}</p>
    <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/0 via-neon-purple/0 to-neon-pink/0 group-hover:from-neon-cyan/5 group-hover:via-neon-purple/5 group-hover:to-neon-pink/5 rounded-xl transition-all duration-500 pointer-events-none" />
  </div>
)

export default function Hero3D() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden particles-bg">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        </Canvas>
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-slideInLeft">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="text-neon-gradient animate-gradient">Transform</span>
                <br />
                <span className="text-white">Your Fitness</span>
                <br />
                <span className="text-neon-gradient animate-gradient">Journey</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                Experience the future of fitness with AI-powered workouts, 
                personalized nutrition plans, and real-time progress tracking.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className="btn-neon-primary px-8 py-4 text-lg font-semibold hover-lift-3d group relative overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Play className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                Start Your Journey
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Button>
              
              <Button
                variant="outline"
                className="px-8 py-4 text-lg font-semibold border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 hover-lift group"
              >
                <Zap className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                Explore Features
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center group cursor-pointer hover-lift">
                <div className="text-3xl font-bold text-neon-cyan mb-1 group-hover:scale-110 transition-transform duration-300">1M+</div>
                <div className="text-sm text-gray-400">Workouts Completed</div>
              </div>
              <div className="text-center group cursor-pointer hover-lift">
                <div className="text-3xl font-bold text-neon-purple mb-1 group-hover:scale-110 transition-transform duration-300">50K+</div>
                <div className="text-sm text-gray-400">Happy Users</div>
              </div>
              <div className="text-center group cursor-pointer hover-lift">
                <div className="text-3xl font-bold text-neon-pink mb-1 group-hover:scale-110 transition-transform duration-300">24/7</div>
                <div className="text-sm text-gray-400">AI Support</div>
              </div>
            </div>
          </div>
          
          {/* Right Content - Feature Cards */}
          <div className="space-y-6 animate-slideInRight">
            <FeatureCard
              icon={Target}
              title="AI-Powered Workouts"
              description="Get personalized workout plans that adapt to your fitness level and goals using advanced machine learning."
              delay={0.2}
            />
            <FeatureCard
              icon={TrendingUp}
              title="Smart Progress Tracking"
              description="Monitor your journey with detailed analytics, body composition analysis, and performance metrics."
              delay={0.4}
            />
            <FeatureCard
              icon={Award}
              title="Achievement System"
              description="Stay motivated with challenges, badges, and community leaderboards that celebrate your progress."
              delay={0.6}
            />
          </div>
        </div>
      </div>
      
      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-20">
        <Button
          className="w-16 h-16 rounded-full btn-neon-primary hover-lift-3d shadow-neon-cyan group"
          size="icon"
        >
          <Zap className="h-6 w-6 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
        </Button>
      </div>
    </section>
  )
}