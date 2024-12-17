import React, { useEffect, useState } from 'react';
import './styles/main.scss';

function App() {
  const [title, setTitle] = useState('CalGist');
  const [buttonText, setButtonText] = useState('Download');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [icsBlob, setIcsBlob] = useState(null);
  const [sourceUrl, setSourceUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true); // For loading indicator

  useEffect(() => {
    // Parse URL search params
    const params = new URLSearchParams(window.location.search);
    const titleParam = params.get('title');
    const gistid = params.get('gistid');
    const filenameParam = params.get('filename'); // New parameter
    const rev = params.get('rev');
    const buttonParam = params.get('button');
    const descrParam = params.get('descr');

    // Set document title
    if (titleParam) {
      document.title = titleParam;
      setTitle(titleParam);
    } else {
      document.title = "CalGist";
      setTitle("CalGist");
    }

    // If gistid not provided
    if (!gistid) {
      setError('No Gist ID provided. Cannot load the iCalendar file.');
      setIsLoading(false);
      return;
    }

    // Fetch Gist info from GitHub API
    const gistApiUrl = rev
      ? `https://api.github.com/gists/${gistid}/${rev}`
      : `https://api.github.com/gists/${gistid}`;

    fetch(gistApiUrl)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to load Gist info');
        }
        return res.json();
      })
      .then(data => {
        if (!data.files || Object.keys(data.files).length === 0) {
          throw new Error('No files found in this Gist.');
        }

        // Filter .ics files
        const icsFiles = Object.values(data.files).filter(file => file.filename.endsWith('.ics'));

        if (icsFiles.length === 0) {
          throw new Error('No .ics files found in this Gist.');
        }

        let selectedFile = null;

        if (filenameParam) {
          // Attempt to find the specified file
          selectedFile = icsFiles.find(file => file.filename === filenameParam);

          if (!selectedFile) {
            console.warn(`Filename "${filenameParam}" not found. Defaulting to the first .ics file.`);
            // Default to the first .ics file
            selectedFile = icsFiles[0];
          }
        } else {
          // No filename provided, default to the first .ics file
          selectedFile = icsFiles[0];
        }

        // Set the source URL for the Gist
        setSourceUrl(data.html_url);

        // Fetch the .ics file content
        fetch(selectedFile.raw_url)
          .then(res => {
            if (!res.ok) {
              throw new Error('Failed to fetch the .ics file.');
            }
            return res.blob();
          })
          .then(blob => {
            setIcsBlob(blob);
            setIsLoading(false);
            // Determine button text
            if (buttonParam) {
              setButtonText(buttonParam);
            } else {
              setButtonText("Add to Calendar");
            }

            // Determine description
            if (descrParam === '0') {
              setDescription('');
            } else if (descrParam) {
              setDescription(descrParam);
            } else {
              setDescription(data.description || '');
            }
          })
          .catch(err => {
            console.error(err);
            setError('An error occurred while fetching the iCalendar file.');
            setIsLoading(false);
          });
      })
      .catch(err => {
        console.error(err);
        setError('An error occurred while loading the Gist. ' + err.message);
        setIsLoading(false);
      });
  }, []);

  const handleDownload = () => {
    if (icsBlob) {
      const url = window.URL.createObjectURL(new Blob([icsBlob], { type: 'text/calendar' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'event.ics'); // Customize filename if needed
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    }
  };

  return (
    <div className="container">
      <h1>{title}</h1>
      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          {icsBlob && (
            <div className="button-wrapper">
              <button className="download-button" onClick={handleDownload}>
                {buttonText}
              </button>
            </div>
          )}
          {description && (
            <div className="description">{description}</div>
          )}
          {sourceUrl && (
            <div className="source-box">
              <strong>Source:</strong> <a href={sourceUrl} target="_blank" rel="noopener noreferrer">{sourceUrl}</a>
            </div>
          )}
          {error && (
            <div className="error">{error}</div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
