import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, MoreVertical, Shield, Star } from "lucide-react";

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [appIcon, setAppIcon] = useState<string | null>(null);
  const [progress, setProgress] = useState(75);
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
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAppIcon(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 py-2 text-sm font-medium bg-white">
        <span>22:43</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-black rounded-full"></div>
            <div className="w-1 h-3 bg-black rounded-full"></div>
            <div className="w-1 h-3 bg-gray-300 rounded-full"></div>
            <div className="w-1 h-3 bg-gray-300 rounded-full"></div>
          </div>
          <div className="ml-2">
            <svg width="18" height="12" viewBox="0 0 18 12" className="text-black">
              <path fill="currentColor" d="M1 4h16v4H1z"/>
              <path fill="currentColor" d="M0 2h18v8H0z" fillOpacity="0.3"/>
            </svg>
          </div>
          <div className="ml-2 w-6 h-3 border border-black rounded-sm relative">
            <div className="absolute right-0 top-0 w-4 h-full bg-black rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <ArrowLeft className="w-6 h-6 text-gray-700" />
        <div className="flex items-center gap-4">
          <Search className="w-6 h-6 text-gray-700" />
          <MoreVertical className="w-6 h-6 text-gray-700" />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6">
        {/* App Info Section */}
        <div className="flex items-start gap-4 mb-8">
          {/* App Icon with Progress Circle */}
          <div className="relative">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
              {/* Background circle */}
              <circle 
                cx="48" 
                cy="48" 
                r="46" 
                stroke="#e5e7eb" 
                strokeWidth="4" 
                fill="none"
              />
              {/* Progress circle */}
              <circle 
                cx="48" 
                cy="48" 
                r="46" 
                stroke="#3b82f6" 
                strokeWidth="4" 
                fill="none"
                strokeDasharray={`${2 * Math.PI * 46}`}
                strokeDashoffset={`${2 * Math.PI * 46 * (1 - progress / 100)}`}
                className="transition-all duration-300"
              />
            </svg>
            
            <div 
              className="absolute inset-2 rounded-2xl cursor-pointer overflow-hidden"
              onClick={() => iconInputRef.current?.click()}
            >
              {appIcon ? (
                <img 
                  src={appIcon} 
                  alt="App Icon" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-green-500 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-12 h-12 text-white fill-current">
                    <path d="M16.75 2C17.99 2 19 3.01 19 4.25v15.5C19 20.99 17.99 22 16.75 22H7.25C6.01 22 5 20.99 5 19.75V4.25C5 3.01 6.01 2 7.25 2h9.5zm-4.5 15c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-11c0-.55-.45-1-1-1H9.75c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1h4.5c.55 0 1-.45 1-1V6z"/>
                  </svg>
                </div>
              )}
            </div>
            
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              ref={iconInputRef}
              onChange={handleIconUpload}
            />
          </div>

          {/* App Details */}
          <div className="flex-1">
            <h1 className="text-2xl font-medium text-gray-900 mb-1">
              {uploadedFile ? uploadedFile.name.replace('.apk', '') : 'WhatsApp Messenger'}
            </h1>
            <p className="text-blue-600 font-medium mb-2">
              {uploadedFile ? 'Minha Empresa' : 'WhatsApp LLC'}
            </p>
            <p className="text-gray-600 text-sm mb-3">Pendente...</p>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Verificado por Play Protect</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-8">
          <Button 
            variant="outline" 
            className="flex-1 py-3 px-6 text-blue-600 border-gray-300 hover:bg-gray-50 rounded-full"
            onClick={() => {
              setUploadedFile(null);
              setAppIcon(null);
            }}
          >
            Cancelar
          </Button>
          
          <Button 
            className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
            onClick={() => fileInputRef.current?.click()}
          >
            Desinstalar
          </Button>
          
          <Input
            type="file"
            accept=".apk"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
        </div>

        {/* App Suggestions */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">Anúncios</span>
              <span className="text-gray-400">•</span>
              <span className="text-lg font-medium text-gray-900">Sugestões para você</span>
            </div>
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-black rounded-2xl mb-2 flex items-center justify-center">
                <div className="text-white text-xs font-bold">TT</div>
              </div>
              <p className="text-sm font-medium mb-1">TikTok Lite</p>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-600">4,4</span>
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl mb-2 flex items-center justify-center">
                <div className="text-white text-lg">🎬</div>
              </div>
              <p className="text-sm font-medium mb-1">Kwai - Ver Vídeos Bacanas</p>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <span>📱 Instalado</span>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-orange-600 rounded-2xl mb-2 flex items-center justify-center">
                <div className="text-white text-lg">🛍️</div>
              </div>
              <p className="text-sm font-medium mb-1">Shopee: 8.8 Liquida Moda</p>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <span>📱 Instalado</span>
              </div>
            </div>
          </div>
        </div>

        {/* More Apps Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-medium text-gray-900">Mais apps para você testar</span>
            <ArrowLeft className="w-5 h-5 text-gray-600 rotate-180" />
          </div>
          
          <div className="flex gap-4 overflow-x-auto">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-2"></div>
              <p className="text-sm font-medium mb-1">FaceApp: Editor facial</p>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-600">4,3</span>
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mb-2"></div>
              <p className="text-sm font-medium mb-1">Sweet Selfie Câmera e Editor</p>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-600">4,5</span>
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl mb-2 flex items-center justify-center">
                <div className="text-white text-lg font-bold">f</div>
              </div>
              <p className="text-sm font-medium mb-1">Facebook</p>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-600">3,9</span>
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
