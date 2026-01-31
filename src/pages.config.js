import AIAnalysis from './pages/AIAnalysis';
import Home from './pages/Home';
import MarketOverview from './pages/MarketOverview';
import StockCategories from './pages/StockCategories';
import StockFormulas from './pages/StockFormulas';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AIAnalysis": AIAnalysis,
    "Home": Home,
    "MarketOverview": MarketOverview,
    "StockCategories": StockCategories,
    "StockFormulas": StockFormulas,
}

export const pagesConfig = {
    mainPage: "MarketOverview",
    Pages: PAGES,
    Layout: __Layout,
};