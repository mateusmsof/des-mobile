import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import CampaignDashboard from './pages/CampaignDashboard';
import CreateCampaign from './pages/CreateCampaign';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />, 
        children: [
            { index: true, element: <CampaignDashboard /> }, 
            { path: "create-campaign", element: <CreateCampaign /> },
            { path: "campaigns", element: <CampaignDashboard /> }, 
        ]
    }
]);

export default router;