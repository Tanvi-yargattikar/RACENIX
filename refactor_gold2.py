import re

filepath = 'frontend/landing.css'
with open(filepath, 'r', encoding='utf-8') as f:
    css = f.read()

root_replacement = """
:root {
    --brand-gold: #D4AF37;
    --brand-gold-light: #F5D97B;
    --brand-gold-glow: rgba(212, 175, 55, 0.4);
    
    --brand-silver: #C0C0C0;
    --brand-silver-light: #E5E5E5;
    --brand-silver-glow: rgba(192, 192, 192, 0.2);

    --bg-black: #0A0A0A;
    --bg-dark-grey: #121212;
    --bg-cool-tint: #181818;
    
    --text-white: #E5E5E5;
    --text-dim: #A0A0A0;
    --glass-bg: rgba(255, 255, 255, 0.03);
    --glass-border: rgba(212, 175, 55, 0.15);
}
"""

css = re.sub(r':root\s*\{.*?(?=\n\* \{)', root_replacement.strip() + '\n\n', css, flags=re.DOTALL)

# Map old variables directly from original to Gold/Silver
# Since the original is f1-red/f1-blue, we map them directly to our new theme.
# Primary Accent (Red) -> Gold
css = css.replace('--f1-red-glow', '--brand-gold-glow')
css = css.replace('--f1-red-dark', '--brand-gold')
css = css.replace('--f1-red', '--brand-gold')

# Secondary Accent (Blue) -> Silver
css = css.replace('--f1-blue-glow', '--brand-silver-glow')
css = css.replace('--f1-blue', '--brand-silver')

css = css.replace('--f1-yellow-glow', '--brand-gold-glow')
css = css.replace('--f1-yellow', '--brand-gold')

css = css.replace('--f1-green-glow', '--brand-silver-glow')
css = css.replace('--f1-green', '--brand-silver')

css = css.replace('--text-white', '--text-white')

# Background mesh gradient fixes
css = re.sub(r'\.blob-1\s*\{[^\}]*\}', '.blob-1 { width: 60vw; height: 60vw; background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%); top: -20%; left: -10%; animation-delay: 0s; }', css)
css = re.sub(r'\.blob-2\s*\{[^\}]*\}', '.blob-2 { width: 50vw; height: 50vw; background: radial-gradient(circle, rgba(192, 192, 192, 0.05) 0%, transparent 70%); bottom: -20%; right: -10%; animation-duration: 25s; animation-delay: -5s; }', css)
css = re.sub(r'\.blob-3\s*\{[^\}]*\}', '.blob-3 { width: 80vw; height: 80vw; background: radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%); top: 50%; left: 50%; transform: translate(-50%, -50%); animation-duration: 30s; animation-delay: -10s; }', css)

# Make buttons sleek dark with gold border
nav_cta_replacement = """
.nav-cta {
    background: rgba(10, 10, 10, 0.8);
    color: var(--brand-gold) !important;
    padding: 0.6rem 1.4rem;
    border-radius: 4px;
    font-size: 0.65rem !important;
    font-family: 'Orbitron', sans-serif;
    transition: all 0.3s ease !important;
    border: 1px solid var(--brand-gold);
    box-shadow: 0 0 10px var(--brand-gold-glow);
}

.nav-cta:hover {
    background: var(--brand-gold);
    color: var(--bg-black) !important;
    border-color: var(--brand-gold-light);
    transform: scale(1.05);
    box-shadow: 0 0 20px var(--brand-gold-glow), 0 0 30px var(--brand-gold-light) !important;
}
"""
css = re.sub(r'\.nav-cta\s*\{[\s\S]*?\}\s*\.nav-cta:hover\s*\{[\s\S]*?\}', nav_cta_replacement.strip(), css)

btn_primary_replacement = """
.btn-primary {
    background: rgba(10, 10, 10, 0.8);
    color: var(--brand-gold);
    text-decoration: none;
    padding: 1.25rem 2.5rem;
    font-family: 'Orbitron', sans-serif;
    font-weight: 900;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: all 0.3s ease;
    border: 1px solid var(--brand-gold);
    box-shadow: 0 0 15px var(--brand-gold-glow);
}

.btn-primary:hover {
    transform: translateY(-5px);
    background: var(--brand-gold);
    color: var(--bg-black);
    box-shadow: 0 10px 40px var(--brand-gold-glow);
    border-color: var(--brand-gold-light);
}
"""
css = re.sub(r'\.btn-primary\s*\{[\s\S]*?\}\s*\.btn-primary:hover\s*\{[\s\S]*?\}', btn_primary_replacement.strip(), css)

# Text Gradient replacements for "DECODED"
css = css.replace('linear-gradient(90deg, var(--brand-gold) 0%, var(--brand-silver) 40%, var(--brand-gold) 80%, var(--brand-gold) 100%)', 'linear-gradient(90deg, var(--brand-gold) 0%, var(--brand-gold-light) 50%, var(--brand-gold) 100%)')

# Vignette overlay depth
css = css.replace('radial-gradient(circle at center, transparent 30%, #0A0A0A 100%)', 'radial-gradient(circle at center, transparent 20%, #0A0A0A 100%)')

# Neon Cyan glitch removal
css = css.replace('text-shadow: -2px 0 #00ffff;', 'text-shadow: -2px 0 var(--brand-gold);')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(css)

print('Updated successfully')
