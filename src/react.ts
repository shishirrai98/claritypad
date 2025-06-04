import React, { useRef, useEffect } from 'react';
import { WysiwygEditor, EditorConfig } from './core';

interface ReactWysiwygProps {
  config: EditorConfig;
}

export const ReactWysiwyg: React.FC<ReactWysiwygProps> = ({ config }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<WysiwygEditor | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorInstance.current = new WysiwygEditor(editorRef.current.id, config);
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
