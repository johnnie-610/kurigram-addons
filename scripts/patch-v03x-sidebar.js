/**
 * Patches the v0.3.x Sidebar.tsx for versioned docs deployment.
 * Run from project root: node scripts/patch-v03x-sidebar.js
 */
const fs = require('fs');
const file = 'docs/src/components/Sidebar.tsx';
let src = fs.readFileSync(file, 'utf8');

// 1. Inject stripBase helper before hasActiveChild
src = src.replace(
  'function hasActiveChild',
  `function stripBase(pathname) {
  const base = (import.meta.env.BASE_URL || '/').replace(/\\/$/, '');
  return base && pathname.startsWith(base)
    ? pathname.slice(base.length) || '/'
    : pathname;
}

function hasActiveChild`
);

// 2. Fix hasActiveChild to use stripBase
src = src.replace(
  'c.href === pathname',
  'c.href === stripBase(pathname)'
);

// 3. Fix isActive to use stripBase
src = src.replace(
  'location.pathname === props.item.href',
  'stripBase(location.pathname) === props.item.href'
);

// 4. Replace VERSIONS array
src = src.replace(
  /const VERSIONS = \[[\s\S]*?\];/,
  `const VERSIONS = [
  { label: "v0.4.1 (latest)", path: "/kurigram-addons/v0.4/" },
  { label: "v0.3.x", path: "/kurigram-addons/" },
];`
);

// 5. Replace currentVersion to use path matching
src = src.replace(
  /const currentVersion = \(\) => VERSIONS\.find\(\(v\) => v\.latest\)!;/,
  `const currentVersion = () => {
  if (typeof window === 'undefined') return VERSIONS[1];
  const p = window.location.pathname;
  return VERSIONS.find(v => p.startsWith(v.path)) || VERSIONS[1];
};`
);

// 6. Replace button-based dropdown with anchor links
src = src.replace(
  /<For each=\{VERSIONS\}>[\s\S]*?<\/For>/,
  `<For each={VERSIONS}>
              {(ver) => (
                <a
                  href={ver.path}
                  class="block w-full text-left px-3 py-1.5 text-[0.7rem] font-mono transition-colors"
                  classList={{
                    "text-amber-400 bg-amber-500/10": ver.path === currentVersion().path,
                    "text-slate-400 hover:text-amber-300 hover:bg-white/5": ver.path !== currentVersion().path,
                  }}
                >
                  {ver.label}
                </a>
              )}
            </For>`
);

fs.writeFileSync(file, src);
console.log('✅ Patched v0.3.x Sidebar.tsx (stripBase + version switcher)');
