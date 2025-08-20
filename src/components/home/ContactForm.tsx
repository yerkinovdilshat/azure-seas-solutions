import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Send } from 'lucide-react';

interface ContactFormData {
  name: string;
  phone: string;
  message: string;
  _hp: string; // honeypot field
}

const ContactForm: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
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

  const validateForm = (): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.push(t('contact.validation.nameRequired'));
    }

    if (!formData.phone.trim() || formData.phone.trim().length < 5) {
      errors.push(t('contact.validation.phoneRequired'));
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.push(t('contact.validation.messageRequired'));
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
        title: t('contact.validation.error'),
        description: validation.errors.join(', '),
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      // Call edge function for contact form submission
      const { data, error } = await supabase.functions.invoke('contact-form', {
        body: formData
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        toast({
          title: t('contact.success.title'),
          description: t('contact.success.description')
        });

        // Reset form
        setFormData({
          name: '',
          phone: '',
          message: '',
          _hp: ''
        });
      } else {
        throw new Error(data.error || 'Submission failed');
      }

    } catch (error: any) {
      console.error('Contact form error:', error);
      
      let errorMessage = t('contact.error.generic');
      
      if (error.message?.includes('Too many requests')) {
        errorMessage = t('contact.error.rateLimited');
      } else if (error.message?.includes('Validation failed')) {
        errorMessage = t('contact.error.validation');
      }

      toast({
        title: t('contact.error.title'),
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
          {t('contact.form.title')}
        </h3>
        <p className="text-muted-foreground">
          {t('contact.form.subtitle')}
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
            {t('contact.name')} *
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder={t('contact.namePlaceholder')}
            disabled={loading}
            className="w-full"
            maxLength={100}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            {t('contact.phone')} *
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder={t('contact.phonePlaceholder')}
            disabled={loading}
            className="w-full"
            maxLength={20}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-sm font-medium">
            {t('contact.message')} *
          </Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder={t('contact.messagePlaceholder')}
            disabled={loading}
            className="w-full min-h-[120px]"
            maxLength={1000}
            required
          />
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
              {t('contact.sending')}
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              {t('contact.send')}
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          {t('contact.form.privacy')}
        </p>
      </form>
    </div>
  );
};

export default ContactForm;