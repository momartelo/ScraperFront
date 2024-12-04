import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage";
import NotFoundPage from "./Pages/NotFoundPage/NotFoundPage";
import ScrapeECONPage from "./Pages/ScrapeECONPage/ScrapeECONPage";
import ScrapeMLSearchPage from "./Pages/ScrapeMLSearchPage/ScrapeMLSearchPage";
import CementosPage from "./Pages/CementosPage/CementosPage";
import DataPage from "./Pages/DataPage/DataPage";
import HormigonPage from "./Pages/HormigonPage/HormigonPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/pageECON" element={<ScrapeECONPage />} />
      <Route path="/pageMLSearch" element={<ScrapeMLSearchPage />} />
      <Route path="/cementos" element={<CementosPage />} />
      <Route path="/hormigon" element={<HormigonPage />} />
      <Route path="/graficos/:category" element={<DataPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRouter;
