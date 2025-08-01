"use client";

import { useEffect } from 'react';
import { Box } from '@mui/material';

interface AdSenseAdProps {
  adSlot: string;
  adFormat?: string;
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function AdSenseAd({ 
  adSlot, 
  adFormat = "auto", 
  responsive = true,
  style = {},
  className = ""
}: AdSenseAdProps) {
  useEffect(() => {
    try {
      // Push ads to AdSense queue when component mounts
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <Box
      className={className}
      sx={{
        display: 'block',
        textAlign: 'center',
        margin: '20px 0',
        ...style,
      }}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          ...style,
        }}
        data-ad-client="ca-pub-5047747164751937"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive.toString()}
      />
    </Box>
  );
}

// Predefined ad components for common placements
export function HeaderAd() {
  return (
    <AdSenseAd
      adSlot="1234567890" // You'll need to replace with actual ad slot IDs
      adFormat="horizontal"
      style={{ minHeight: '90px', maxHeight: '280px' }}
      className="header-ad"
    />
  );
}

export function SidebarAd() {
  return (
    <AdSenseAd
      adSlot="1234567891" // You'll need to replace with actual ad slot IDs
      adFormat="rectangle"
      style={{ minWidth: '250px', maxWidth: '300px', minHeight: '250px' }}
      className="sidebar-ad"
    />
  );
}

export function InlineAd() {
  return (
    <AdSenseAd
      adSlot="1234567892" // You'll need to replace with actual ad slot IDs
      adFormat="fluid"
      style={{ minHeight: '200px' }}
      className="inline-ad"
    />
  );
}