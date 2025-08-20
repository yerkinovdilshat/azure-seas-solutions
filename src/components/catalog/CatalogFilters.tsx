import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';

interface CatalogFilters {
  search?: string;
  type?: 'production' | 'supply' | 'all';
  manufacturer?: string;
  is_ctkz?: boolean;
}

interface CatalogFiltersProps {
  filters: CatalogFilters;
  manufacturers: string[];
  onFilterChange: (key: string, value: string | boolean | undefined) => void;
  onClearFilters: () => void;
}

export const CatalogFilters: React.FC<CatalogFiltersProps> = ({
  filters,
  manufacturers,
  onFilterChange,
  onClearFilters
}) => {
  const { t } = useTranslation();

  const hasActiveFilters = filters.search || filters.type !== 'all' || filters.manufacturer || filters.is_ctkz;

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t('catalog.filters')}</h2>
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onClearFilters}
                className="h-8"
              >
                <X className="h-4 w-4 mr-1" />
                {t('common.clearFilters')}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">{t('common.search')}</Label>
              <Input
                id="search"
                placeholder={t('catalog.searchProducts')}
                value={filters.search || ''}
                onChange={(e) => onFilterChange('search', e.target.value)}
              />
            </div>

            {/* Type Filter */}
            <div className="space-y-2">
              <Label>{t('catalog.type')}</Label>
              <Select 
                value={filters.type || 'all'} 
                onValueChange={(value) => onFilterChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.all')}</SelectItem>
                  <SelectItem value="production">{t('catalog.production')}</SelectItem>
                  <SelectItem value="supply">{t('catalog.supply')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Manufacturer Filter */}
            <div className="space-y-2">
              <Label>{t('catalog.manufacturer')}</Label>
              <Select 
                value={filters.manufacturer || ''} 
                onValueChange={(value) => onFilterChange('manufacturer', value === 'all' ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('common.all')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.all')}</SelectItem>
                  {manufacturers.map((manufacturer) => (
                    <SelectItem key={manufacturer} value={manufacturer}>
                      {manufacturer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* CT-KZ Filter */}
            <div className="space-y-2">
              <Label htmlFor="ctkz-filter">{t('catalog.ctkzOnly')}</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="ctkz-filter"
                  checked={filters.is_ctkz || false}
                  onCheckedChange={(checked) => onFilterChange('is_ctkz', checked ? true : undefined)}
                />
                <Label htmlFor="ctkz-filter" className="text-sm font-normal">
                  {filters.is_ctkz ? t('common.on') : t('common.off')}
                </Label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};