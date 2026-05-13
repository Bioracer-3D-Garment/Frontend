import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '@mui/material';
import { LogoutOutlined } from '@mui/icons-material';

interface NavbarProps {
  onLogout: () => void;
}

export function Navbar({ onLogout }: NavbarProps) {
  const router = useRouter();
  const isHomeActive = router.pathname === '/';
  const isAssetsActive = router.pathname === '/assets';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-8 flex items-center">
        <Link href="/" className="flex items-center gap-2 mr-12">
          <span className="inline-block w-1.5 h-7 bg-[#e2001a]" />
          <span className="font-extrabold tracking-[0.2em] text-black">BIORACER</span>
          <span className="font-light tracking-[0.2em] text-gray-500 text-sm">STUDIO</span>
        </Link>

        <nav className="flex items-center gap-8 flex-1">
          <Link
            href="/"
            className={`relative px-1 py-6 text-sm tracking-[0.15em] font-bold transition-colors ${
              isHomeActive ? 'text-black' : 'text-gray-500 hover:text-black'
            }`}
          >
            GENERATOR
            {isHomeActive && <span className="absolute left-0 right-0 bottom-0 h-0.75 bg-[#e2001a]" />}
          </Link>
          <Link
            href="/assets"
            className={`relative px-1 py-6 text-sm tracking-[0.15em] font-bold transition-colors ${
              isAssetsActive ? 'text-black' : 'text-gray-500 hover:text-black'
            }`}
          >
            ASSETS
            {isAssetsActive && <span className="absolute left-0 right-0 bottom-0 h-0.75 bg-[#e2001a]" />}
          </Link>
        </nav>

        <Button
          onClick={onLogout}
          startIcon={<LogoutOutlined />}
          className="!font-semibold tracking-widest !text-[#0a0a0a] transition-colors hover:!bg-transparent hover:!text-[#e2001a] [&_.MuiButton-startIcon]:!text-current [&_.MuiButton-startIcon_.MuiSvgIcon-root]:!text-current"
        >
          LOG OUT
        </Button>
      </div>
    </header>
  );
}