export interface InferredField<T = string | boolean> {
  value: T;
  is_inferred: boolean;
}

const BASE_URL = 'http://127.0.0.1:8000/api/v1/agent';

export const uploadPermitDocument = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch(`${BASE_URL}/extract-permit`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al extraer datos de Permiso:", error);
    throw error;
  }
};

export const uploadCommitmentDocument = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch(`${BASE_URL}/extract-commitment`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al extraer datos de Compromiso:", error);
    throw error;
  }
};

export const uploadSocialDocument = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch(`${BASE_URL}/extract-social`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al extraer datos de Social:", error);
    throw error;
  }
};
