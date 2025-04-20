import { TicTacToe } from "./components/ticTacToe/TicTacToe";
import styles from './App.module.css'
function App() {
  return (
    <section className={styles.container}>
      <TicTacToe />
    </section>
  );
}

export default App;
