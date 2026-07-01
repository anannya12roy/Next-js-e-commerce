import React, { useState, useEffect, useRef } from 'react';
import { uploadMedia } from '@/actions/mediaActions';
import styles from './MediaModal.module.css';

interface MediaFile {
  id: number;
  original_name: string;
  filename: string;
  mime_type: string;
  size: number;
  url: string;
  created_at: string;
}

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFiles: (selectedFiles: MediaFile[]) => void;
  initialSelected?: MediaFile[];
}

export default function MediaModal({ isOpen, onClose, onAddFiles, initialSelected = [] }: MediaModalProps) {
  const [activeTab, setActiveTab] = useState<'select' | 'upload'>('select');
  const [selectedImages, setSelectedImages] = useState<MediaFile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [selectedOnly, setSelectedOnly] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);

  const fetchMedia = async () => {
    try {
      const { getMedia } = await import('@/actions/mediaActions');
      const res = await getMedia();
      if (res.success && Array.isArray(res.data)) {
        setMediaFiles(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
      setSelectedImages(initialSelected);
      setActiveTab('select');
      setSearchTerm('');
      setSelectedOnly(false);
      setSortOption('newest');
    }
  }, [isOpen, initialSelected]);

  if (!isOpen) return null;

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadMedia(formData);
      if (res.success) {
        fetchMedia(); // Refresh media list
        setActiveTab('select'); // Go back to select tab
      } else {
        alert(res.error || 'Failed to upload');
      }
      setIsUploading(false);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClear = () => {
    setSelectedImages([]);
  };

  const toggleSelection = (file: MediaFile) => {
    const isSelected = selectedImages.some(img => img.id === file.id);
    if (isSelected) {
      setSelectedImages(prev => prev.filter(img => img.id !== file.id));
    } else {
      setSelectedImages(prev => [...prev, file]);
    }
  };

  // Filtering and Sorting
  let displayedFiles = [...mediaFiles];
  
  if (selectedOnly) {
    displayedFiles = displayedFiles.filter(f => selectedImages.some(img => img.id === f.id));
  }

  if (searchTerm) {
    displayedFiles = displayedFiles.filter(f => f.original_name.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  displayedFiles.sort((a, b) => {
    if (sortOption === 'newest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (sortOption === 'oldest') {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    return 0;
  });

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header Tabs */}
        <div className={styles.header}>
          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${activeTab === 'select' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('select')}
            >
              Select File
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'upload' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              Upload New
            </button>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>

        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          Root
        </div>

        {activeTab === 'select' ? (
          <>
            {/* Toolbar */}
            <div className={styles.toolbar}>
              <select 
                className={styles.sortSelect}
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="newest">Sort by newest</option>
                <option value="oldest">Sort by oldest</option>
              </select>
              
              <label className={styles.selectedOnly}>
                <input 
                  type="checkbox" 
                  checked={selectedOnly}
                  onChange={(e) => setSelectedOnly(e.target.checked)}
                />
                Selected Only
              </label>

              <input 
                type="text" 
                placeholder="Search your files" 
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <button className={styles.newFolderBtn}>+ New Folder</button>
            </div>

            {/* Grid Body */}
            <div className={styles.body}>
              <div className={styles.grid}>
                {displayedFiles.map(file => {
                  const isSelected = selectedImages.some(img => img.id === file.id);
                  return (
                    <div 
                      key={file.id} 
                      className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
                      onClick={() => toggleSelection(file)}
                      title={file.original_name}
                    >
                      <div className={styles.imageWrapper}>
                        <img src={file.url} alt={file.original_name} className={styles.image} />
                      </div>
                      <div className={styles.cardInfo}>
                        <div className={styles.filename}>{file.original_name}</div>
                        <div className={styles.filesize}>{formatSize(file.size)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {displayedFiles.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  No files found.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={styles.footer}>
              <div className={styles.footerLeft}>
                <div className={styles.selectedCount}>{selectedImages.length} File selected</div>
                <button className={styles.clearBtn} onClick={handleClear}>Clear</button>
              </div>
              
              <div className={styles.pagination}>
                <button className={`${styles.pageBtn} ${styles.pageBtnPrev}`}>Prev</button>
                <button className={`${styles.pageBtn} ${styles.pageBtnNext}`}>Next</button>
              </div>

              <button className={styles.addFilesBtn} onClick={() => onAddFiles(selectedImages)}>
                Add Files
              </button>
            </div>
          </>
        ) : (
          /* Upload Tab Content */
          <div className={styles.uploadContainer}>
            <div className={styles.uploadIcon}>📁</div>
            <div className={styles.uploadText}>
              {isUploading ? 'Uploading...' : 'Click browse to upload a new file'}
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleUpload}
              accept="image/*"
            />
            <button 
              className={styles.browseBtn} 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              Browse
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
