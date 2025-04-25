import { Outlet } from 'react-router-dom';
import './layout.scss';
import LayoutSidebar from './sidebar';

function Dashboard() {
  return (
    <div className="layout">
      <LayoutSidebar />
      <div className="layout-right">
        <div className="layout-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
