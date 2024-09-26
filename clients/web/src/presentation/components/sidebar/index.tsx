import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { userSignOut } from '@client-commons/services/awsAuth';
import { LoginPath } from '../../../constants/routeConsts';
import SidebarLink from './SidebarLink';
import {
  FaMoon,
  FaSun,
  MdDashboard,
  MdSettings,
  MdLogout,
} from '../../assets/icons';

type SidebarProps = {
  sidebarExpanded: boolean;
  onToggle: (isExpanded: boolean) => void;
  theme: string;
  toggleTheme: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({
  sidebarExpanded,
  onToggle,
  theme,
  toggleTheme,
}) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const sidebar = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
    onToggle(sidebarExpanded);
  }, [sidebarExpanded, onToggle]);

  const handleSignOut = async () => {
    await userSignOut();
    navigate(LoginPath);
  };

  return (
    <aside
      ref={sidebar}
      className={`flex flex-col shadow-xl transition-all duration-300 ${
        sidebarExpanded
          ? 'w-[var(--sidebar-expanded-width)]'
          : 'w-[var(--sidebar-collapsed-width)]'
      }`}
    >
      <div className="flex p-1">
        <button
          type="button"
          className="cursor-pointer"
          onClick={() => {
            onToggle(!sidebarExpanded);
          }}
          aria-label="Toggle Sidebar"
        >
          <img
            src="/blood-connect-icon.svg"
            alt="Blood Connect Logo"
            className="w-12 h-12"
          />
        </button>
      </div>

      <div className="no-scrollbar flex flex-col">
        <nav className="p-2">
          <ul className="mb-6 flex flex-col gap-1.5">
            <SidebarLink
              to="/dashboard"
              icon={<MdDashboard size={24} />}
              label="Dashboard"
              active={pathname.includes('dashboard')}
              sidebarExpanded={sidebarExpanded}
            />
            <SidebarLink
              to="/profile"
              icon={<MdSettings size={24} />}
              label="Profile"
              active={pathname.includes('profile')}
              sidebarExpanded={sidebarExpanded}
            />
          </ul>
        </nav>
      </div>

      <div className="no-scrollbar flex flex-col mt-auto">
        <nav className="p-2">
          <ul className="mb-3 flex flex-col gap-1.5">
            <SidebarLink
              icon={
                theme === 'light' ? <FaSun size={24} /> : <FaMoon size={24} />
              }
              label={theme === 'light' ? 'Light' : 'Dark'}
              sidebarExpanded={sidebarExpanded}
              onClick={toggleTheme}
            />
            <SidebarLink
              icon={<MdLogout size={24} />}
              label="Logout"
              sidebarExpanded={sidebarExpanded}
              onClick={() => {
                void handleSignOut();
              }}
            />
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
