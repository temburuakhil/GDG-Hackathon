
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
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
				},
				water: {
					DEFAULT: '#0EA5E9', // sky-500
					light: '#BAE6FD', // sky-200
					dark: '#0369A1' // sky-700
				},
				farmer: {
					DEFAULT: '#5C832F', // forest green
					light: '#8CAC67', // light forest green
					dark: '#3E5920' // dark forest green
				},
				education: {
					DEFAULT: '#8B4513', // saddle brown
					light: '#A6753C', // light saddle brown
					dark: '#5F2F0D' // dark saddle brown
				},
				health: {
					DEFAULT: '#EF4444', // red-500
					light: '#FECACA', // red-200
					dark: '#B91C1C' // red-700
				},
				resource: {
					DEFAULT: '#78552B', // rustic brown
					light: '#9E7E52', // light rustic brown
					dark: '#523A1D' // dark rustic brown
				},
				climate: {
					DEFAULT: '#10B981', // emerald-500
					light: '#A7F3D0', // emerald-200
					dark: '#047857' // emerald-700
				},
				gender: {
					DEFAULT: '#EC4899', // pink-500
					light: '#FBCFE8', // pink-200
					dark: '#BE185D' // pink-700
				},
				rural: {
					green: '#5C832F',
					brown: '#8B4513',
					darkBg: '#1A1A1A',
					lightBg: '#F4F1DE',
					accent: '#78552B',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'fade-up': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-down': {
					'0%': { opacity: '0', transform: 'translateY(-20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-left': {
					'0%': { opacity: '0', transform: 'translateX(20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'fade-right': {
					'0%': { opacity: '0', transform: 'translateX(-20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'scale-in': {
					'0%': { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				'scale-out': {
					'0%': { opacity: '1', transform: 'scale(1)' },
					'100%': { opacity: '0', transform: 'scale(0.95)' }
				},
				'pulse-slow': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				'bounce-subtle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'pulse-ring': {
					'0%': { transform: 'scale(0.8)', opacity: '0.5' },
					'80%, 100%': { transform: 'scale(1.7)', opacity: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.7s ease-out forwards',
				'fade-up': 'fade-up 0.8s ease-out forwards',
				'fade-down': 'fade-down 0.8s ease-out forwards',
				'fade-left': 'fade-left 0.8s ease-out forwards',
				'fade-right': 'fade-right 0.8s ease-out forwards',
				'scale-in': 'scale-in 0.6s ease-out forwards',
				'scale-out': 'scale-out 0.6s ease-out forwards',
				'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
				'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
				'float': 'float 4s ease-in-out infinite',
				'pulse-ring': 'pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite'
			},
			fontFamily: {
				sans: ['Inter var', 'Inter', 'sans-serif'],
				display: ['Merriweather', 'serif'],
				body: ['Open Sans', 'sans-serif'],
				mono: ['JetBrains Mono', 'monospace']
			},
			backdropFilter: {
				'none': 'none',
				'blur': 'blur(20px)'
			},
			boxShadow: {
				'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
				'glass-hover': '0 8px 32px 0 rgba(31, 38, 135, 0.13)',
				'neobrut': '0.3rem 0.3rem 0 rgba(0, 0, 0, 0.95)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
