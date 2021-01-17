import './App.css';
import 'semantic-ui-css/semantic.min.css'

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './pages/Home';
import NotFound from './NotFound'

import { RecoilRoot } from 'recoil'
import ReactGA from 'react-ga';

const gaid = process.env.REACT_APP_GA_UNIVERSAL_ID;
if (gaid) {
  ReactGA.initialize(gaid || '');
  ReactGA.pageview(window.location.pathname + window.location.search);
}

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
