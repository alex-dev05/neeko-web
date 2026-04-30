import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { authenticatedFetch } from '../services/authService'
import './Upload.css'

export const Upload = () => {
  const { user, logout } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [fileName, setFileName] = useState<string>('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setFileName(selectedFile.name)
      setUploadError(null)
      setUploadSuccess(false)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setUploadError('Please select a file')
      return
    }

    try {
      setIsUploading(true)
      setUploadError(null)
      setUploadSuccess(false)

      const formData = new FormData()
      formData.append('file', file)

      const response = await authenticatedFetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        if (response.status === 401) {
          setUploadError('Session expired. Please log in again.')
          logout()
          return
        }
        const data = await response.json()
        throw new Error(data.message || 'Upload failed')
      }

      setUploadSuccess(true)
      setFile(null)
      setFileName('')
      setUploadError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed'
      setUploadError(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="upload-container">
      <div className="upload-card">
        <div className="upload-header">
          <h2>Upload File</h2>
          <div className="user-info">
            <span className="user-email">{user?.email}</span>
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </div>
        </div>

        {uploadError && <div className="upload-error">{uploadError}</div>}
        {uploadSuccess && (
          <div className="upload-success">
            File uploaded successfully!
          </div>
        )}

        <form onSubmit={handleUpload} className="upload-form">
          <div className="file-input-wrapper">
            <input
              type="file"
              id="file-input"
              onChange={handleFileChange}
              disabled={isUploading}
              className="file-input"
            />
            <label htmlFor="file-input" className="file-label">
              {fileName || 'Choose a file...'}
            </label>
          </div>

          <button
            type="submit"
            className="upload-button"
            disabled={!file || isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>

        {file && (
          <div className="file-info">
            <p>
              <strong>File:</strong> {file.name}
            </p>
            <p>
              <strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
