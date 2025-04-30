/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";

const CLIENT_ID =
  "36040316023-4mrg4m721smv6e5j1t6988lq2dv7pp6u.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/drive.file"; // Scopes de acesso
const REDIRECT_URI = "http://localhost:5173"; // URI de redirecionamento

const GoogleDriveAuth = () => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [files, setFiles] = useState<any[]>([]);

  const handleLogin = () => {
    const params = new URLSearchParams();
    params.append("client_id", CLIENT_ID);
    params.append("redirect_uri", REDIRECT_URI);
    params.append("scope", SCOPES);
    params.append("response_type", "token");
    params.append("include_granted_scopes", "true");

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    setAuthToken(null);
    setFiles([]);
  };

  const handleFiles = async (token: string) => {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?pageSize=10&fields=files(id,name,webViewLink)`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    setFiles(data.files);
  };

  // Verifica se o token de autenticação está na URL
  React.useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1)); // Remove o "#" da URL
    const token = params.get("access_token");

    if (token) {
      setAuthToken(token);
      handleFiles(token);
    }
  }, []);

  return (
    <div>
      {!authToken ? (
        <button onClick={handleLogin}>Login com Google</button>
      ) : (
        <div>
          <button onClick={handleLogout}>Logout</button>
          <h3>Arquivos no Google Drive:</h3>
          <ul>
            {files.map((file) => (
              <li key={file.id}>
                {file.name} -{" "}
                <a
                  href={file.webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GoogleDriveAuth;
