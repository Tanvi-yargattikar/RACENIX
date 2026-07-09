import re
import os

filepath = 'frontend/landing.css'
with open(filepath, 'r', encoding='utf-8') as f:
    css = f.read()

root_replacement = """
:root {
    --brand-blue: #00D2FF;
    --brand-blue-glow: rgba(0, 210, 255, 0.4);
    --brand-red: #E10600;
    --brand-red-dark: #b10500;
    --brand-red-glow: rgba(225, 6, 0, 0.4);
    --brand-yellow: #FFD000;
    --brand-yellow-glow: rgba(255, 208, 0, 0.4);
    --brand-green: #00FFAA;
    --brand-green-glow: rgba(0, 255, 170, 0.4);
    
    --bg-black: #0A0A0A;
    --bg-dark-grey: #121212;
    --bg-cool-tint: #0F1720;
    
    --text-white: #E6E6E6;
    --text-dim: #A0A0A0;
    --glass-bg: rgba(255, 255, 255, 0.03);
    --glass-border: rgba(255, 255, 255, 0.08);
}
"""

# Replace root variables
css = re.sub(r':root\s*\{.*?(?=\n\* \{)', root_replacement.strip() + '\n\n', css, flags=re.DOTALL)

# Replace old variables directly to new specific ones
css = css.replace('--f1-red-glow', '--brand-blue-glow')
css = css.replace('--f1-red-dark', '--brand-blue')
css = css.replace('--f1-red', '--brand-blue')

css = css.replace('--f1-blue-glow', '--brand-red-glow')
css = css.replace('--f1-blue', '--brand-red')
css = css.replace('--f1-yellow-glow', '--brand-yellow-glow')
css = css.replace('--f1-yellow', '--brand-yellow')
css = css.replace('--f1-green-glow', '--brand-green-glow')
css = css.replace('--f1-green', '--brand-green')

css = css.replace('--text-white', '--text-white') # keeps same name but value changed in root

# Make specific manual adjustments for backgrounds and text
css = re.sub(r'\.blob-1\s*\{[^\}]*\}', '.blob-1 { width: 60vw; height: 60vw; background: radial-gradient(circle, var(--brand-blue-glow) 0%, transparent 70%); top: -20%; left: -10%; animation-delay: 0s; }', css)
css = re.sub(r'\.blob-2\s*\{[^\}]*\}', '.blob-2 { width: 50vw; height: 50vw; background: radial-gradient(circle, var(--bg-cool-tint) 0%, transparent 70%); bottom: -20%; right: -10%; animation-duration: 25s; animation-delay: -5s; }', css)
css = re.sub(r'\.blob-3\s*\{[^\}]*\}', '.blob-3 { width: 80vw; height: 80vw; background: radial-gradient(circle, rgba(225, 6, 0, 0.05) 0%, transparent 70%); top: 50%; left: 50%; transform: translate(-50%, -50%); animation-duration: 30s; animation-delay: -10s; }', css)

# Make buttons Red explicitly since everything else f1-red turned into brand-blue
css = css.replace('.nav-cta {\n    background: var(--brand-blue);', '.nav-cta {\n    background: var(--brand-red);')
css = css.replace('border: 1px solid var(--brand-blue);', 'border: 1px solid var(--brand-blue);') # keep it blue if it was blue? wait, we changed f1-red to brand-blue.
# the original nav-cta had: background: var(--f1-red); border: 1px solid var(--f1-red);
# It was translated to var(--brand-blue). Let's fix .nav-cta entirely
nav_cta_replacement = """
.nav-cta {
    background: var(--brand-red);
    color: white !important;
    padding: 0.6rem 1.4rem;
    border-radius: 4px;
    font-size: 0.65rem !important;
    font-family: 'Orbitron', sans-serif;
    transition: all 0.3s ease !important;
    border: 1px solid var(--brand-red);
    animation: buttonPulse 2s infinite;
}

.nav-cta:hover {
    background: transparent;
    border-color: var(--brand-blue);
    transform: scale(1.05);
    box-shadow: 0 0 20px var(--brand-blue-glow), 0 0 30px var(--brand-blue) !important;
}
"""
css = re.sub(r'\.nav-cta\s*\{[\s\S]*?\}\s*\.nav-cta:hover\s*\{[\s\S]*?\}', nav_cta_replacement.strip(), css)

btn_primary_replacement = """
.btn-primary {
    background: var(--brand-red);
    color: white;
    text-decoration: none;
    padding: 1.25rem 2.5rem;
    font-family: 'Orbitron', sans-serif;
    font-weight: 900;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: all 0.3s ease;
    border: 1px solid var(--brand-red);
}

.btn-primary:hover {
    transform: translateY(-5px);
    background: transparent;
    box-shadow: 0 10px 40px var(--brand-blue-glow);
    border-color: var(--brand-blue);
}
"""
css = re.sub(r'\.btn-primary\s*\{[\s\S]*?\}\s*\.btn-primary:hover\s*\{[\s\S]*?\}', btn_primary_replacement.strip(), css)

# Gradient Shift for heading
# Original had gradient logic involving --f1-red, --f1-blue. Currently it reads:
# var(--brand-blue) 0%, var(--brand-red) 40%, var(--brand-yellow) 80%, var(--brand-blue) 100%
# Which isn't bad! But the user said "blue -> red for key headings"
css = css.replace('linear-gradient(90deg, var(--brand-blue) 0%, var(--brand-red) 40%, var(--brand-yellow) 80%, var(--brand-blue) 100%)', 'linear-gradient(90deg, var(--brand-blue) 0%, var(--brand-red) 50%, var(--brand-blue) 100%)')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(css)

print('Updated successfully')
