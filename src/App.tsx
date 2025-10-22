import { Routes, Route } from 'react-router-dom'; 
import Home from './pages/Home';
import InputArticle from './pages/InputArticle';
import Results from './pages/Results';
import RecentSummariesList from './pages/RecentSummariesList';


function App() {
  return (
    <Routes>
      <Route path="/" element={ <Home /> } />
      <Route path='InputArticle' element={ <InputArticle /> } />
      <Route path='RecentSummariesList' element={ <RecentSummariesList />} />
      <Route path='Results' element={ <Results /> } />
    </Routes>
  )
}

export default App
