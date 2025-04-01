import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, CheckCircle, XCircle } from 'lucide-react';

interface AttendanceRecord {
  date: string;
  present: number;
  absent: number;
  total: number;
}

const AttendanceTracking = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([
    {
      date: new Date().toISOString().split('T')[0],
      present: 45,
      absent: 5,
      total: 50
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Attendance Tracking</h2>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent border rounded-md px-3 py-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-2xl font-semibold">50</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-6 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Present Today</p>
              <p className="text-2xl font-semibold">45</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-6 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <XCircle className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-sm text-muted-foreground">Absent Today</p>
              <p className="text-2xl font-semibold">5</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="glass p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-4">Attendance History</h3>
        <div className="space-y-4">
          {attendanceData.map((record, index) => (
            <motion.div
              key={record.date}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-lg bg-background/50"
            >
              <div>
                <p className="font-medium">{new Date(record.date).toLocaleDateString()}</p>
                <p className="text-sm text-muted-foreground">
                  {record.present} present, {record.absent} absent
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{((record.present / record.total) * 100).toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Attendance Rate</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracking; 