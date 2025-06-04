import React, { useEffect, useRef } from 'react';
import { EditorConfig } from '../types/type';
import { ClarityPadEditor } from './core';

interface ClarityPadProps {
  config: EditorConfig;
}

export const ClarityPad: React.FC<ClarityPadProps> = ({ config }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<ClarityPadEditor | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorInstance.current = new ClarityPadEditor(
        editorRef.current.id,
        config
      );
    }
    return () => editorInstance.current?.destroy();
  }, [config]);

  return (
    <div
      id={`editor-${Math.random().toString(36).substr(2, 9)}`}
      ref={editorRef}
    />
  );
};
