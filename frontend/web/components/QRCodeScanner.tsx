'use client';

import { useEffect, useRef, useState } from 'react';
import { QrCode, Camera, AlertTriangle, Scan, Zap } from 'lucide-react';
import { Button } from 'ui';

interface QRCodeScannerProps {
  onResult: (result: string) => void;
  isActive?: boolean;
  className?: string;
}

export function QRCodeScanner({ onResult, isActive = true, className = '' }: QRCodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Cleanup stream when component unmounts or becomes inactive
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Stop scanning when inactive
  useEffect(() => {
    if (!isActive && stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsScanning(false);
    }
  }, [isActive, stream]);

  const startScanning = async () => {
    if (!isActive) return;

    try {
      setError(null);
      
      // Request camera permission
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });

      setStream(mediaStream);
      setHasPermission(true);
      setIsScanning(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      // Note: In a production app, you would integrate with a QR code scanner library
      // such as @zxing/library, qr-scanner, or similar
      // For this demo, we'll simulate QR scanning
      simulateQRScan();

    } catch (err) {
      console.error('Error accessing camera:', err);
      setHasPermission(false);
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const stopScanning = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  // Simulate QR code scanning for demo purposes
  // In production, replace this with actual QR code detection
  const simulateQRScan = () => {
    // This is just for demo - in production you'd use a real QR scanner
    setTimeout(() => {
      if (videoRef.current && isActive) {
        // Simulate finding a demo QR code
        console.log('QR Scanner running...');
      }
    }, 2000);
  };

  // Mock QR scanner for demonstration
  const handleMockScan = () => {
    const mockUrl = `${window.location.origin}/pay/0x${Math.random().toString(16).substr(2, 40)}demo`;
    onResult(mockUrl);
  };

  if (hasPermission === false) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
        <AlertTriangle className="h-12 w-12 text-orange-500 mb-4" />
        <h3 className="font-semibold text-lg mb-2">Camera Permission Required</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Please allow camera access to scan QR codes for payments.
        </p>
        <Button onClick={startScanning} variant="outline" size="sm">
          <Camera className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="font-semibold text-lg mb-2">Scanner Error</h3>
        <p className="text-muted-foreground text-sm mb-4">{error}</p>
        <Button onClick={startScanning} variant="outline" size="sm">
          <Camera className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {!isScanning ? (
        <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <QrCode className="h-10 w-10 text-white" />
          </div>
          <h3 className="font-bold text-xl mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            QR Code Scanner
          </h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm">
            Scan Ezpay QR codes to make instant payments with zero gas fees
          </p>
          <Button 
            onClick={startScanning} 
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Scan className="h-5 w-5 mr-2" />
            Start Scanning
          </Button>
        </div>
      ) : (
        <div className="relative bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="relative">
            <video
              ref={videoRef}
              className="rounded-xl shadow-2xl max-w-full h-auto border-4 border-white dark:border-slate-800"
              width="400"
              height="300"
              autoPlay
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Modern Scanner overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Scanning frame */}
                <div className="w-48 h-48 border-4 border-blue-500 rounded-2xl relative overflow-hidden">
                  {/* Corner indicators */}
                  <div className="absolute top-2 left-2 w-6 h-6 border-l-4 border-t-4 border-blue-400 rounded-tl-lg"></div>
                  <div className="absolute top-2 right-2 w-6 h-6 border-r-4 border-t-4 border-blue-400 rounded-tr-lg"></div>
                  <div className="absolute bottom-2 left-2 w-6 h-6 border-l-4 border-b-4 border-blue-400 rounded-bl-lg"></div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 border-r-4 border-b-4 border-blue-400 rounded-br-lg"></div>
                  
                  {/* Scanning line animation */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/30 to-transparent h-1 animate-pulse"></div>
                </div>
                
                {/* Scanning indicator */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    Scanning...
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
              <Zap className="h-4 w-4" />
              <p className="text-sm font-medium">
                Point camera at an Ezpay QR code
              </p>
            </div>
            
            <div className="flex justify-center gap-3">
              <Button 
                onClick={stopScanning} 
                variant="outline" 
                size="sm"
                className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-900/20"
              >
                <Camera className="h-4 w-4 mr-2" />
                Stop Scanner
              </Button>
              
              {/* Enhanced demo button */}
              <Button 
                onClick={handleMockScan} 
                variant="outline" 
                size="sm"
                className="hover:bg-green-50 hover:border-green-200 hover:text-green-600 dark:hover:bg-green-900/20"
              >
                <QrCode className="h-4 w-4 mr-2" />
                Test Demo QR
              </Button>
            </div>
            
            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                💡 <strong>Tip:</strong> Hold your device steady and ensure the QR code is within the scanning frame
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 