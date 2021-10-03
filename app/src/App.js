import "./App.css";

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <a href='/empty' class='block relative'>
          <img
            alt='profil'
            src=''
            class='mx-auto object-cover rounded-full h-16 w-16 '
          />
        </a>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'>
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
