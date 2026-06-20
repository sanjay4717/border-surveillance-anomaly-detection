import { useState, useRef } from "react";

/**
 * Upload panel — lets the user select or drag-and-drop a surveillance
 * image. Shows a preview before submitting for analysis.
 */
export default function UploadPanel({ onAnalyze, isLoading }) {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (selectedFile) => {
    if (!selectedFile || !selectedFile.type.startsWith("image/")) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="border border-hud-line bg-hud-panel/50 rounded-sm p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-600 tracking-wide text-hud-text">
          FEED INPUT
        </h2>
        <span className="text-xs text-hud-dim">[ IMAGE FRAME ]</span>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative aspect-video rounded-sm border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-colors ${
          isDragging ? "border-hud-green bg-hud-green/5" : "border-hud-line"
        }`}
      >
        {preview ? (
          <img src={preview} alt="preview" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-hud-dim text-sm px-4">
            <p>DRAG &amp; DROP IMAGE</p>
            <p className="text-xs mt-1">or click to browse — .jpg / .png</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      <button
        disabled={!file || isLoading}
        onClick={() => onAnalyze(file)}
        className="w-full py-2.5 rounded-sm font-display font-600 tracking-wider text-sm transition-all
          bg-hud-green/10 border border-hud-green text-hud-green hover:bg-hud-green/20
          disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-hud-green/10"
      >
        {isLoading ? "ANALYZING FEED..." : "RUN ANOMALY SCAN"}
      </button>
    </div>
  );
}
