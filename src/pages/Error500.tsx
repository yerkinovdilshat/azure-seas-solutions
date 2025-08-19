import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Home, RefreshCw } from 'lucide-react';

const Error500 = () => {
  return (
    <Layout>
      <SEO 
        title="500 - Server Error | Marine Support Services"
        description="An internal server error has occurred."
        canonical="/500"
      />
      
      <section className="py-20 min-h-[60vh] flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl font-bold text-destructive mb-4">500</div>
            <h1 className="text-2xl font-semibold text-foreground mb-4">Server Error</h1>
            <p className="text-muted-foreground mb-8">
              We're experiencing some technical difficulties. Please try again later or contact our support team.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button className="btn-marine">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Error500;