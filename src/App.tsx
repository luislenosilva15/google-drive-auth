import { useEffect, useState } from "react";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SCOPES = "https://www.googleapis.com/auth/drive.readonly";

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const loadGapi = async () => {
      const { gapi } = await import("gapi-script");

      gapi.load("client:auth2", async () => {
        await gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
          ],
          scope: SCOPES,
        });

        const auth = gapi.auth2.getAuthInstance();
        setIsSignedIn(auth.isSignedIn.get());
        auth.isSignedIn.listen(setIsSignedIn);
      });
    };

    loadGapi();
  }, []);

  const handleSignIn = async () => {
    const { gapi } = await import("gapi-script");
    await gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignOut = async () => {
    const { gapi } = await import("gapi-script");
    gapi.auth2.getAuthInstance().signOut();
  };

  const listFiles = async () => {
    if (!isSignedIn) return;
    const { gapi } = await import("gapi-script");

    const response = await gapi.client.drive.files.list({
      pageSize: 10,
      fields: "files(id, name, mimeType)",
    });

    setFiles(response.result.files);
  };

  return (
    <div>
      {isSignedIn ? (
        <>
          <button onClick={handleSignOut}>Sair</button>
          <button onClick={listFiles}>Listar Arquivos</button>
          <ul>
            {files.map((file) => (
              <li key={file.id}>
                {file.name} ({file.mimeType})
              </li>
            ))}
          </ul>
        </>
      ) : (
        <button onClick={handleSignIn}>Login com Google</button>
      )}
    </div>
  );
}
