import './App.css'
import ComboBuilder from './components/combo/ComboBuilder.jsx'
import ProductCatalog from './components/catalog/ProductCatalog.jsx'
import Header from './components/layout/Header.jsx'
import PresetList from './components/presets/PresetList.jsx'
import { ComboProvider } from './context/ComboContext.jsx'
import { PresetsProvider } from './context/PresetsContext.jsx'

function App() {
  return (
    <PresetsProvider>
      <ComboProvider>
        <div className="layout">
          <Header />
          <main className="main">
            <div className="mainColumn">
              <PresetList />
              <ProductCatalog />
            </div>
            <ComboBuilder />
          </main>
        </div>
      </ComboProvider>
    </PresetsProvider>
  )
}

export default App
