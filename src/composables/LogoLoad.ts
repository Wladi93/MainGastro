import { ref, type Ref } from "vue";
import api, { getBaseURL } from "src/boot/axios";
import type { Logos } from "../pages/types/LogosType";
import { Notify } from "quasar";

const logo: Ref<Logos[]> = ref([]);

export function useLogo() {
  const getFullImageUrl = (imgUrl: string): string => {
    if (imgUrl.startsWith("http://") || imgUrl.startsWith("https://")) {
      return imgUrl;
    }

    const apiBaseURL = getBaseURL();
    const normalizedBaseURL = apiBaseURL.endsWith("/")
      ? apiBaseURL
      : apiBaseURL + "/";
    const cleanedImgUrl = imgUrl.replace(/^\/+/, "");

    return normalizedBaseURL + cleanedImgUrl;
  };

  const loadLogo = async () => {
    try {
      const response = await api.get(`/api/logo`);
      logo.value = response.data;
      logo.value.sort((a, b) => {
        return a.id >= b.id ? 1 : -1;
      });
    } catch (error) {
      console.error(error);
    }
  };

  const uploadStates = ref<
    Record<
      number,
      {
        uploadProgress: number;
        isUploading: boolean;
        selectedFile: File | null;
        imagePreview: string;
        newImageUrl: string;
        uploadStatus: "idle" | "uploading" | "success" | "error";
      }
    >
  >({});

  const getUploadState = (logoId: number) => {
    if (!uploadStates.value[logoId]) {
      uploadStates.value[logoId] = {
        uploadProgress: 0,
        isUploading: false,
        selectedFile: null,
        imagePreview: "",
        newImageUrl: "",
        uploadStatus: "idle",
      };
    }
    return uploadStates.value[logoId];
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file, file.name);

    const uploadPath = "api/uploads/images";

    try {
      let response;

      if (
        uploadPath.startsWith("http://") ||
        uploadPath.startsWith("https://")
      ) {
        response = await api.post(uploadPath, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          baseURL: "",
        });
      } else {
        response = await api.post(uploadPath, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      const result = response.data;

      return result.imageUrl || result.url || result.path;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const onFileChange = async (file: File | null, logoId: number) => {
    const state = getUploadState(logoId);

    if (file) {
      state.selectedFile = file;
      state.uploadStatus = "idle";

      const reader = new FileReader();
      reader.onload = (e) => {
        state.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);

      try {
        state.uploadStatus = "uploading";

        const uploadedImageUrl = await uploadImage(file);

        state.newImageUrl = uploadedImageUrl;

        const currentLogo = logo.value.find((logo) => logo.id === logoId);
        if (currentLogo) {
          await api.put(`/api/logo/${logoId}`, {
            id: logoId,
            url: uploadedImageUrl,
            name: currentLogo.name,
          });
        }

        const logoIndex = logo.value.findIndex((logo) => logo.id === logoId);
        if (logoIndex !== -1) {
          logo.value[logoIndex]!.url = uploadedImageUrl;
        }

        state.uploadStatus = "success";

        Notify.create({
          type: "positive",
          message: "Neues Bild erfolgreich hochgeladen!",
          position: "top",
          icon: "check",
        });
      } catch (error) {
        state.uploadStatus = "error";
        state.imagePreview = "";
        state.newImageUrl = "";
        console.error(error);

        Notify.create({
          type: "negative",
          message: "Fehler beim Hochladen des neuen Bildes",
          icon: "clear",
          position: "top",
        });
      }
    } else {
      state.selectedFile = null;
      state.imagePreview = "";
      state.uploadStatus = "idle";
      state.newImageUrl = "";
    }
  };

  return {
    logo,
    loadLogo,
    getFullImageUrl,
    onFileChange,
    getUploadState,
  };
}
