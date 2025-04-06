
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useVoiceNavigation() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supportsSpeechRecognition, setSupportsSpeechRecognition] = useState(true);
  const navigate = useNavigate();
  
  // This would be implemented with the Web Speech API in a real implementation
  // Here we'll just simulate it
  
  useEffect(() => {
    // Check if browser supports speech recognition
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      setSupportsSpeechRecognition(false);
      console.warn('This browser does not support speech recognition.');
      return;
    }
    
    // In a real implementation, we would set up the speech recognition here
  }, []);
  
  const startListening = () => {
    if (!supportsSpeechRecognition) return;
    
    setIsListening(true);
    // In a real implementation, this would start the speech recognition
    console.log('Started listening...');
    
    // Simulate recognition for demo purposes
    setTimeout(() => {
      setIsListening(false);
      console.log('Stopped listening');
    }, 3000);
  };
  
  const stopListening = () => {
    setIsListening(false);
    // In a real implementation, this would stop the speech recognition
  };
  
  const processCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Simple command processing logic
    if (lowerCommand.includes('go to dashboard') || lowerCommand.includes('show dashboard')) {
      navigate('/dashboard');
    } else if (lowerCommand.includes('water') || lowerCommand.includes('water quality')) {
      navigate('/water');
    } else if (lowerCommand.includes('farmer') || lowerCommand.includes('farming')) {
      navigate('/farmer');
    } else if (lowerCommand.includes('education') || lowerCommand.includes('school')) {
      navigate('/education');
    } else if (lowerCommand.includes('health') || lowerCommand.includes('medical')) {
      navigate('/health');
    } else if (lowerCommand.includes('resource') || lowerCommand.includes('natural resource')) {
      navigate('/resource');
    } else if (lowerCommand.includes('climate') || lowerCommand.includes('weather')) {
      navigate('/climate');
    } else if (lowerCommand.includes('gender') || lowerCommand.includes('job')) {
      navigate('/gender');
    } else if (lowerCommand.includes('home') || lowerCommand.includes('main page')) {
      navigate('/');
    }
  };
  
  return {
    isListening,
    transcript,
    supportsSpeechRecognition,
    startListening,
    stopListening,
    processCommand
  };
}
