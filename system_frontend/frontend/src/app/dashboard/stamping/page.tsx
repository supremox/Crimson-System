'use client';

import React, { useEffect, useState } from 'react';
import { Image, List, Card, Spin, Button, message } from 'antd';
import { DownloadOutlined, LoadingOutlined } from '@ant-design/icons';
import { GetCompanyRecord } from '@/app/hooks/useGetCompany';

interface Stamping {
  id: number;
  stamping_image_url: string;
}

const StampingGallery = () => {
  const { useGetStampings } = GetCompanyRecord();
  const { data: stamps, isLoading } = useGetStampings();

  const pdfUrl =
    'https://cdn.smartarksys.com/TSL/cro/2025/7/30/1005100773779gh123/lsvx9d3w2sa4cf32ebieq04zz9inftmje5yay1g77ksjkjv3uha40hei3c6lugj8/ev6spoxe5uyxqq4rek4jk3mes8r4ar6w8yqxpgub15u2iecxvb482khblqkyiq25?x-oss-signature-version=OSS4-HMAC-SHA256&x-oss-date=20250731T191409Z&x-oss-expires=179&x-oss-credential=LTAI5tGwycPTLvTBLue51Jsr%2F20250731%2Fap-southeast-6%2Foss%2Faliyun_v4_request&x-oss-signature=81ff90229742f2db9cff7408e3c421b9a6f68e6888c099bf67a04d18a642499d';

  const [selectedStamps, setSelectedStamps] = useState<Stamping[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);

  const DRF_API_URL = 'http://localhost:8000/company/stamped/document/';

  const toggleStampSelection = (item: Stamping) => {
    setSelectedStamps((prev) =>
      prev.some((s) => s.id === item.id)
        ? prev.filter((s) => s.id !== item.id)
        : [...prev, item]
    );
  };

  const handleDownloadStampedPdf = async () => {
    if (!pdfUrl) {
      message.error('PDF URL is not available.');
      return;
    }

    if (selectedStamps.length === 0) {
      message.error('Please select at least one stamp to apply.');
      return;
    }

    setIsDownloading(true);

    try {
      const pageWidth = 595.28; // A4 width in points
      const pageHeight = 841.89;

      const stampsToApply = selectedStamps.map((stamp, index) => {
        let imageWidth = 300;
        let imageHeight = 300;
        let opacity = 0.2;
        let imageY = (pageHeight - imageHeight) / 2;

        if (index === 1) {
          // Second image config
          imageWidth = 150;
          imageHeight = 50;
          opacity = 1;
          imageY = 50; // 50 pts from bottom
        }

        const imageX = (pageWidth - imageWidth) / 2;

        return {
          type: 'image',
          imageUrl: stamp.stamping_image_url,
          imageWidth,
          imageHeight,
          imageX,
          imageY,
          pageIndex: 0,
          opacity,
        };
      });

      const payload = {
        document_url: pdfUrl,
        stamps: stampsToApply,
      };

      const response = await fetch(DRF_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU0MDAzNTg0LCJpYXQiOjE3NTQwMDMyODQsImp0aSI6IjAxMzYxZTQwOWY1YjQ5YzM5MDIzNjkzY2I5MTYzNWM4IiwidXNlcl9pZCI6Mn0.swyUQZDDKh7Kdr5N6rO-zDqqbPUTbDQcNnCOzdXnZWQ',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'PDF generation and stamping failed.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `stamped_document.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      message.success('Stamped PDF downloaded successfully!');
    } catch (error) {
      console.error('Error downloading stamped PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading || !stamps) return <Spin fullscreen />;

  return (
    <div style={{ display: 'flex', padding: 20, gap: 20 }}>
      <List<Stamping>
        style={{ width: 200 }}
        dataSource={stamps}
        renderItem={(item) => (
          <List.Item onClick={() => toggleStampSelection(item)} style={{ cursor: 'pointer' }}>
            <Card
              hoverable
              cover={<Image preview={false} alt="stamp" src={item.stamping_image_url} />}
              style={{
                border: selectedStamps.some((s) => s.id === item.id) ? '2px solid #1677ff' : undefined,
                boxShadow: selectedStamps.some((s) => s.id === item.id) ? '0 0 0 2px #1677ff33' : undefined,
              }}
              size="small"
            >
              <div style={{ textAlign: 'center' }}>Stamping Image {item.id}</div>
            </Card>
          </List.Item>
        )}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="primary"
            icon={isDownloading ? <LoadingOutlined /> : <DownloadOutlined />}
            onClick={handleDownloadStampedPdf}
            disabled={selectedStamps.length === 0 || isDownloading}
          >
            {isDownloading ? 'Generating...' : 'Download Stamped PDF'}
          </Button>
        </div>

        {pdfUrl ? (
          <Card style={{ flex: 1 }}>
            <iframe
              src={pdfUrl}
              width="100%"
              height="100%"
              title="PDF Preview"
              style={{ border: 'none' }}
            />
          </Card>
        ) : (
          <Card style={{ flex: 1 }}>
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <p>Please select a stamp and ensure a PDF template is available.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StampingGallery;
