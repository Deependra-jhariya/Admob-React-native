import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import BannerAdComponent from '../../components/BannerAdComponent';
import {useInterstitialAd} from "../../hooks/useInterstitialAd"
const levels = [
  {
    id: 1,
    question: 'What is the capital of France?',
    options: ['Paris', 'Berlin', 'Rome', 'Madrid'],
    answer: 'Paris',
  },
  {
    id: 2,
    question: '2 + 2 = ?',
    options: ['3', '4', '5', '6'],
    answer: '4',
  },
  {
    id: 3,
    question: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
    answer: 'Mars',
  },
  {
    id: 4,
    question: 'What is the boiling point of water?',
    options: ['90°C', '100°C', '110°C', '120°C'],
    answer: '100°C',
  },
  {
    id: 5,
    question: 'Who wrote “Romeo and Juliet”?',
    options: [
      'Charles Dickens',
      'Jane Austen',
      'William Shakespeare',
      'Mark Twain',
    ],
    answer: 'William Shakespeare',
  },
  {
    id: 6,
    question: 'What is the largest ocean on Earth?',
    options: [
      'Atlantic Ocean',
      'Indian Ocean',
      'Arctic Ocean',
      'Pacific Ocean',
    ],
    answer: 'Pacific Ocean',
  },
  {
    id: 7,
    question: '5 x 6 = ?',
    options: ['30', '25', '20', '35'],
    answer: '30',
  },
  {
    id: 8,
    question: 'What gas do plants absorb from the atmosphere?',
    options: ['Oxygen', 'Carbon Dioxide', 'Hydrogen', 'Nitrogen'],
    answer: 'Carbon Dioxide',
  },
  {
    id: 9,
    question: 'Which is the longest river in the world?',
    options: ['Amazon', 'Yangtze', 'Nile', 'Mississippi'],
    answer: 'Nile',
  },
  {
    id: 10,
    question: 'How many continents are there on Earth?',
    options: ['5', '6', '7', '8'],
    answer: '7',
  },
];

export default function Home() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const { isLoaded, showAd } = useInterstitialAd();
  const handleAnswer = async(option: any) => {
    const correctAnswer = levels[currentLevel].answer;

    if (option === correctAnswer) {
      const newScore = score + 10;
      setScore(score + 10); // increment score by 10 for each correct answer
        // 👇 Show Interstitial Ad at score 20
    if (newScore === 20 && isLoaded) {
      await showAd(); // showAd() is from your hook
    }
      if (currentLevel + 1 < levels.length) {
        setCurrentLevel(currentLevel + 1);
      } else {
        setShowResult(true);
      }
    } else {
      if (lives > 1) {
        setLives(lives - 1);
      } else {
        setGameOver(true);
      }
    }
  };

  const resetGame = () => {
    setCurrentLevel(0);
    setLives(3);
    setScore(0);
    setShowResult(false);
    setGameOver(false);
  };

  if (showResult) {
    return (
      <SafeAreaView style={styles.resultContainer}>
        <Text style={styles.resultText}>🎉 You completed all levels!</Text>
        <Text style={styles.resultText}>🏆 Score: {score}</Text>
        <TouchableOpacity onPress={resetGame} style={styles.button}>
          <Text style={styles.buttonText}>Play Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (gameOver) {
    return (
      <SafeAreaView style={styles.gameOverContainer}>
        <Text style={styles.gameOverText}>💀 Game Over</Text>
        <Text style={styles.gameOverText}>🏆 Score: {score}</Text>
        <TouchableOpacity onPress={resetGame} style={styles.button}>
          <Text style={styles.buttonText}>Restart</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const current = levels[currentLevel];

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ justifyContent: 'flex-end' }}>
        <Text style={{ fontSize: 24, textAlign: 'center' }}>🎮 Game Area</Text>

        {/* Show Banner Ad */}
        <View style={{ borderWidth: 1,marginVertical:10 }}>
          <BannerAdComponent />
        </View>
      </View>
      <View style={styles.header}>
        <Text style={styles.levelText}>
          Level {currentLevel + 1}/{levels.length}
        </Text>
        <Text style={styles.livesText}>❤️ Lives: {lives}</Text>
        <Text style={styles.scoreText}>⭐ Score: {score}</Text>
      </View>

      <View style={styles.questionBox}>
        <Text style={styles.questionText}>{current.question}</Text>
        {current.options.map((opt, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleAnswer(opt)}
            style={styles.optionButton}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    marginBottom: 20,
  },
  levelText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  livesText: {
    fontSize: 18,
    color: '#e53935',
    marginTop: 4,
  },
  scoreText: {
    fontSize: 18,
    color: '#1e88e5',
    marginTop: 4,
  },
  questionBox: {
    backgroundColor: '#f1f5f9',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#111',
  },
  optionButton: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d9fdd3',
    padding: 20,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2e7d32',
    textAlign: 'center',
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffe6e6',
    padding: 20,
  },
  gameOverText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#d32f2f',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1e88e5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
