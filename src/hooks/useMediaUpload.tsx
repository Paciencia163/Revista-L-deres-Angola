import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useMediaUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const upload = async (file: File, folder: string = "covers"): Promise<string | null> => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      
      const { error } = await supabase.storage.from("media").upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (error) {
        toast({ title: "Erro no upload", description: error.message, variant: "destructive" });
        return null;
      }

      const { data: urlData } = supabase.storage.from("media").getPublicUrl(fileName);
      return urlData.publicUrl;
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading };
};
