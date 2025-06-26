"use client";

// import { AuthActions } from "@/app/auth/utils";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getQueryClient } from "@/app/components/getQueryClient"; 
import axiosInstance from "../../../../server/instance_axios";

import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Input,
  DatePicker,
  Select,
  Form,
  FormProps,
} from "antd";
import { RightOutlined, LeftOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

interface CalendarEventsModel {
  event_date: string;
  event_name: string;
  event_type: string;
  event_description: string;
}

type FieldType = {
    event_date: string;
    event_name: string;
    event_type: string;
    event_description: string;
  };

  const queryClient = getQueryClient()

export default function CalendarPage() {
  const { data: calendarEvent } = useQuery<{
    count: number;
    next: number | null;
    previous: number | null;
    results: CalendarEventsModel[];
  }>({
    queryKey: ["calendar-events"],
    queryFn: () =>  axiosInstance.get("/calendar/event/").then(res => res.data),
  });

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarHTML, setCalendarHTML] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    event_name: "",
    event_date: "",
    event_description: "",
    event_type: "",  
  });

  useEffect(() => {
    renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
  }, [currentDate]);

  const eventTypes = [
    { label: "Regular holiday", value: "Regular holiday" },
    {
      label: "Special Non-working Holiday",
      value: "Special Non-working Holiday",
    },
    { label: "Company event", value: "Company event" },
  ];

  const handleTypeChange = (value: string) => {
    setForm({ ...form, event_type: value });
  };

  const renderCalendar = (year: number, month: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const date = new Date(year, month, 1);
    const startDay = (date.getDay() + 6) % 7; // start from Monday
    const today = new Date();
    let day = 1 - startDay;
    let html = "";

    for (let row = 0; row < 6; row++) {
      html += "<tr>";
      for (let col = 0; col < 7; col++, day++) {
        if (day < 1 || day > daysInMonth) {
          html += '<td class="py-4 text-center"></td>';
        } else {
          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
            html += `<td class="py-4 text-center">
            <div class="w-12 h-12 flex items-center justify-center mx-auto rounded-full cursor-pointer ${
              isToday ? "bg-blue-500 text-white font-bold" : "hover:bg-blue-100"
            }">
              ${day}
            </div>
          </td>`;
        }
      }
      html += "</tr>";
      if (day > daysInMonth) break;
    }
    setCalendarHTML(html);
  };

  const updateCalendar = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDateChange = (
    date: dayjs.Dayjs | null,
    dateString: string | string[]
  ) => {
    setForm({
      ...form,
      event_date: date ? date.format("YYYY-MM-DD") : "",
    });
  };

  const handleAddEvent = () => {
    // setEvents([...events, form]);
    setForm({ event_name: "", event_date: "", event_description: "", event_type: "" });
    setShowModal(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Regular holiday":
        return "#ef4444"; // red-500
      case "Special Non-working Holiday":
        return "#f59e42"; // orange-400
      case "Company event":
        return "#3b82f6"; // blue-500
      default:
        return "#6b7280"; // gray-500
    }
  };

  const { mutate } = useMutation({
    mutationFn: async (data: FieldType) => {
      return await axiosInstance.post("/calendar/event/", data);
    },
  });

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const formattedValues: FieldType = {
      ...values,
      event_date: values.event_date ? dayjs(values.event_date).format("YYYY-MM-DD") : "",
    };
    console.log(formattedValues.event_date)
    mutate(formattedValues, {
      onSuccess: (data) => {
        if (data.status === 201) {
          queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
          setShowModal(false);
        }
      },
      onError: (error) => {
        alert(error)
      }
    })
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <section className="home">
      <div className="w-full h-screen flex items-center bg-white justify-center">
        <div className="flex flex-col md:flex-row w-full h-full max-w-7xl mx-auto shadow-lg gap-8 rounded-lg p-8">
          {/* Calendar */}
          <div className="flex-6 flex flex-col bg-blue-200 rounded-lg p-8 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <Button
                aria-label="calendar back"
                type="text"
                icon={<LeftOutlined />}
                onClick={() => updateCalendar(-1)}
              />
              <span
                className="text-2xl font-bold text-gray-800"
                id="calendar-month-label"
              >
                {currentDate.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <Button
                aria-label="calendar forward"
                type="text"
                icon={<RightOutlined />}
                onClick={() => updateCalendar(1)}
              />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <table className="w-full h-full table-fixed border-collapse text-base sm:text-lg">
                <thead>
                  <tr>
                    {weekdays.map((day, index) => (
                      <th
                        key={index}
                        className="py-2 text-center text-xl font-semibold text-gray-700"
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody
                  id="calendar-body"
                  dangerouslySetInnerHTML={{ __html: calendarHTML }}
                ></tbody>
              </table>
            </div>
          </div>

          {/* Events Panel */}
          <div className="flex-3 bg-gray-700 rounded-lg p-8 shadow-md overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Events</h2>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setShowModal(true)}
              >
                Add Event
              </Button>
            </div>
            <div id="event-list">
              {/* {calendarEvent?.results.length === 0 && (
                <div className="text-white text-sm opacity-60 mb-4">
                  No events yet.
                </div>
              )} */}
              {calendarEvent ? 
              calendarEvent?.results?.length > 0 
                ? calendarEvent?.results.map((event, idx) => (
                <div
                  key={idx}
                  className="border-b pb-4 border-gray-400 border-dashed mb-4"
                  style={{
                    borderLeft: `6px solid ${getTypeColor(event.event_type)}`,
                    paddingLeft: 12,
                  }}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span
                        style={{
                          display: "inline-block",
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          background: getTypeColor(event.event_type),
                        }}
                      ></span>
                      <span className="text-md font-medium text-gray-400">
                        {event.event_date}
                      </span>
                    </div>
                    <span className="text-lg font-medium ml-6 text-white">
                      {event.event_name}
                    </span>
                  </div>
                  <p
                    className="text-sm text-white ml-6"
                    style={{ color: getTypeColor(event.event_type) }}
                  >
                    {event.event_type}
                  </p>
                  <p className="text-sm text-white ml-6">{event.event_description}</p>
                </div>
              )) : (
                <div className="text-white text-sm opacity-60 mb-4">
                  No events yet.
                </div>
              ) : undefined}
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      <Modal
        title="Add New Event"
        open={showModal}
        onOk={handleAddEvent}
        onCancel={() => setShowModal(false)}
        okText="Save Event"
        footer={null}
        // okButtonProps={{
        //   disabled: !form.name || !form.date || !form.description,
        // }}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div className="mb-4">
            <label className="block mb-1 font-medium">Event Name</label>
            <Form.Item
              label="Event Name"
              name="event_name"
              rules={[
                { required: true, message: "Please input your event name!" },
              ]}
            >
              <Input />
            </Form.Item>
          </div>
          <div className="flex flex-row">
            <div className="flex-1 mb-4">
              <label className="block mb-1 font-medium">Event Type</label>
              <Form.Item name="event_type" label="Event Type">
                <Select
                  placeholder="Select event type"
                  className="w-full"
                  options={eventTypes}
                />
              </Form.Item>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Event Date</label>
              <Form.Item name="event_date" label="Date">
                {/* <input type="date"/> */}
                <DatePicker
                  value={form.event_date ? dayjs(form.event_date) : undefined}
                  onChange={handleDateChange}
                  className="w-full"
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Event Description</label>
            <Form.Item name="event_description" label="Description">
              <Input />
            </Form.Item>
          </div>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
}
