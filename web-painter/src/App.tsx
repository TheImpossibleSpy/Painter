import { Toolbar } from './components/Toolbar';
import { PropertyBar } from './components/PropertyBar';
import { LayerPanel } from './components/LayerPanel';
import { Workspace } from './components/Workspace';
import { Header } from './components/Header';

function App() {
  return (
    <div className="flex h-screen w-screen flex-col bg-gray-900 text-white overflow-hidden">
      <Header />
      <PropertyBar />
      <div className="flex flex-1 overflow-hidden">
        <Toolbar />
        <Workspace />
        <LayerPanel />
      </div>
    </div>
  );
}

export default App;
