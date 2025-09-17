import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, Download, Shield, Users, Image, Upload } from "lucide-react";

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [appIcon, setAppIcon] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.apk')) {
      setUploadedFile(file);
    }
  };

  const handleIconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type.startsWith('image/'))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAppIcon(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (!uploadedFile) return;
    
    setIsDownloading(true);
    setDownloadProgress(0);
    
    // Simular progresso de download
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Iniciar download real do arquivo
          const url = URL.createObjectURL(uploadedFile);
          const a = document.createElement('a');
          a.href = url;
          a.download = uploadedFile.name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          setTimeout(() => {
            setIsDownloading(false);
            setDownloadProgress(0);
          }, 1000);
          
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header da Play Store */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">Play Store</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Download do Aplicativo</h1>
          <p className="text-gray-600">O download do aplicativo está pronto para iniciar!</p>
        </div>

        {/* Card principal */}
        <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          {/* App Icon Section */}
          <div className="flex items-start gap-4 mb-6">
            <div className="relative">
              {appIcon ? (
                <img 
                  src={appIcon} 
                  alt="App Icon" 
                  className="w-20 h-20 rounded-xl object-cover"
                />
              ) : (
                <div 
                  onClick={() => iconInputRef.current?.click()}
                  className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-all"
                >
                  <Image className="w-8 h-8 text-white" />
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                ref={iconInputRef}
                onChange={handleIconUpload}
              />
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {uploadedFile ? uploadedFile.name.replace('.apk', '') : 'Meu Aplicativo'}
              </h2>
              <p className="text-blue-600 font-medium mb-2">Minha Empresa</p>
              <p className="text-gray-600 text-sm mb-2">
                {uploadedFile ? 'Pronto para download' : 'Aguardando APK...'}
              </p>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Verificado por Play Protect</span>
              </div>
            </div>
          </div>

          {/* APK Upload Section */}
          <div className="mb-6">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Arquivo APK
            </Label>
            {!uploadedFile ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Clique para selecionar o arquivo APK</p>
                <p className="text-xs text-gray-500 mt-1">Apenas arquivos .apk são aceitos</p>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Download className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                    <p className="text-xs text-gray-500">APK • {(uploadedFile.size / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUploadedFile(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Remover
                </Button>
              </div>
            )}
            <Input
              type="file"
              accept=".apk"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1 py-3 text-blue-600 border-blue-200 hover:bg-blue-50"
              onClick={() => {
                setUploadedFile(null);
                setAppIcon(null);
              }}
            >
              Cancelar
            </Button>
            
            {!isDownloading ? (
              <Button 
                onClick={handleDownload}
                disabled={!uploadedFile}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadedFile ? 'Baixar' : 'Selecione APK'}
              </Button>
            ) : (
              <div className="flex-1">
                <div className="mb-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${downloadProgress}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-600">
                  Baixando... {Math.round(downloadProgress)}%
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Rodapé */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            Este é um link seguro, não se preocupe.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
