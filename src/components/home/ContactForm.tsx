import React, { useState, useRef } from 'react';
import { useTranslationHelper } from '@/hooks/useTranslationHelper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useSubmitContactForm } from '@/hooks/useContactsData';
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
  const { mutateAsync: submitForm } = useSubmitContactForm();

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    phone: '',
    message: '',
    _hp: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast({
        title: tSafe('contact.form.error.fileType', 'Invalid file type'),
        description: tSafe('contact.form.error.fileTypeDesc', 'Please upload PDF or Word documents only'),
        variant: "destructive",
      });
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: tSafe('contact.form.error.fileSize', 'File too large'),
        description: tSafe('contact.form.error.fileSizeDesc', 'File must be smaller than 10MB'),
        variant: "destructive",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check honeypot
    if (formData._hp) {
      return; // Silent fail for bots
    }

    // Validate required fields
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      toast({
        title: tSafe('contact.form.error.required', 'Required fields missing'),
        description: tSafe('contact.form.error.requiredDesc', 'Please fill in all required fields'),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('name', formData.name);
      formDataToSubmit.append('phone', formData.phone);
      formDataToSubmit.append('message', formData.message);
      
      if (selectedFile) {
        formDataToSubmit.append('resume', selectedFile);
      }

      await submitForm(formDataToSubmit);
      
      // Reset form
      setFormData({ name: '', phone: '', message: '', _hp: '' });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      toast({
        title: tSafe('contact.form.success.title', 'Message sent successfully'),
        description: tSafe('contact.form.success.description', 'We will get back to you soon'),
      });
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast({
        title: tSafe('contact.form.error.send', 'Failed to send message'),
        description: error.message || tSafe('contact.form.error.sendDesc', 'Please try again later'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-background relative">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {tSafe('contact.form.title', 'Send us a message')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {tSafe('contact.form.subtitle', 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot field - hidden from users */}
            <input
              type="text"
              name="_hp"
              value={formData._hp}
              onChange={handleInputChange}
              style={{ position: 'absolute', left: '-9999px' }}
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  {tSafe('contact.form.name', 'Full Name')} *
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder={tSafe('contact.form.namePlaceholder', 'Your full name')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground">
                  {tSafe('contact.form.phone', 'Phone Number')} *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder={tSafe('contact.form.phonePlaceholder', '+7 (xxx) xxx-xx-xx')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-foreground">
                {tSafe('contact.form.message', 'Message')} *
              </Label>
              <Textarea
                id="message"
                name="message"
                required
                value={formData.message}
                onChange={handleInputChange}
                rows={6}
                className="w-full resize-none"
                placeholder={tSafe('contact.form.messagePlaceholder', 'Tell us about your project or inquiry...')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resume" className="text-foreground">
                {tSafe('contact.form.resume', 'Resume/CV')} 
                <span className="text-muted-foreground text-sm ml-2">
                  ({tSafe('contact.form.optional', 'optional')})
                </span>
              </Label>
              
              {!selectedFile ? (
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    {tSafe('contact.form.uploadText', 'Click to upload or drag and drop')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {tSafe('contact.form.fileTypes', 'PDF, DOC, DOCX (max 10MB)')}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {tSafe('contact.form.chooseFile', 'Choose File')}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <File className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {tSafe('contact.form.sending', 'Sending...')}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {tSafe('contact.form.submit', 'Send Message')}
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              {tSafe('contact.form.privacy', 'By submitting this form, you agree to our privacy policy.')}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;