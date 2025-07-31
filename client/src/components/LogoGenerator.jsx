import React, { useState } from 'react';

function LogoGenerator({ idea }) {
  const [logoUrl, setLogoUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateLogo = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:8000/generate-logo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea }),
    });
    const data = await res.json();
    setLogoUrl(data.image_url);
    setLoading(false);
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Generate Your Logo</h2>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={handleGenerateLogo}
        disabled={!idea || loading}
      >
        {loading ? "Generating..." : "Generate Logo"}
      </button>

      {logoUrl && (
        <div className="mt-4">
          <h4 className="font-medium">Your Logo:</h4>
          <img
            src={logoUrl}
            alt="Generated Logo"
            style={{ width: "300px", border: "1px solid #ccc", padding: "10px" }}
          />
        </div>
      )}
    </div>
  );
}

export default LogoGenerator;
