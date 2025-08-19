import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bold, Italic, List, Link, Eye, Edit } from 'lucide-react';

interface RichTextEditorProps {
  value: any;
  onChange: (value: any) => void;
  placeholder?: string;
}

const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const [isPreview, setIsPreview] = useState(false);
  const [textValue, setTextValue] = useState(() => {
    // Convert from JSON to plain text for editing
    if (value && value.blocks) {
      return value.blocks
        .map((block: any) => block.data?.text || '')
        .join('\n\n');
    }
    return '';
  });

  const handleTextChange = (newText: string) => {
    setTextValue(newText);
    
    // Convert plain text to JSON structure
    const blocks = newText
      .split('\n\n')
      .filter(text => text.trim())
      .map(text => ({
        type: 'paragraph',
        data: { text: text.trim() }
      }));

    onChange({
      blocks: blocks.length > 0 ? blocks : [{
        type: 'paragraph',
        data: { text: '' }
      }]
    });
  };

  const formatText = (type: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textValue.substring(start, end);
    
    if (!selectedText) return;

    let formattedText = selectedText;
    switch (type) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'list':
        formattedText = selectedText
          .split('\n')
          .map(line => line.trim() ? `• ${line}` : line)
          .join('\n');
        break;
    }

    const newText = textValue.substring(0, start) + formattedText + textValue.substring(end);
    handleTextChange(newText);
  };

  const renderPreview = () => {
    if (!value || !value.blocks) return <p className="text-muted-foreground">No content</p>;

    return (
      <div className="space-y-4">
        {value.blocks.map((block: any, index: number) => {
          const text = block.data?.text || '';
          
          // Simple markdown rendering
          let renderedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^• (.+)$/gm, '<li>$1</li>');

          // Wrap list items
          if (renderedText.includes('<li>')) {
            renderedText = `<ul>${renderedText}</ul>`;
          }

          return (
            <div
              key={index}
              dangerouslySetInnerHTML={{ __html: renderedText }}
              className="prose prose-sm max-w-none"
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => formatText('bold')}
            disabled={isPreview}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => formatText('italic')}
            disabled={isPreview}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => formatText('list')}
            disabled={isPreview}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsPreview(!isPreview)}
        >
          {isPreview ? (
            <>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </>
          )}
        </Button>
      </div>

      {/* Editor/Preview */}
      {isPreview ? (
        <div className="min-h-[200px] p-4 border border-border rounded-md bg-background">
          {renderPreview()}
        </div>
      ) : (
        <Textarea
          value={textValue}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={placeholder || "Enter content..."}
          className="min-h-[200px] resize-none"
        />
      )}

      <p className="text-xs text-muted-foreground">
        Use **bold**, *italic*, and • for lists. Preview to see formatted output.
      </p>
    </div>
  );
};

export default RichTextEditor;