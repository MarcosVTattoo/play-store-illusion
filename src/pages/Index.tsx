import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, Download, Shield, Users } from "lucide-react";

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.apk')) {
      setUploadedFile(file);
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
          {!uploadedFile ? (
            /* Área de upload */
            <div className="text-center">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 hover:border-green-400 transition-colors">
                <Download className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <Label htmlFor="apk-upload" className="cursor-pointer">
                  <span className="text-lg font-medium text-gray-700">Selecione seu arquivo APK</span>
                  <p className="text-sm text-gray-500 mt-2">Clique aqui para fazer upload do seu aplicativo</p>
                </Label>
                <Input
                  id="apk-upload"
                  type="file"
                  accept=".apk"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
              </div>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-all duration-200 hover:scale-105"
              >
                Escolher Arquivo APK
              </Button>
            </div>
          ) : (
            /* Informações do app e download */
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{uploadedFile.name}</h2>
                  <p className="text-sm text-gray-600">Aplicativo Android</p>
                </div>
              </div>

              {/* Informações do app */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Versão:</span>
                  <span className="text-sm text-gray-600">1.0.0</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">4.7 de 5 estrelas</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>10K+ downloads</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    <span>Seguro</span>
                  </div>
                </div>

                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                  Baixe agora para aproveitar todas as funcionalidades incríveis deste aplicativo.
                </p>
              </div>

              {/* Botão de download */}
              {!isDownloading ? (
                <Button 
                  onClick={handleDownload}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Iniciar Download
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${downloadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-center text-sm text-gray-600 font-medium">
                    Baixando... {Math.round(downloadProgress)}%
                  </p>
                </div>
              )}

              <Button 
                variant="outline" 
                onClick={() => setUploadedFile(null)}
                className="w-full mt-3 border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Escolher Outro Arquivo
              </Button>
            </div>
          )}
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
