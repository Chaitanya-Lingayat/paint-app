import './App.css';
import WhiteBoard from './WhiteBoard';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
      </header>
      <div className="canvas">
        <WhiteBoard />
      </div>
    </div>
  );
}

export default App;
