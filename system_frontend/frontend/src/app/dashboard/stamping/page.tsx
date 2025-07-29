'use client';

import React, { useEffect, useState } from 'react';
import { Image, List, Card, Spin } from 'antd';
import { GetCompanyRecord } from '@/app/hooks/useGetCompany';

interface Stamping {
  id: number;
  stamping_image_url: string;
}

const StampingGallery = () => {
  const { useGetStampings, useGetPDFTemplate } = GetCompanyRecord();
  const { data: stamps, isLoading } = useGetStampings();
  const { data: pdfUrl } = useGetPDFTemplate();
  const [selected, setSelected] = useState<Stamping | null>(null);



  console.log("template", pdfUrl)
  useEffect(() => {
    if (stamps && stamps.length > 0 && !selected) {
      setSelected(stamps[0]);
    }
  }, [stamps]);

  if (isLoading || !stamps) return <Spin fullscreen />;

  return (
    <div style={{ display: 'flex', padding: 20, gap: 20 }}>
      {/* Sidebar Thumbnails */}
      <List<Stamping>
        style={{ width: 200 }}
        dataSource={stamps}
        renderItem={(item) => (
          <List.Item onClick={() => setSelected(item)} style={{ cursor: 'pointer' }}>
            <Card
              hoverable
              cover={<img alt="stamp" src={item.stamping_image_url} />}
              style={{
                border: selected?.id === item.id ? '2px solid #1677ff' : undefined,
                boxShadow: selected?.id === item.id ? '0 0 0 2px #1677ff33' : undefined,
              }}

              size="small"
            >
              <div style={{ textAlign: 'center' }}>Stamping Image {item.id}</div>
            </Card>
          </List.Item>
        )}
      />

      {/* Main Preview */}
      <div style={{ flex: 1 }}>
        {selected && (
          <Card style={{ width: "100%", height: "100%" }}>
            <iframe
              src={pdfUrl}
              width="100%"
              height="1123px"
              title="PDF Preview"
              style={{ border: "none" }}
            />
          </Card>
        )}
      </div>
    </div>
  );
};

export default StampingGallery;

{/* <Image src={selected.stamping_image_url} alt={`Stamping ${selected.id}`} width="100%"/> */}