import React, { useState } from 'react';
import Title from 'antd/es/typography/Title'; 
import { FilePdfOutlined, CloseOutlined } from '@ant-design/icons'; 
import { GetEmployeesRecord } from '@/app/hooks/useGetEmployeesRecord';

// Interface for the file object used by PDFPreview
interface PDFPreviewProps {
  file: {
    name: string;
    url: string;
  };
  onClick: () => void;
}

/**
 * PDFPreview Component
 * Displays a preview of a PDF file using an iframe, or an error message if not a PDF.
 */
export const PDFPreview: React.FC<PDFPreviewProps> = ({ file, onClick }) => {
  const isPDF = file.name.toLowerCase().endsWith('.pdf');
  if (!isPDF) {
    return (
      <div className="flex flex-col items-center justify-center h-48 bg-red-100 rounded-t-lg">
        <FilePdfOutlined style={{ fontSize: 48, color: 'red' }} />
        <span className="text-sm text-red-600 mt-2">Invalid file type</span>
      </div>
    );
  }
  return (
    <div className="cursor-pointer" onClick={onClick}>
      <iframe
        src={file.url}
        title={file.name}
        className="h-48 w-full rounded-t-lg overflow-hidden"
        style={{ border: 'none', }} // Prevents interaction in preview
      />
    </div>
  );
};

// Modal component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-5/6 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-colors duration-200 p-1 rounded-full hover:bg-gray-200"
            aria-label="Close modal"
          >
            <CloseOutlined style={{ fontSize: '20px' }} />
          </button>
        </div>
        <div className="flex-grow p-0 h-[80vh] overflow-auto flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * Dashboard Component
 */
export default function Dashboard() {
  const { useGetEmployeeUser } = GetEmployeesRecord();
  const { data: user } = useGetEmployeeUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ name: string; url: string } | null>(null);

  const handleOpenModal = (file: { name: string; url: string }) => {
    if (file.name.toLowerCase().endsWith('.pdf')) {
      setSelectedFile(file);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
  };

  const dummyPdfFile = {
    name: 'sample_memo.pdf',
    url: '/files/sample_memo.pdf', // Use relative path for public folder
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 grid-rows-auto md:grid-rows-5 gap-4 p-5 font-sans">

      {/* Welcome Section */}
      <div className="col-span-full rounded-lg shadow-xl p-5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <Title level={3} className="text-white !mb-0">Welcome, {user?.first_name}! </Title>
        <p className="text-blue-100 text-sm mt-1">Your dashboard at a glance.</p>
      </div>

      {/* Main Content Area */}
      <div className="col-span-full md:col-span-3 md:row-span-4 md:row-start-2 bg-white rounded-lg shadow-xl p-5 flex flex-col">
        <div className="flex flex-wrap gap-3 mb-6">
          <button className="flex-1 min-w-[150px] bg-green-600 hover:bg-green-700 transition-colors duration-200 text-white font-semibold py-3 px-6 rounded-full shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75" type="button">
            Announcement
          </button>
          <button className="flex-1 min-w-[150px] bg-green-600 hover:bg-green-700 transition-colors duration-200 text-white font-semibold py-3 px-6 rounded-full shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75" type="button">
            Post Notice
          </button>
        </div>
        <div className="flex-1 bg-white rounded-lg shadow-md p-5 mt-2 border border-gray-200">
          <div className="flex flex-col">
            <div className="flex flex-row items-center gap-3">
              <img
                src="https://placehold.co/48x48/A7D9F7/000000?text=PP"
                alt="Profile Picture"
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-300 shadow-sm"
              />
              <div className="flex flex-col leading-tight">
                <span className='text-base font-medium text-gray-800'> Peter, Parker </span>
                <span className='text-xs text-gray-500'>December 9 at 11:43 AM</span>
              </div>
            </div>
            <hr className="mt-4 mb-3 border-gray-200"></hr>
            <div className="flex flex-col mt-3">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">[Notice Title]</h3>
              <p className="text-gray-700 leading-relaxed">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Est harum, minima sint necessitatibus,
                soluta corporis modi odio quaerat dolorum eligendi id inventore quam voluptates,
                eveniet dolor dolorem natus perferendis ipsum?
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Memo Section */}
      <div className="col-span-full md:col-span-2 md:row-span-4 md:col-start-4 md:row-start-2">
        <div className="bg-white rounded-lg shadow-xl p-5 flex flex-col h-full">
            <div className="flex flex-row gap-5">
                <h1
                    className="bg-red-500 text-white flex items-center justify-center font-bold text-lg shadow-md"
                    style={{ height: 50, width: 150, borderRadius: 20 }}
                >
                    Memo
                </h1>
                <button className="w-50  bg-green-600 hover:bg-green-700 transition-colors duration-200 text-white font-semibold py-3 px-6 rounded-full shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75" type="button">
                    Upload Memo
                </button>
            </div>
    
            <div className="mt-4 border border-gray-200 rounded-lg shadow-2xl">
                <PDFPreview file={dummyPdfFile} onClick={() => handleOpenModal(dummyPdfFile)} />
                <div className="p-3 bg-gray-50 rounded-b-lg">
                <p className="text-sm font-semibold text-gray-800">{dummyPdfFile.name}</p>
                <p className="text-xs text-blue-600 hover:underline cursor-pointer" onClick={() => handleOpenModal(dummyPdfFile)}>
                    Click to View Enlarged Memo
                </p>
                </div>
            </div>
        </div>
      </div>

      {/* Modal for Enlarged PDF */}
      {selectedFile && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={selectedFile.name}
        >
          <iframe
            src={selectedFile.url}
            title={selectedFile.name}
            style={{ border: 'none', width: '100%', height: '75vh' }}
            className="rounded-lg"
          />
        </Modal>
      )}
    </div>
  );
}