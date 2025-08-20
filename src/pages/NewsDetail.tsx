import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import { CustomBreadcrumb } from '@/components/ui/custom-breadcrumb';
import { useNewsArticle } from '@/hooks/useContent';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const NewsDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { data: article, loading, error } = useNewsArticle(slug!);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>{t('common.loading')}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !article) {
    return (
      <Layout>
        <SEO 
          title="Article Not Found"
          description="The requested article could not be found."
        />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{t('common.error')}</h1>
            <p className="text-muted-foreground mb-4">
              {error || 'Article not found'}
            </p>
            <Link to="/news">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('common.back')}
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const breadcrumbItems = [
    { label: t('navigation.news'), href: '/news' },
    { label: article.title }
  ];

  return (
    <Layout>
      <SEO 
        title={article.title}
        description={article.excerpt}
        ogImage={article.featured_image}
      />
      
      <main className="pt-14">
        {/* Hero Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <CustomBreadcrumb items={breadcrumbItems} className="mb-6" />
            
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                {article.title}
              </h1>
              
              {article.excerpt && (
                <p className="text-xl text-muted-foreground mb-6">
                  {article.excerpt}
                </p>
              )}
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {t('news.publishedOn')} {new Date(article.published_at).toLocaleDateString()}
                  </span>
                </div>
                {article.is_featured && (
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                    {t('common.featured')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        {article.featured_image && (
          <section className="py-8">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <img 
                  src={article.featured_image} 
                  alt={article.title}
                  className="w-full h-auto rounded-lg object-cover"
                />
              </div>
            </div>
          </section>
        )}

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {article.content_rich && (
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: article.content_rich }}
                />
              )}

              {/* Gallery */}
              {article.gallery_images && article.gallery_images.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-2xl font-bold mb-6">Gallery</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {article.gallery_images.map((image, index) => (
                      <div key={index} className="rounded-lg overflow-hidden">
                        <img 
                          src={image} 
                          alt={`${article.title} ${index + 1}`}
                          className="w-full h-48 object-cover hover:scale-105 transition-transform cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video */}
              {article.video_url && (
                <div className="mt-12">
                  <h3 className="text-2xl font-bold mb-6">Video</h3>
                  <div className="aspect-video">
                    <iframe
                      src={article.video_url}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                      title={`${article.title} Video`}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default NewsDetail;