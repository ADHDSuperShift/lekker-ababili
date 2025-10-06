import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Play, Pause, RotateCcw, Eye } from 'lucide-react';

interface MouthVisualizationProps {
  mouthShapes: string[];
  accuracy: number;
  text: string;
}

interface MouthPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  shape: string;
}

export const MouthVisualization: React.FC<MouthVisualizationProps> = ({
  mouthShapes,
  accuracy,
  text
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(1000);

  useEffect(() => {
    drawMouthShape(mouthShapes[currentShapeIndex] || 'neutral');
  }, [currentShapeIndex, mouthShapes]);

  const drawMouthShape = (shape: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas size
    canvas.width = 300;
    canvas.height = 200;

    // Draw face outline
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(150, 100, 80, 90, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw eyes
    ctx.fillStyle = '#374151';
    ctx.beginPath();
    ctx.ellipse(125, 80, 8, 12, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(175, 80, 8, 12, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Draw nose
    ctx.strokeStyle = '#6B7280';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(150, 95);
    ctx.lineTo(145, 110);
    ctx.moveTo(145, 110);
    ctx.lineTo(155, 110);
    ctx.stroke();

    // Draw mouth based on shape
    drawMouthForShape(ctx, shape);
    
    // Add accuracy indicator
    drawAccuracyIndicator(ctx, accuracy);
  };

  const drawMouthForShape = (ctx: CanvasRenderingContext2D, shape: string) => {
    ctx.fillStyle = '#DC2626';
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;

    switch (shape.toLowerCase()) {
      case 'ah':
        // Open mouth - oval
        ctx.beginPath();
        ctx.ellipse(150, 135, 15, 20, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        break;
      
      case 'eh':
        // Half open - horizontal ellipse
        ctx.beginPath();
        ctx.ellipse(150, 135, 18, 8, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        break;
      
      case 'oh':
        // Round mouth
        ctx.beginPath();
        ctx.ellipse(150, 135, 12, 15, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        break;
      
      case 'oo':
        // Small round mouth
        ctx.beginPath();
        ctx.ellipse(150, 135, 8, 12, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        break;
      
      default:
        // Neutral - closed mouth
        ctx.beginPath();
        ctx.ellipse(150, 135, 20, 3, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    // Add teeth for open mouths
    if (['ah', 'eh'].includes(shape.toLowerCase())) {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.rect(140, 125, 20, 4);
      ctx.fill();
      ctx.beginPath();
      ctx.rect(140, 141, 20, 4);
      ctx.fill();
    }
  };

  const drawAccuracyIndicator = (ctx: CanvasRenderingContext2D, accuracy: number) => {
    // Draw accuracy ring around face
    const color = accuracy >= 80 ? '#10B981' : accuracy >= 60 ? '#F59E0B' : '#EF4444';
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.ellipse(150, 100, 95, 105, 0, 0, 2 * Math.PI * (accuracy / 100));
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const startAnimation = () => {
    if (mouthShapes.length === 0) return;
    
    setIsAnimating(true);
    let index = 0;
    
    const animate = () => {
      if (!isAnimating) return;
      
      setCurrentShapeIndex(index);
      index = (index + 1) % mouthShapes.length;
      
      setTimeout(() => {
        if (isAnimating) animate();
      }, animationSpeed);
    };
    
    animate();
  };

  const stopAnimation = () => {
    setIsAnimating(false);
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setCurrentShapeIndex(0);
  };

  const getShapeDescription = (shape: string) => {
    const descriptions: Record<string, string> = {
      'ah': 'Open vowel - jaw dropped, tongue low',
      'eh': 'Mid vowel - tongue slightly raised',
      'oh': 'Rounded vowel - lips rounded, tongue back',
      'oo': 'High back vowel - lips very rounded',
      'neutral': 'Relaxed position - lips closed'
    };
    return descriptions[shape.toLowerCase()] || 'Unknown mouth position';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Eye className="h-5 w-5" />
          <span>3D Mouth Movement Visualization</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Canvas for 3D mouth visualization */}
          <div className="flex justify-center">
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="border-2 border-gray-200 rounded-lg bg-gradient-to-b from-blue-50 to-white"
                width={300}
                height={200}
              />
              <div className="absolute top-2 right-2">
                <Badge variant={accuracy >= 80 ? 'default' : accuracy >= 60 ? 'secondary' : 'destructive'}>
                  {accuracy}% Accuracy
                </Badge>
              </div>
            </div>
          </div>

          {/* Animation controls */}
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={isAnimating ? stopAnimation : startAnimation}
              disabled={mouthShapes.length === 0}
            >
              {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isAnimating ? 'Pause' : 'Play'}
            </Button>
            
            <Button variant="outline" size="sm" onClick={resetAnimation}>
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            
            <select
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value={500}>Fast</option>
              <option value={1000}>Normal</option>
              <option value={1500}>Slow</option>
            </select>
          </div>

          {/* Current mouth shape info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Current Shape:</span>
              <Badge variant="outline">
                {mouthShapes[currentShapeIndex] || 'neutral'}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              {getShapeDescription(mouthShapes[currentShapeIndex] || 'neutral')}
            </p>
          </div>

          {/* Mouth shapes sequence */}
          {mouthShapes.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Pronunciation Sequence:</h4>
              <div className="flex flex-wrap gap-2">
                {mouthShapes.map((shape, index) => (
                  <Badge
                    key={index}
                    variant={index === currentShapeIndex ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setCurrentShapeIndex(index)}
                  >
                    {shape}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Practice text breakdown */}
          <div className="space-y-2">
            <h4 className="font-medium">Text Analysis:</h4>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-sm font-mono">{text}</p>
              <p className="text-xs text-gray-600 mt-1">
                Phonemes: {mouthShapes.join(' → ')}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};