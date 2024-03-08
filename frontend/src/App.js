import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Layout/Header";
import Footer from "./Layout/Footer";
import Home from "./Home/Home";
import Websites from "./Websites/Websites";
import PbnLinks from "./PbnLinks/PbnLinks";
import Monitoring from "./Monitoring/Monitoring";

function App() {
  return (
    <Router>
      {/* Page Container */}
      <div
        id="page-container"
        className="mx-auto flex min-h-dvh w-full min-w-[320px] flex-col bg-gray-100 dark:bg-gray-900 dark:text-gray-100"
      >
        <Header />
        {/* Page Content */}
        <main id="page-content" className="flex max-w-full flex-auto flex-col">
          {/* Page Section */}
          <div className="container mx-auto p-4 lg:p-8 xl:max-w-7xl">
            {/*

            ADD YOUR MAIN CONTENT BELOW

            */}

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/websites" element={<Websites />} />
              <Route path="/pbn-links" element={<PbnLinks />} />
              <Route path="/monitoring" element={<Monitoring />} />
            </Routes>
            {/*

            ADD YOUR MAIN CONTENT ABOVE

            */}
          </div>
          {/* END Page Section */}
        </main>
        {/* END Page Content */}
        <Footer />
      </div>
      {/* END Page Container */}
    </Router>
  );
}

export default App;
