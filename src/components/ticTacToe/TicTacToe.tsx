import Lottie from "lottie-react";
import { memo, useEffect, useState } from "react";
import gridAnimationData from "../../assets/animations/grid.json";
import circleAnimationData from "../../assets/animations/oval.json";
import crossAnimationData from "../../assets/animations/cross.json";
import styles from "./TicTacToe.module.css";

const INITIAL_BOARD_MATRIX = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
];

/**
 * Компонент игры в крестики-нолики
 */
export const TicTacToe = memo(() => {
  const [startGame, setStartGame] = useState(false);
  const [availableFields, setAvailableFields] = useState<number[][]>([
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ]);
  const [compCombination, setCompCombination] = useState<number[]>([]);
  const [userCombination, setUserCombination] = useState<number[]>([]);
  const [winningCombination, setWinningCombination] = useState<number[] | null>(
    []
  );
  const [isUserTurn, setIsUserTurn] = useState(true);

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const getRandomNumberFromBoard = () => {
    const allNumbers = availableFields.flat();

    const randomIndex = Math.floor(Math.random() * allNumbers.length);
    return allNumbers[randomIndex];
  };

  /**
   * Обработчик клика по ячейке
   * @param targetCell номер выбранной ячейки
   * @param isComputer компьютер ли выполняет ход
   */
  const handleCellClick = (targetCell: number, isComputer = false) => {
    const playerCombination: number[] = [];

    const availableFieldsAfterClicked = availableFields.map((row) => {
      return row.filter((cell) => {
        if (cell === targetCell) {
          if (isComputer) {
            playerCombination.push(...compCombination, targetCell);
            setCompCombination([...compCombination, targetCell]);
          } else {
            playerCombination.push(...userCombination, targetCell);
            setUserCombination([...userCombination, targetCell]);
          }
          return false;
        } else {
          return true;
        }
      });
    });
    setAvailableFields(availableFieldsAfterClicked);
  };

  /**
   * Проверка победителя
   * @param playerCombination комбинация победителя
   * @returns true если есть победитель или все поля заняты
   */
  const checkWinner = (playerCombination: number[]): boolean => {
    const winningCombination = winningCombinations.find((combination) =>
      combination.every((num) => playerCombination.includes(num))
    );

    if (winningCombination) {
      setWinningCombination(winningCombination);
      return true;
    } else if (!availableFields.flat().length) {
      setWinningCombination(INITIAL_BOARD_MATRIX.flat());
      return true;
    } else {
      return false;
    }
  };

  const resetStates = () => {
    setAvailableFields([
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ]);
    setCompCombination([]);
    setUserCombination([]);
    setWinningCombination([]);
    setIsUserTurn(true);
  };

  useEffect(() => {
    if (!winningCombination?.length && availableFields.flat().length) return;
    // После завершения анимации конца игры - сбрасываем состояния игры
    const timer = setTimeout(resetStates, 2000);
    return () => clearTimeout(timer);
  }, [winningCombination, availableFields]);

  return (
    <div className={styles.gridContainer}>
      <Lottie
        onComplete={() => {
          setStartGame(true);
        }}
        loop={false}
        animationData={gridAnimationData}
      />
      {startGame && (
        <div className={styles.boardTable}>
          <div className={styles.boardBody}>
            {INITIAL_BOARD_MATRIX.map((row, rowIndex) => {
              return row.map((cell, cellIndex) => (
                <div
                  className={`${styles.field}
                  ${
                    winningCombination?.includes(cell) // анимания выделения выигрышной комбинации
                      ? styles.winningField
                      : ""
                  }
                  ${
                    winningCombination?.length
                      ? styles.disapearingField // анимация пропадания всех полей после окончания игры
                      : ""
                  }
                  `}
                  key={`${rowIndex}-${cellIndex}`}
                  onClick={() => {
                    if (
                      userCombination.includes(cell) ||
                      compCombination.includes(cell) ||
                      !isUserTurn
                    )
                      return;
                    handleCellClick(cell);
                    setIsUserTurn(false);
                  }}
                >
                  {userCombination.includes(cell) ? (
                    <Lottie
                      onComplete={() => {
                        const isWinner = checkWinner(userCombination);
                        if (isWinner) return;
                        // После завершения анимации хода пользователя - ходит компьютер
                        handleCellClick(getRandomNumberFromBoard(), true);
                      }}
                      className={styles.mark}
                      loop={false}
                      animationData={crossAnimationData}
                    />
                  ) : compCombination.includes(cell) ? (
                    <Lottie
                      onComplete={() => {
                        const isWinner = checkWinner(compCombination);
                        if (isWinner) return;
                        setIsUserTurn(true);
                      }}
                      className={styles.mark}
                      loop={false}
                      animationData={circleAnimationData}
                    />
                  ) : null}
                </div>
              ));
            })}
          </div>
        </div>
      )}
    </div>
  );
});
