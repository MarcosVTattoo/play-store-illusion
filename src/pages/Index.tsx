import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Search, MoreVertical, Shield, Star, Upload, Image, Edit3 } from "lucide-react";
import whatsappLogo from "@/assets/whatsapp-logo.png";
import tiktokLogo from "@/assets/tiktok-logo.png";
import kwaiLogo from "@/assets/kwai-logo.png";
import shopeeLogo from "@/assets/shopee-logo.png";
import faceappLogo from "@/assets/faceapp-logo.png";
import facebookLogo from "@/assets/facebook-logo.png";

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [appIcon, setAppIcon] = useState<string | null>(null);
  const [appName, setAppName] = useState<string>("WhatsApp Messenger");
  const [progress, setProgress] = useState(75);
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [tempAppName, setTempAppName] = useState("");
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

  const handleNameChange = () => {
    setTempAppName(appName);
    setIsNameDialogOpen(true);
  };

  const saveAppName = () => {
    setAppName(tempAppName);
    setIsNameDialogOpen(false);
  };

  const handleInstallApp = () => {
    if (uploadedFile) {
      // Criar um link temporário para download
      const url = URL.createObjectURL(uploadedFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = uploadedFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-white max-w-sm mx-auto">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0">
                <MoreVertical className="w-6 h-6 text-gray-700" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white shadow-lg border">
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Carregar APK
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => iconInputRef.current?.click()}>
                <Image className="w-4 h-4 mr-2" />
                Alterar Logo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleNameChange}>
                <Edit3 className="w-4 h-4 mr-2" />
                Alterar Nome
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                <img 
                  src={whatsappLogo}
                  alt="WhatsApp" 
                  className="w-full h-full object-cover"
                />
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
              {uploadedFile ? uploadedFile.name.replace('.apk', '') : appName}
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
            onClick={handleInstallApp}
            disabled={!uploadedFile}
          >
            Instalar
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
              <div className="w-16 h-16 rounded-2xl mb-2 overflow-hidden">
                <img src={tiktokLogo} alt="TikTok" className="w-full h-full object-cover" />
              </div>
              <p className="text-sm font-medium mb-1 w-16">TikTok Lite</p>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-600">4,4</span>
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl mb-2 overflow-hidden">
                <img src={kwaiLogo} alt="Kwai" className="w-full h-full object-cover" />
              </div>
              <p className="text-sm font-medium mb-1 w-20 text-wrap leading-tight">Kwai - Ver Vídeos Bacanas</p>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <span>📱 Instalado</span>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl mb-2 overflow-hidden">
                <img src={shopeeLogo} alt="Shopee" className="w-full h-full object-cover" />
              </div>
              <p className="text-sm font-medium mb-1 w-20 text-wrap leading-tight">Shopee: 8.8 Liquida Moda</p>
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
              <div className="w-16 h-16 rounded-2xl mb-2 overflow-hidden">
                <img src={faceappLogo} alt="FaceApp" className="w-full h-full object-cover" />
              </div>
              <p className="text-sm font-medium mb-1 w-16 text-wrap leading-tight">FaceApp: Editor facial</p>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-600">4,3</span>
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl mb-2 overflow-hidden bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <span className="text-white text-lg">📸</span>
              </div>
              <p className="text-sm font-medium mb-1 w-20 text-wrap leading-tight">Sweet Selfie Câmera e Editor</p>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-600">4,5</span>
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl mb-2 overflow-hidden">
                <img src={facebookLogo} alt="Facebook" className="w-full h-full object-cover" />
              </div>
              <p className="text-sm font-medium mb-1 w-16">Facebook</p>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-600">3,9</span>
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog para alterar nome do app */}
      <Dialog open={isNameDialogOpen} onOpenChange={setIsNameDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Alterar Nome do App</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="appName">Nome do App</Label>
              <Input
                id="appName"
                value={tempAppName}
                onChange={(e) => setTempAppName(e.target.value)}
                placeholder="Digite o nome do app"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsNameDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={saveAppName}>
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
