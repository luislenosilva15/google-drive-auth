import { useState } from "react";
import useDrivePicker from "react-google-drive-picker";

const CLIENT_ID =
  "36040316023-4mrg4m721smv6e5j1t6988lq2dv7pp6u.apps.googleusercontent.com";

export default function GoogleDrivePicker() {
  const [openPicker, authResponse] = useDrivePicker();
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);

  const handleOpenPicker = () => {
    openPicker({
      clientId: CLIENT_ID,
      developerKey: "", // NÃO PRECISA DE API KEY
      viewId: "DOCS",
      token: authResponse?.access_token, // Usa OAuth Token
      showUploadView: true,
      showGooglePhotos: false,
      onSuccess: (data) => {
        console.log("Arquivos Selecionados:", data.docs);
        setSelectedFiles(data.docs);
      },
      onCancel: () => console.log("Usuário cancelou"),
    });
  };

  return (
    <div>
      <button onClick={handleOpenPicker}>Abrir Google Drive</button>
      {selectedFiles.length > 0 && (
        <ul>
          {selectedFiles.map((file) => (
            <li key={file.id}>
              {file.name} -{" "}
              <a href={file.url} target="_blank" rel="noopener noreferrer">
                Abrir
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
