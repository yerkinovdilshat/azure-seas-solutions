import React, { useState, useRef } from 'react';
import { useTranslationHelper } from '@/hooks/useTranslationHelper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Send, Upload, File, X } from 'lucide-react';

interface ContactFormData {
  name: string;
  phone: string;
  message: string;
  _hp: string; // honeypot field
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const ContactForm: React.FC = () => {
  const { tSafe, isUsingFallback } = useTranslationHelper();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    phone: '',
    message: '',
    _hp: ''
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: tSafe('contacts.validation.error', 'Validation Error'),
        description: tSafe('contacts.validation.fileTooLarge', 'File size must be less than 10MB'),
        variant: 'destructive'
      });
      return;
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast({
        title: tSafe('contacts.validation.error', 'Validation Error'),
        description: tSafe('contacts.validation.invalidFileType', 'Only PDF, DOC, and DOCX files are allowed'),
        variant: 'destructive'
      });
      return;
    }

    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = (): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.push(tSafe('contacts.validation.nameRequired', 'Name is required'));
    }

    if (!formData.phone.trim() || formData.phone.trim().length < 5) {
      errors.push(tSafe('contacts.validation.phoneRequired', 'Phone is required'));
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.push(tSafe('contacts.validation.messageRequired', 'Message is required'));
    }

    // Check honeypot
    if (formData._hp.trim() !== '') {
      errors.push('Bot detected');
    }

    return { valid: errors.length === 0, errors };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateForm();
    if (!validation.valid) {
      toast({
        title: tSafe('contacts.validation.error', 'Validation Error'),
        description: validation.errors.join(', '),
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      let resumeUrl = null;

      // Upload resume if selected
      if (selectedFile) {
        const fileName = `${Date.now()}_${selectedFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('docs')
          .upload(`resumes/${fileName}`, selectedFile);

        if (uploadError) {
          throw new Error(`Resume upload failed: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('docs')
          .getPublicUrl(uploadData.path);

        resumeUrl = publicUrl;
      }

      // Call edge function for contact form submission
      const { data, error } = await supabase.functions.invoke('contact-form', {
        body: {
          ...formData,
          resumeUrl,
          resumeFileName: selectedFile?.name
        }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        toast({
          title: tSafe('contacts.success.title', 'Message Sent'),
          description: tSafe('contacts.success.description', 'Thank you for your message. We will get back to you soon.')
        });

        // Reset form
        setFormData({
          name: '',
          phone: '',
          message: '',
          _hp: ''
        });
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error(data.error || 'Submission failed');
      }

    } catch (error: any) {
      console.error('Contact form error:', error);
      
      let errorMessage = tSafe('contacts.error.generic', 'Something went wrong. Please try again.');
      
      if (error.message?.includes('Too many requests')) {
        errorMessage = tSafe('contacts.error.rateLimited', 'Too many requests. Please try again later.');
      } else if (error.message?.includes('Validation failed')) {
        errorMessage = tSafe('contacts.error.validation', 'Please check your input and try again.');
      }

      toast({
        title: tSafe('contacts.error.title', 'Error'),
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          {tSafe('contacts.form.title', 'Get in Touch')}
        </h3>
        {isUsingFallback('contacts.form.title') && (
          <p className="text-xs text-muted-foreground/70 italic mb-2">
            {tSafe('common.translationComingSoon', 'Translation coming soon')}
          </p>
        )}
        <p className="text-muted-foreground">
          {tSafe('contacts.form.subtitle', 'Ready to discuss your project? Contact us today for a consultation.')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Honeypot field - hidden from users */}
        <input
          type="text"
          name="_hp"
          value={formData._hp}
          onChange={handleInputChange}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            {tSafe('contacts.name', 'Full Name')} *
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder={tSafe('contacts.namePlaceholder', 'Enter your full name')}
            disabled={loading}
            className="w-full"
            maxLength={100}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            {tSafe('contacts.phone', 'Phone Number')} *
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder={tSafe('contacts.phonePlaceholder', 'Enter your phone number')}
            disabled={loading}
            className="w-full"
            maxLength={20}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-sm font-medium">
            {tSafe('contacts.message', 'Message')} *
          </Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder={tSafe('contacts.messagePlaceholder', 'Tell us about your project or inquiry...')}
            disabled={loading}
            className="w-full min-h-[120px]"
            maxLength={1000}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="resume" className="text-sm font-medium">
            {tSafe('contacts.resume', 'Resume (Optional)')}
          </Label>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              {tSafe('contacts.resumeDescription', 'Upload your resume (PDF, DOC, DOCX - max 10MB)')}
            </p>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                disabled={loading}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {tSafe('contacts.uploadResume', 'Choose File')}
              </Button>
              
              {selectedFile ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <File className="h-4 w-4" />
                  <span className="truncate max-w-48">
                    {tSafe('contacts.fileSelected', 'File selected:')} {selectedFile.name}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    disabled={loading}
                    className="h-auto p-1"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">
                  {tSafe('contacts.noFileChosen', 'No file chosen')}
                </span>
              )}
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full btn-primary"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {tSafe('contacts.sending', 'Sending...')}
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              {tSafe('contacts.submit', 'Send Message')}
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          {tSafe('contacts.form.privacy', 'Your information will be handled according to our privacy policy.')}
        </p>
      </form>
    </div>
  );
};

export default ContactForm;