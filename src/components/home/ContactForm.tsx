import React, { useState } from 'react';
import { useTranslationHelper } from '@/hooks/useTranslationHelper';
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
  const { tSafe, isUsingFallback } = useTranslationHelper();
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
      // Call edge function for contact form submission
      const { data, error } = await supabase.functions.invoke('contact-form', {
        body: formData
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