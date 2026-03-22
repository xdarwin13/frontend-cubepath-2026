'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { useState, useCallback, useEffect } from 'react';
import { marked } from 'marked';
import TurndownService from 'turndown';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, List, ListOrdered, Quote,
  Code, ImagePlus, Link2, Undo2, Redo2, Save, Eye, Pencil,
  Loader2, Search, X, ExternalLink
} from 'lucide-react';

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

function markdownToHtml(md: string): string {
  if (!md) return '';
  return marked.parse(md, { async: false }) as string;
}

function htmlToMarkdown(html: string): string {
  if (!html) return '';
  return turndown.turndown(html);
}

interface RichTextEditorProps {
  content: string;
  onSave: (markdown: string) => Promise<void>;
  saving?: boolean;
  onSearchImages?: (query: string) => Promise<{ src: string; alt: string }[]>;
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded-lg transition-all ${
        active
          ? 'bg-[#3b82f6]/20 text-[#38bdf8] border border-[#3b82f6]/30'
          : 'text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent'
      } disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

function ImageInsertModal({
  onInsert,
  onClose,
  onSearch,
}: {
  onInsert: (url: string, alt?: string) => void;
  onClose: () => void;
  onSearch?: (query: string) => Promise<{ src: string; alt: string }[]>;
}) {
  const [tab, setTab] = useState<'url' | 'search'>(onSearch ? 'search' : 'url');
  const [url, setUrl] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ src: string; alt: string }[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim() || !onSearch) return;
    setSearching(true);
    try {
      const imgs = await onSearch(query);
      setResults(imgs);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-[#0a1128] border border-slate-700/50 rounded-2xl w-full max-w-lg mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700/30">
          <h3 className="font-semibold text-white">Insertar Imagen</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {onSearch && (
          <div className="flex border-b border-slate-700/30">
            <button
              onClick={() => setTab('search')}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                tab === 'search' ? 'text-[#38bdf8] border-b-2 border-[#38bdf8]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Search className="w-3.5 h-3.5 inline mr-1.5" />
              Buscar
            </button>
            <button
              onClick={() => setTab('url')}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                tab === 'url' ? 'text-[#38bdf8] border-b-2 border-[#38bdf8]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5 inline mr-1.5" />
              URL
            </button>
          </div>
        )}

        <div className="p-4">
          {tab === 'url' ? (
            <div className="space-y-3">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="w-full px-3 py-2.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white text-sm placeholder:text-slate-500 outline-none focus:border-[#38bdf8]/50 transition-colors"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && url.trim()) {
                    onInsert(url.trim());
                    onClose();
                  }
                }}
              />
              <button
                onClick={() => { if (url.trim()) { onInsert(url.trim()); onClose(); } }}
                disabled={!url.trim()}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#6366f1] text-white text-sm font-medium disabled:opacity-40 transition-opacity"
              >
                Insertar
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar imágenes..."
                  className="flex-1 px-3 py-2.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white text-sm placeholder:text-slate-500 outline-none focus:border-[#38bdf8]/50 transition-colors"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  disabled={searching || !query.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#3b82f6]/20 text-[#38bdf8] border border-[#3b82f6]/30 text-sm font-medium disabled:opacity-40 transition-all hover:bg-[#3b82f6]/30"
                >
                  {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </button>
              </div>
              {results.length > 0 && (
                <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
                  {results.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => { onInsert(img.src, img.alt); onClose(); }}
                      className="relative group rounded-lg overflow-hidden border border-slate-700/30 hover:border-[#38bdf8]/40 transition-colors aspect-square"
                    >
                      <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ImagePlus className="w-5 h-5 text-white" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {searching && (
                <div className="flex justify-center py-6">
                  <Loader2 className="w-6 h-6 animate-spin text-[#38bdf8]" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RichTextEditor({ content, onSave, saving, onSearchImages }: RichTextEditorProps) {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [showImageModal, setShowImageModal] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Image.configure({
        HTMLAttributes: { class: 'rounded-xl max-w-full mx-auto my-4 border border-slate-700/30' },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-[#38bdf8] underline cursor-pointer' },
      }),
      Underline,
      Placeholder.configure({
        placeholder: 'Escribe el contenido de la lección aquí...',
      }),
    ],
    content: markdownToHtml(content),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none outline-none min-h-[300px] p-5',
      },
    },
  });

  useEffect(() => {
    if (editor && content) {
      const html = markdownToHtml(content);
      if (editor.getHTML() !== html) {
        editor.commands.setContent(html);
      }
    }
  }, [content]);

  const handleSave = useCallback(async () => {
    if (!editor) return;
    const html = editor.getHTML();
    const md = htmlToMarkdown(html);
    await onSave(md);
  }, [editor, onSave]);

  const togglePreview = useCallback(() => {
    if (mode === 'edit' && editor) {
      setPreviewHtml(editor.getHTML());
    }
    setMode((m) => (m === 'edit' ? 'preview' : 'edit'));
  }, [mode, editor]);

  const insertImage = useCallback(
    (url: string, alt?: string) => {
      editor?.chain().focus().setImage({ src: url, alt: alt || '' }).run();
    },
    [editor],
  );

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href;
    const url = window.prompt('URL del enlace:', prev || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const iconSize = 'w-4 h-4';

  return (
    <div className="border border-slate-700/40 rounded-xl overflow-hidden bg-[#060d1f]/80">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-slate-700/30 bg-[#0a1128]/60">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Negrita">
          <Bold className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Cursiva">
          <Italic className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Subrayado">
          <UnderlineIcon className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Tachado">
          <Strikethrough className={iconSize} />
        </ToolbarButton>

        <div className="w-px h-5 bg-slate-700/40 mx-1" />

        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Título 1">
          <Heading1 className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Título 2">
          <Heading2 className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Título 3">
          <Heading3 className={iconSize} />
        </ToolbarButton>

        <div className="w-px h-5 bg-slate-700/40 mx-1" />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Lista">
          <List className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Lista ordenada">
          <ListOrdered className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Cita">
          <Quote className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Bloque de código">
          <Code className={iconSize} />
        </ToolbarButton>

        <div className="w-px h-5 bg-slate-700/40 mx-1" />

        <ToolbarButton onClick={() => setShowImageModal(true)} title="Insertar imagen">
          <ImagePlus className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={setLink} active={editor.isActive('link')} title="Enlace">
          <Link2 className={iconSize} />
        </ToolbarButton>

        <div className="w-px h-5 bg-slate-700/40 mx-1" />

        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Deshacer">
          <Undo2 className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Rehacer">
          <Redo2 className={iconSize} />
        </ToolbarButton>

        <div className="flex-1" />

        <button
          type="button"
          onClick={togglePreview}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            mode === 'preview'
              ? 'bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent'
          }`}
        >
          {mode === 'preview' ? <Pencil className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {mode === 'preview' ? 'Editar' : 'Vista previa'}
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-[#3b82f6]/20 to-[#6366f1]/20 text-[#38bdf8] border border-[#3b82f6]/20 hover:from-[#3b82f6]/30 hover:to-[#6366f1]/30 transition-all disabled:opacity-40"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Guardar
        </button>
      </div>

      {/* Editor / Preview */}
      {mode === 'edit' ? (
        <EditorContent editor={editor} className="rich-editor" />
      ) : (
        <div
          className="markdown-content p-5 min-h-[300px]"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      )}

      {/* Image modal */}
      {showImageModal && (
        <ImageInsertModal
          onInsert={insertImage}
          onClose={() => setShowImageModal(false)}
          onSearch={onSearchImages}
        />
      )}
    </div>
  );
}
