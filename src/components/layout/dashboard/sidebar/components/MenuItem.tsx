import { Link, useLocation } from 'react-router-dom';
import { ActiveMenuSvg } from 'src/components/icons';

interface IMenuItem {
  link: string;
  label: string;
  icon: React.ReactNode;
}

function MenuItem({ link, label, icon }: Partial<IMenuItem>) {
  const { pathname } = useLocation();
  const active = pathname === link;

  return (
    <div className={'menu-item ' + (active ? 'menu-item-active' : '')}>
      <Link to={link || ''} className="menu-item-content">
        {/* Main menu item */}
        <div className={`menu-item-icon ${active && 'menu-item-icon-active'}`}>
          {icon}
        </div>

        <div className="menu-item-text">{label}</div>
      </Link>

      {active && (
        <div className="menu-item-active-icon">
          <ActiveMenuSvg />
        </div>
      )}
    </div>
  );
}

export default MenuItem;
