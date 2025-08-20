import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, Clock, FileText } from 'lucide-react';
import { useLatestNews } from '@/hooks/useHomeData';

const NewsSection: React.FC = () => {
  const { t } = useTranslation();
  const { data: news, loading, error } = useLatestNews();

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-8 bg-muted rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded mb-4"></div>
                  <div className="h-4 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || news.length === 0) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {t('news.title')}
          </h2>
          <p className="text-muted-foreground mb-8">
            {t('news.noNews')}
          </p>
          <Link to="/news">
            <Button className="btn-primary">
              {t('news.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: any) => {
    if (!content) return '2';
    const text = typeof content === 'string' ? content : JSON.stringify(content);
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime.toString();
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {t('news.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('news.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {news.map((article: any) => (
            <Card 
              key={article.id} 
              className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="relative overflow-hidden">
                {article.featured_image ? (
                  <img
                    src={article.featured_image}
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-48 bg-muted/50 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                
                {article.is_featured && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="default" className="bg-primary text-primary-foreground">
                      {t('common.featured')}
                    </Badge>
                  </div>
                )}
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(article.published_at)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{getReadingTime(article.content_rich)} min read</span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
              </CardHeader>

              <CardContent className="pt-0">
                {article.excerpt && (
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>
                )}

                <Link to={`/news/${article.slug}`}>
                  <Button variant="outline" size="sm" className="w-full group/btn">
                    {t('news.readArticle')}
                    <ArrowRight className="ml-2 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/news">
            <Button size="lg" className="btn-primary">
              {t('news.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;