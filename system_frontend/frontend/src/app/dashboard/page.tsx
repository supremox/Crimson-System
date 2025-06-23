"use client"

import React from 'react';
import {Layout, theme } from 'antd'

const { Content } = Layout;

const App: React.FC = () => {
  // const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout>
        <Content style={{ margin: '0 16px' }}>
          <div className="flex bg-white rounded-lg shadow-md p-5 mt-5 mx-4" style={{borderRadius: 20}}>
              <div className="flex flex-col">
                <div className="flex flex-row align-left gap-4">
                  <button className="self-center bg-green-600"
                    style={{ height: 45, width: 200, borderRadius: 20, color: '#fff' }} type="submit" name="add_department" >
                    Anouncement
                  </button>
                  <button className="self-center bg-green-600"
                    style={{ height: 45, width: 200, borderRadius: 20, color: '#fff' }} type="submit" name="add_department" >
                    Upload Memo
                  </button>
                  <button className="self-center bg-green-600" style={{ height:45, width:200, borderRadius: 20, color: '#fff' }} type="submit" name="add_department" >
                    Post Notice
                  </button>
                </div>
                <div className="flex flex-row gap-4">
                  <div className="flex flex-2 bg-gray-300 rounded-lg shadow-md p-5 mt-4" style={{borderRadius: 20}} >
                      <div className="flex flex-col align-left">
                        <h1 className="bg-red-400 flex items-center shadow-md justify-center" style={{height:50, width:150, borderRadius: 20, color: '#fff'}}>Notice</h1>
                      < div className="flex flex-1 bg-white rounded-lg shadow-md p-5 mt-2">
                        <div className="flex flex-col">
                          <div className="flex flex-row items-center gap-2">
                            <img
                                src="/img/ppic.png"
                                alt="Profile Picture"
                                className="w-12 h-12 rounded-full mt-2 mr-5 object-cover border border-blue-300 shadow" />
                            <div className="flex flex-col leading-tight">
                              <span className='text-sm' > Peter, Parker </span>
                            <span className='text-sm'>December 9 at 11:43 AM</span>
                          </div>
                        </div>
                        <hr className="mt-3 mb-2"></hr>
                        <div className="flex flex-col mt-3">
                          <h3 className="mb-2">[Notice Title]</h3>
                          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            Est harum, minima sint necessitatibus,
                            soluta corporis modi odio quaerat dolorum eligendi id inventore quam voluptates,
                            eveniet dolor dolorem natus perferendis ipsum?
                          </p>
                        </div>
                      </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-1 bg-gray-300 rounded-lg shadow-md p-5 mt-4" style={{borderRadius: 20 }}>
                    <div className="flex flex-col">
                      <div className="align-left">
                        <h1 className="mx-auto bg-red-400 flex items-center shadow-md justify-center"
                          style={{ height:50, width:150, borderRadius: 20, color: '#fff' }}>
                          Memo
                        </h1>
                      </div>
                      <div className="flex flex-1 bg-white rounded-lg shadow-md p-5 mt-4">

                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </Content >
      </Layout >
    </Layout >
  );
};

export default App;