"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import MediaModal from '@/components/MediaModal';

interface MediaFile {
  id: number;
  original_name: string;
  filename: string;
  mime_type: string;
  size: number;
  url: string;
  created_at: string;
}

interface OpenModalOptions {
  initialSelected?: MediaFile[];
  onSelect: (files: MediaFile[]) => void;
}

interface MediaModalContextType {
  openMediaModal: (options: OpenModalOptions) => void;
}

const MediaModalContext = createContext<MediaModalContextType | undefined>(undefined);

export function MediaModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialSelected, setInitialSelected] = useState<MediaFile[]>([]);
  const [onSelectCallback, setOnSelectCallback] = useState<((files: MediaFile[]) => void) | null>(null);

  const openMediaModal = (options: OpenModalOptions) => {
    setInitialSelected(options.initialSelected || []);
    setOnSelectCallback(() => options.onSelect);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setInitialSelected([]);
    setOnSelectCallback(null);
  };

  const handleAddFiles = (files: MediaFile[]) => {
    if (onSelectCallback) {
      onSelectCallback(files);
    }
    handleClose();
  };

  return (
    <MediaModalContext.Provider value={{ openMediaModal }}>
      {children}
      <MediaModal
        isOpen={isOpen}
        onClose={handleClose}
        onAddFiles={handleAddFiles}
        initialSelected={initialSelected}
      />
    </MediaModalContext.Provider>
  );
}

export function useMediaModal() {
  const context = useContext(MediaModalContext);
  if (context === undefined) {
    throw new Error('useMediaModal must be used within a MediaModalProvider');
  }
  return context;
}
