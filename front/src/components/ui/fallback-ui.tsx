import React from 'react';
import { AlertTriangle, RefreshCw, WifiOff, Database } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Skeleton } from './skeleton';

interface FallbackUIProps {
  type: 'error' | 'loading' | 'no-data' | 'network-error';
  title?: string;
  message?: string;
  onRetry?: () => void;
  children?: React.ReactNode;
}

export const FallbackUI: React.FC<FallbackUIProps> = ({ 
  type, 
  title, 
  message, 
  onRetry,
  children 
}) => {
  const getConfig = () => {
    switch (type) {
      case 'error':
        return {
          icon: AlertTriangle,
          defaultTitle: 'Something went wrong',
          defaultMessage: 'An error occurred while loading the data. Please try again.',
          className: 'border-red-200 bg-red-50',
          iconClassName: 'text-red-600'
        };
      case 'loading':
        return {
          icon: Database,
          defaultTitle: 'Loading...',
          defaultMessage: 'Please wait while we fetch your data.',
          className: 'border-blue-200 bg-blue-50',
          iconClassName: 'text-blue-600'
        };
      case 'no-data':
        return {
          icon: Database,
          defaultTitle: 'No data available',
          defaultMessage: 'There is no data to display at the moment.',
          className: 'border-gray-200 bg-gray-50',
          iconClassName: 'text-gray-600'
        };
      case 'network-error':
        return {
          icon: WifiOff,
          defaultTitle: 'Connection Error',
          defaultMessage: 'Unable to connect to the server. Please check your internet connection.',
          className: 'border-yellow-200 bg-yellow-50',
          iconClassName: 'text-yellow-600'
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  if (type === 'loading') {
    return (
      <div className="space-y-4">
        <Card className={config.className}>
          <CardHeader>
            <div className="flex items-center">
              <Icon className={`mr-2 h-5 w-5 ${config.iconClassName}`} />
              <Skeleton className="h-6 w-32" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </CardContent>
        </Card>
        {children}
      </div>
    );
  }

  return (
    <Card className={config.className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon className={`mr-2 h-5 w-5 ${config.iconClassName}`} />
          {title || config.defaultTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm">
          {message || config.defaultMessage}
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// Loading skeleton components
export const ProjectCardSkeleton = () => (
  <Card className="card-enhanced">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between space-x-2">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-4 w-full" />
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-8" />
        </div>
        <Skeleton className="h-2 w-full" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-9 w-full" />
    </CardContent>
  </Card>
);

export const TaskCardSkeleton = () => (
  <Card className="card-enhanced">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between space-x-2">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <div className="flex space-x-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <Skeleton className="h-6 w-6 rounded" />
      </div>
    </CardHeader>
    <CardContent className="pt-0 space-y-3">
      <Skeleton className="h-3 w-full" />
      <div className="flex items-center space-x-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-3 w-16" />
      </div>
    </CardContent>
  </Card>
);

export const StatsCardSkeleton = () => (
  <Card className="card-enhanced">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-4" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-16 mb-1" />
      <Skeleton className="h-3 w-20" />
    </CardContent>
  </Card>
);
