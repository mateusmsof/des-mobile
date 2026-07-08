import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import CampaignDashboard from './pages/CampaignDashboard';
import CreateCampaign from './pages/CreateCampaign';
import Operational from './pages/Operational';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />, 
        children: [
            { index: true, element: <CampaignDashboard /> }, 
            { path: "create-campaign", element: <CreateCampaign /> },
            { path: "campaigns", element: <CampaignDashboard /> }, 
        ]
    },
    { path: "operational", element: <Operational /> }
]);

export default router;