"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './media.module.css';

interface MediaFile {
  id: number;
  original_name: string;
  filename: string;
  mime_type: string;
  size: number;
  url: string;
  created_at: string;
}

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  
  // View state for toggling between list and drag&drop upload
  const [isUploadView, setIsUploadView] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Modal state for deletion confirmation
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Drawer state for file info details
  const [detailsFile, setDetailsFile] = useState<MediaFile | null>(null);

  // Toast state
  const [toastMessage, setToastMessage] = useState<{ text: string, isError: boolean } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (text: string, isError = false) => {
    setToastMessage({ text, isError });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const fetchFiles = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/media');
      const data = await res.json();
      setFiles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch media:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toISOString().replace('T', ' ').substring(0, 19);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:5000/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        fetchFiles();
        setIsUploadView(false); // Go back to list after successful upload
        showToast('File uploaded successfully!');
      } else {
        showToast('Failed to upload file', true);
      }
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Error uploading file', true);
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      await uploadFile(selectedFile);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      await uploadFile(droppedFile);
      e.dataTransfer.clearData();
    }
  };

  const confirmDelete = async () => {
    if (deletingId === null) return;
    
    try {
      await fetch(`http://localhost:5000/api/media/${deletingId}`, { method: 'DELETE' });
      fetchFiles();
      showToast('File deleted permanently');
    } catch (error) {
      console.error('Delete failed:', error);
      showToast('Failed to delete file', true);
    }
    setDeletingId(null);
  };

  const triggerDelete = (id: number) => {
    setDeletingId(id);
    setActiveDropdown(null);
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('Link copied to clipboard!');
    setActiveDropdown(null);
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      // Fetch as blob to force a proper download rather than just opening the URL in browser
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error('Download failed via blob, falling back to window.open', error);
      window.open(url, '_blank');
    }
    setActiveDropdown(null);
  };

  const showDetails = (file: MediaFile) => {
    setDetailsFile(file);
    setActiveDropdown(null);
  };

  if (isUploadView) {
    return (
      <div className={styles.container}>
        <div className={styles.headerCard}>
          <h1 className={styles.title}>Upload New File</h1>
          <button className={styles.backBtn} onClick={() => setIsUploadView(false)}>
            &lt; Back to uploaded files
          </button>
        </div>

        <div className={styles.uploadCard}>
          <div className={styles.uploadCardHeader}>
            Drag & drop your files
          </div>
          <div className={styles.dropzoneContainer}>
            <div 
              className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerFileInput}
            >
              <div className={styles.dropzoneText}>
                Drop files here, paste or <span className={styles.browseLink}>Browse</span>
              </div>
            </div>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            className={styles.hiddenFileInput} 
            onChange={handleFileChange}
            accept="image/*" 
          />
        </div>
        
        {toastMessage && (
          <div className={`${styles.toast} ${toastMessage.isError ? styles.toastError : ''}`}>
            {toastMessage.text}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerCard}>
        <h1 className={styles.title}>All uploaded files</h1>
        <div className={styles.controls}>
          <select className={styles.select}>
            <option>Sort by newest</option>
            <option>Sort by oldest</option>
            <option>Sort by smallest</option>
            <option>Sort by largest</option>
          </select>
          <input type="text" placeholder="Search your files" className={styles.searchInput} />
          <button className={styles.searchBtn}>Search</button>
          
          <button className={styles.uploadBtn} onClick={() => setIsUploadView(true)}>Upload New</button>
        </div>
      </div>

      {loading ? (
        <p>Loading files...</p>
      ) : (
        <div className={styles.grid}>
          {files.map((file) => (
            <div key={file.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img src={file.url} alt={file.original_name} className={styles.image} />
                
                {/* Three dots menu */}
                <button 
                  className={styles.menuBtn} 
                  onClick={() => setActiveDropdown(activeDropdown === file.id ? null : file.id)}
                >
                  &#8942;
                </button>

                {activeDropdown === file.id && (
                  <div className={styles.dropdown}>
                    <button className={styles.dropdownItem} onClick={() => showDetails(file)}>
                      <span className={styles.dropdownIcon}>&#8505;</span> Details Info
                    </button>
                    <button className={styles.dropdownItem} onClick={() => handleDownload(file.url, file.original_name)}>
                      <span className={styles.dropdownIcon}>&#8681;</span> Download
                    </button>
                    <button className={styles.dropdownItem} onClick={() => handleCopyLink(file.url)}>
                      <span className={styles.dropdownIcon}>&#128279;</span> Copy Link
                    </button>
                    <button className={`${styles.dropdownItem} ${styles.dropdownItemDelete}`} onClick={() => triggerDelete(file.id)}>
                      <span className={styles.dropdownIcon}>&#128465;</span> Delete
                    </button>
                  </div>
                )}
              </div>
              <div className={styles.cardFooter}>
                <div className={styles.filename} title={file.original_name}>
                  {file.original_name}
                </div>
                <div className={styles.filesize}>
                  {formatSize(file.size)}
                </div>
              </div>
            </div>
          ))}
          
          {files.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
              No files uploaded yet. Click "Upload New" to get started.
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId !== null && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Delete File</h3>
            <p className={styles.modalText}>Are you sure you want to delete this file? This action cannot be undone.</p>
            <div className={styles.modalActions}>
              <button className={styles.modalBtnCancel} onClick={() => setDeletingId(null)}>Cancel</button>
              <button className={styles.modalBtnConfirm} onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Details Info Drawer */}
      {detailsFile !== null && (
        <>
          <div className={styles.drawerOverlay} onClick={() => setDetailsFile(null)}></div>
          <div className={styles.drawer}>
            <div className={styles.drawerHeader}>
              <h2 className={styles.drawerTitle}>File Info</h2>
              <button className={styles.closeBtn} onClick={() => setDetailsFile(null)}>&#10005;</button>
            </div>
            
            <div className={styles.drawerBody}>
              <div className={styles.detailGroup}>
                <div className={styles.detailLabel}>File Name</div>
                <input type="text" readOnly className={styles.detailInput} value={detailsFile.filename} />
              </div>
              
              <div className={styles.detailGroup}>
                <div className={styles.detailLabel}>File Type</div>
                <input type="text" readOnly className={styles.detailInput} value={detailsFile.mime_type.split('/')[0] || detailsFile.mime_type} />
              </div>
              
              <div className={styles.detailGroup}>
                <div className={styles.detailLabel}>File Size</div>
                <input type="text" readOnly className={styles.detailInput} value={formatSize(detailsFile.size)} />
              </div>
              
              <div className={styles.detailGroup}>
                <div className={styles.detailLabel}>Uploaded By</div>
                <input type="text" readOnly className={styles.detailInput} value="Admin" />
              </div>
              
              <div className={styles.detailGroup}>
                <div className={styles.detailLabel}>Uploaded At</div>
                <input type="text" readOnly className={styles.detailInput} value={formatDate(detailsFile.created_at)} />
              </div>
            </div>
            
            <div className={styles.drawerFooter}>
              <button className={styles.downloadBtnDrawer} onClick={() => handleDownload(detailsFile.url, detailsFile.original_name)}>
                Download
              </button>
            </div>
          </div>
        </>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`${styles.toast} ${toastMessage.isError ? styles.toastError : ''}`}>
          {toastMessage.text}
        </div>
      )}
    </div>
  );
}
