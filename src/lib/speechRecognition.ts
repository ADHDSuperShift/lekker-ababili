export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  words: Array<{
    word: string;
    confidence: number;
    startTime: number;
    endTime: number;
  }>;
}

export interface PronunciationScore {
  overall: number;
  accuracy: number;
  fluency: number;
  completeness: number;
  prosody: number;
}

export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isSupported: boolean;

  constructor() {
    this.isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    if (this.isSupported) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;
    
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
  }

  async recognizeSpeech(audioBlob: Blob, language: string = 'en-US'): Promise<SpeechRecognitionResult> {
    if (!this.isSupported || !this.recognition) {
      throw new Error('Speech recognition not supported');
    }

    return new Promise((resolve, reject) => {
      if (!this.recognition) return reject(new Error('Recognition not initialized'));

      this.recognition.lang = language;
      
      this.recognition.onresult = (event) => {
        const result = event.results[0];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence;
        
        resolve({
          transcript,
          confidence,
          words: this.parseWords(transcript, confidence)
        });
      };

      this.recognition.onerror = (event) => {
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      this.recognition.start();
    });
  }

  private parseWords(transcript: string, confidence: number) {
    return transcript.split(' ').map((word, index) => ({
      word: word.toLowerCase(),
      confidence: confidence * (0.8 + Math.random() * 0.2),
      startTime: index * 0.5,
      endTime: (index + 1) * 0.5
    }));
  }

  analyzePronunciation(userTranscript: string, referenceText: string): PronunciationScore {
    const userWords = userTranscript.toLowerCase().split(' ');
    const refWords = referenceText.toLowerCase().split(' ');
    
    const accuracy = this.calculateAccuracy(userWords, refWords);
    const completeness = Math.min(userWords.length / refWords.length, 1);
    const fluency = this.calculateFluency(userWords, refWords);
    const prosody = 0.7 + Math.random() * 0.3; // Simulated prosody score
    
    const overall = (accuracy * 0.4 + fluency * 0.3 + completeness * 0.2 + prosody * 0.1);
    
    return {
      overall: Math.round(overall * 100),
      accuracy: Math.round(accuracy * 100),
      fluency: Math.round(fluency * 100),
      completeness: Math.round(completeness * 100),
      prosody: Math.round(prosody * 100)
    };
  }

  private calculateAccuracy(userWords: string[], refWords: string[]): number {
    let matches = 0;
    const maxLength = Math.max(userWords.length, refWords.length);
    
    for (let i = 0; i < maxLength; i++) {
      if (userWords[i] && refWords[i] && this.wordsMatch(userWords[i], refWords[i])) {
        matches++;
      }
    }
    
    return maxLength > 0 ? matches / maxLength : 0;
  }

  private calculateFluency(userWords: string[], refWords: string[]): number {
    const lengthRatio = Math.min(userWords.length / refWords.length, refWords.length / userWords.length);
    return lengthRatio * (0.8 + Math.random() * 0.2);
  }

  private wordsMatch(word1: string, word2: string): boolean {
    const similarity = this.levenshteinSimilarity(word1, word2);
    return similarity > 0.7;
  }

  private levenshteinSimilarity(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + cost
        );
      }
    }
    
    const maxLength = Math.max(str1.length, str2.length);
    return maxLength > 0 ? 1 - (matrix[str2.length][str1.length] / maxLength) : 1;
  }
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}