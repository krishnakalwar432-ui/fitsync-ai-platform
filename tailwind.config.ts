import type { Config } from "tailwindcss";

// all in fixtures is set to tailwind v3 as interims solutions

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
  	extend: {
  		colors: {
  			// 3D Neon Color Palette
  			neon: {
  				cyan: '#06b6d4',
  				purple: '#8b5cf6',
  				pink: '#ec4899',
  				green: '#10b981',
  				orange: '#f59e0b',
  				red: '#ef4444',
  				blue: '#3b82f6'
  			},
  			glow: {
  				cyan: 'rgba(6, 182, 212, 0.5)',
  				purple: 'rgba(139, 92, 246, 0.5)',
  				pink: 'rgba(236, 72, 153, 0.5)'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			glass: {
  				primary: 'rgba(17, 25, 40, 0.75)',
  				secondary: 'rgba(17, 25, 40, 0.85)',
  				accent: 'rgba(6, 182, 212, 0.1)'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			'3xl': '1.5rem',
  			'4xl': '2rem'
  		},
  		// 3D Transform utilities
  		transformStyle: {
  			'preserve-3d': 'preserve-3d'
  		},
  		perspective: {
  			'500': '500px',
  			'1000': '1000px',
  			'1500': '1500px',
  			'2000': '2000px'
  		},
  		rotate: {
  			'x-12': 'rotateX(12deg)',
  			'x-45': 'rotateX(45deg)',
  			'y-12': 'rotateY(12deg)',
  			'y-45': 'rotateY(45deg)',
  			'z-12': 'rotateZ(12deg)'
  		},
  		boxShadow: {
  			'neon-cyan': '0 0 20px rgba(6, 182, 212, 0.5), 0 0 40px rgba(6, 182, 212, 0.3)',
  			'neon-purple': '0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.3)',
  			'neon-pink': '0 0 20px rgba(236, 72, 153, 0.5), 0 0 40px rgba(236, 72, 153, 0.3)',
  			'glass': '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  			'glass-hover': '0 12px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(6, 182, 212, 0.15)',
  			'3d': '0 10px 20px rgba(0, 0, 0, 0.3), 0 20px 40px rgba(0, 0, 0, 0.15)'
  		},
  		backdropBlur: {
  			'3xl': '64px'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			// 3D Animations
  			'float-3d': {
  				'0%, 100%': {
  					transform: 'translateY(0px) rotateX(0deg)'
  				},
  				'50%': {
  					transform: 'translateY(-20px) rotateX(10deg)'
  				}
  			},
  			'rotate-3d': {
  				'0%': {
  					transform: 'rotateX(0deg) rotateY(0deg)'
  				},
  				'50%': {
  					transform: 'rotateX(180deg) rotateY(180deg)'
  				},
  				'100%': {
  					transform: 'rotateX(360deg) rotateY(360deg)'
  				}
  			},
  			'neon-pulse': {
  				'0%, 100%': {
  					'box-shadow': '0 0 5px rgba(6, 182, 212, 0.5), 0 0 10px rgba(6, 182, 212, 0.3)'
  				},
  				'50%': {
  					'box-shadow': '0 0 20px rgba(6, 182, 212, 0.8), 0 0 30px rgba(6, 182, 212, 0.5), 0 0 40px rgba(139, 92, 246, 0.3)'
  				}
  			},
  			'gradient-shift': {
  				'0%, 100%': {
  					'background-position': '0% 50%'
  				},
  				'50%': {
  					'background-position': '100% 50%'
  				}
  			},
  			'particle-float': {
  				'0%': {
  					transform: 'translateY(0px) translateX(0px) rotate(0deg)',
  					opacity: '0'
  				},
  				'10%': {
  					opacity: '1'
  				},
  				'90%': {
  					opacity: '1'
  				},
  				'100%': {
  					transform: 'translateY(-100px) translateX(50px) rotate(360deg)',
  					opacity: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'float-3d': 'float-3d 3s ease-in-out infinite',
  			'rotate-3d': 'rotate-3d 8s linear infinite',
  			'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
  			'gradient-shift': 'gradient-shift 3s ease infinite',
  			'particle-float': 'particle-float 6s ease-out infinite'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
