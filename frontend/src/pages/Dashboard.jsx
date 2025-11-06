import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import { FaUserCircle } from "react-icons/fa";
export default function Dashboard() {
  const navigate = useNavigate();
  // const [leavesOpen, setLeavesOpen] = useState(false);
  // const [projectOpen, setProjectOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [users, setUsers] = useState([]);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [completeratingCount, setCompleteratingount] = useState(0);
  const dropdownRef = useRef(null);
  const [loginUser, setLoginUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setLoginUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing user:", err);
      }
    }
  }, []);

  const [token] = useState(localStorage.getItem("token"));

  const getTechnicianNames = (technicianIds) => {
    if (!Array.isArray(technicianIds) || technicianIds.length === 0)
      return "N/A";
    return technicianIds
      .map((id) => users.find((u) => u._id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  const fetchLogs = async () => {
    try {
      const [logsRes, ratingRes, userRes] = await Promise.all([
        axios.get("http://localhost:3000/api/logEntries", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:3000/api/ratings", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:3000/api/auth/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setLogs(logsRes.data);
      setRatings(ratingRes.data);
      setUsers(userRes.data);

      if (ratingRes.data.length > 0) {
        const total = ratingRes.data.reduce(
          (sum, r) => sum + (r.rating_value || 0),
          0
        );
        setAvgRating((total / ratingRes.data.length).toFixed(1));
      }

      const ratedLogIds = ratingRes.data.map((r) => r.log_id);
      setPendingCount(
        logsRes.data.filter((log) => !ratedLogIds.includes(log._id)).length
      );
      setCompleteratingount(
        logsRes.data.filter((log) => ratedLogIds.includes(log._id)).length
      );
    } catch (err) {
      console.error(err);
      alert("Failed to fetch data");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchLogs();
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserInfo(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // const exportExcel = async () => {
  //   if (!logs || logs.length === 0) {
  //     alert("No logs available to export!");
  //     return;
  //   }

  //   const wb = new ExcelJS.Workbook();
  //   const ws = wb.addWorksheet("Technician Logs", {
  //     properties: { defaultRowHeight: 25 },
  //     pageSetup: { showGridLines: false }
  //   });

  //   ws.views = [{ state: "normal", showGridLines: false }];

  //   const border = {
  //     top: { style: "thin" },
  //     left: { style: "thin" },
  //     bottom: { style: "thin" },
  //     right: { style: "thin" },
  //   };

  //   let rowIndex = 1;

  //   const techLogs = {};
  //   logs.forEach((log) => {
  //     const techName = getTechnicianNames(log.technicians);
  //     if (!techLogs[techName]) techLogs[techName] = [];
  //     techLogs[techName].push(log);
  //   });

  //   for (const tech in techLogs) {
  //     techLogs[tech].forEach((log) => {
  //       const ratingObj = ratings.find((r) => r.log_id === log._id) || {};
  //       const rating = ratingObj.rating_value || "-";
  //       const feedback = ratingObj.feedback || "Good";

  //       // === Technician Heading ===
  //       ws.mergeCells(`A${rowIndex}:C${rowIndex}`);
  //       const heading = ws.getCell(`A${rowIndex}`);
  //       heading.value = tech; 
  //       heading.alignment = { horizontal: "center", vertical: "middle" };
  //       heading.font = { bold: true, size: 18 };
  //       rowIndex += 2;

  //       // === Row 1: Date + Rating ===
  //       ws.getCell(`A${rowIndex}`).value = "Date";
  //       ws.getCell(`B${rowIndex}`).value = new Date(log.date_time).toLocaleDateString();
  //       ws.getCell(`C${rowIndex}`).value = "Rating";
  //       ws.getCell(`D${rowIndex}`).value = rating;
  //       ws.getRow(rowIndex).eachCell((cell) => {
  //         cell.border = border;
  //         cell.alignment = { vertical: "middle", horizontal: "left" };
  //       });
  //       rowIndex++;

  //       // === Row 2: Project Name ===
  //       ws.getCell(`A${rowIndex}`).value = "Project Name";
  //       ws.mergeCells(`B${rowIndex}:D${rowIndex}`);
  //       ws.getCell(`B${rowIndex}`).value = log.project_name || "N/A";
  //       ws.getRow(rowIndex).eachCell((cell) => {
  //         cell.border = border;
  //         cell.alignment = { vertical: "middle", horizontal: "left" };
  //       });
  //       rowIndex++;

  //       // === Row 3: Task Type ===
  //       ws.getCell(`A${rowIndex}`).value = "Task Type";
  //       ws.getCell(`B${rowIndex}`).value = log.task_type || "N/A";
  //       // ws.mergeCells(`C${rowIndex}:D${rowIndex}`);
  //       ws.getCell(`C${rowIndex}`).value = "Related Ticket";
  //       ws.getCell(`D${rowIndex}`).value = log.related_ticket || "";
  //       ws.getRow(rowIndex).eachCell((cell) => {
  //         cell.border = border;
  //         cell.alignment = { vertical: "middle", horizontal: "left" };
  //       });
  //       rowIndex++;

  //       // === Row 4: Description ===
  //       ws.getCell(`A${rowIndex}`).value = "Description";
  //       ws.mergeCells(`B${rowIndex}:D${rowIndex}`);
  //       ws.getCell(`B${rowIndex}`).value = log.description || "N/A";
  //       ws.getRow(rowIndex).eachCell((cell) => {
  //         cell.border = border;
  //         cell.alignment = { vertical: "top", wrapText: true };
  //       });
  //       rowIndex++;

  //       // === Row 5: Feedback ===
  //       ws.getCell(`A${rowIndex}`).value = "Feedback";
  //       ws.mergeCells(`B${rowIndex}:D${rowIndex}`);
  //       ws.getCell(`B${rowIndex}`).value = feedback;
  //       ws.getRow(rowIndex).eachCell((cell) => {
  //         cell.border = border;
  //         cell.alignment = { vertical: "middle", horizontal: "left" };
  //       });

  //       rowIndex += 3; 
  //     });
  //   }

  //   ws.columns = [
  //     { width: 18 },
  //     { width: 22 },
  //     { width: 18 },
  //     { width: 18 },
  //     { width: 18 },
  //     { width: 10 },
  //     { width: 10 },
  //   ];

  //   const buffer = await wb.xlsx.writeBuffer();
  //   saveAs(new Blob([buffer]), "technician_log_report.xlsx");
  // };

  const exportExcel = async () => {
  if (!logs || logs.length === 0) {
    alert("No logs available to export!");
    return;
  }

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Technician Logs", {
    properties: { defaultRowHeight: 25 },
    pageSetup: { showGridLines: false },
  });

  ws.views = [{ state: "normal", showGridLines: false }];

  const border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  let rowIndex = 1;

  const techLogs = {};
  logs.forEach((log) => {
    const techName = getTechnicianNames(log.technicians);
    if (!techLogs[techName]) techLogs[techName] = [];
    techLogs[techName].push(log);
  });

  for (const tech in techLogs) {
    const logsForTech = techLogs[tech];
    let totalTasks = 0;
    let totalRating = 0;

    ws.mergeCells(`A${rowIndex}:D${rowIndex}`);
    const heading = ws.getCell(`A${rowIndex}`);
    heading.value = tech;
    heading.alignment = { horizontal: "center", vertical: "middle" };
    heading.font = { bold: true, size: 18 };
    rowIndex += 2;

    logsForTech.forEach((log, index) => {
      const logNumber = index + 1;
      totalTasks++;
      const ratingObj = ratings.find((r) => r.log_id === log._id) || {};
      const rating = parseInt(ratingObj.rating_value) || 0;
      const feedback = ratingObj.feedback || "Good";
      totalRating += rating;

      ws.mergeCells(`A${rowIndex}:D${rowIndex}`);
      const numCell = ws.getCell(`A${rowIndex}`);
      numCell.value = `#${logNumber}`;
      numCell.font = { bold: true, size: 12 };
      numCell.alignment = { horizontal: "left", vertical: "middle" };
      rowIndex++;

      ws.getCell(`A${rowIndex}`).value = "Date";
      ws.getCell(`B${rowIndex}`).value = new Date(log.date_time).toLocaleDateString();
      ws.getCell(`C${rowIndex}`).value = "Rating";
      ws.getCell(`D${rowIndex}`).value = rating || "-";
      ws.getRow(rowIndex).eachCell((cell) => {
        cell.border = border;
        cell.alignment = { vertical: "middle", horizontal: "left" };
      });
      rowIndex++;

      ws.getCell(`A${rowIndex}`).value = "Project Name";
      ws.mergeCells(`B${rowIndex}:D${rowIndex}`);
      ws.getCell(`B${rowIndex}`).value = log.project_name || "N/A";
      ws.getRow(rowIndex).eachCell((cell) => {
        cell.border = border;
        cell.alignment = { vertical: "middle", horizontal: "left" };
      });
      rowIndex++;

      ws.getCell(`A${rowIndex}`).value = "Task Type";
      ws.getCell(`B${rowIndex}`).value = log.task_type || "N/A";
      ws.getCell(`C${rowIndex}`).value = "Related Ticket";
      ws.getCell(`D${rowIndex}`).value = log.related_ticket || "";
      ws.getRow(rowIndex).eachCell((cell) => {
        cell.border = border;
        cell.alignment = { vertical: "middle", horizontal: "left" };
      });
      rowIndex++;

      ws.getCell(`A${rowIndex}`).value = "Description";
      ws.mergeCells(`B${rowIndex}:D${rowIndex}`);
      ws.getCell(`B${rowIndex}`).value = log.description || "N/A";
      ws.getRow(rowIndex).eachCell((cell) => {
        cell.border = border;
        cell.alignment = { vertical: "top", wrapText: true };
      });
      rowIndex++;

      ws.getCell(`A${rowIndex}`).value = "Feedback";
      ws.mergeCells(`B${rowIndex}:D${rowIndex}`);
      ws.getCell(`B${rowIndex}`).value = feedback;
      ws.getRow(rowIndex).eachCell((cell) => {
        cell.border = border;
        cell.alignment = { vertical: "middle", horizontal: "left" };
      });

      if (index !== logsForTech.length - 1) {
        rowIndex++;
      } else {
        rowIndex++;
      }
    });

    const avgPerformance = totalTasks > 0 ? ((totalRating / (totalTasks * 5)) * 100).toFixed(2) + "%" : "N/A";

    ws.mergeCells(`A${rowIndex}:D${rowIndex}`);
    const summaryTitle = ws.getCell(`A${rowIndex}`);
    summaryTitle.value = `${tech} Summary`;
    summaryTitle.font = { bold: true, size: 14 };
    summaryTitle.alignment = { horizontal: "center", vertical: "middle" };
    rowIndex++;

    ws.getCell(`A${rowIndex}`).value = "Total Tasks Performed";
    ws.getCell(`B${rowIndex}`).value = totalTasks;
    ws.getCell(`C${rowIndex}`).value = "Total Rating";
    ws.getCell(`D${rowIndex}`).value = totalRating;
    ws.getRow(rowIndex).eachCell((cell) => {
      cell.border = border;
      cell.alignment = { vertical: "middle", horizontal: "left" };
    });
    rowIndex++;

    ws.getCell(`A${rowIndex}`).value = "Performance (%)";
    ws.mergeCells(`B${rowIndex}:D${rowIndex}`);
    ws.getCell(`B${rowIndex}`).value = avgPerformance;
    ws.getRow(rowIndex).eachCell((cell) => {
      cell.border = border;
      cell.font = { bold: true };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    rowIndex += 2;
  }

  ws.columns = [
    { width: 18 },
    { width: 22 },
    { width: 18 },
    { width: 18 },
    { width: 18 },
  ];

  const buffer = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "technician_log_report.xlsx");
};

// const exportExcel = async () => {
//   if (!logs || logs.length === 0) {
//     alert("No logs available to export!");
//     return;
//   }

//   const wb = new ExcelJS.Workbook();
//   const ws = wb.addWorksheet("Technician Logs", {
//     properties: { defaultRowHeight: 25 },
//     pageSetup: { showGridLines: false },
//   });

//   ws.views = [{ state: "normal", showGridLines: false }];

//   const border = {
//     top: { style: "thin" },
//     left: { style: "thin" },
//     bottom: { style: "thin" },
//     right: { style: "thin" },
//   };

//   let rowIndex = 1;

//   // === Group logs by technician ===
//   const techLogs = {};
//   logs.forEach((log) => {
//     const techName = getTechnicianNames(log.technicians);
//     if (!techLogs[techName]) techLogs[techName] = [];
//     techLogs[techName].push(log);
//   });

//   // === Loop through each technician ===
//   for (const tech in techLogs) {
//     const logsForTech = techLogs[tech];
//     let totalTasks = 0;
//     let totalRating = 0;

//     // === Technician Heading ===
//     ws.mergeCells(`A${rowIndex}:C${rowIndex}`);
//     const heading = ws.getCell(`A${rowIndex}`);
//     heading.value = tech;
//     heading.alignment = { horizontal: "center", vertical: "middle" };
//     heading.font = { bold: true, size: 18 };
//     rowIndex += 2;

//     // === All logs for this technician ===
//     logsForTech.forEach((log) => {
//       totalTasks++;
//       const ratingObj = ratings.find((r) => r.log_id === log._id) || {};
//       const rating = parseInt(ratingObj.rating_value) || 0;
//       const feedback = ratingObj.feedback || "Good";
//       totalRating += rating;

//       // === Row 1: Date + Rating ===
//       ws.getCell(`A${rowIndex}`).value = "Date";
//       ws.getCell(`B${rowIndex}`).value = new Date(log.date_time).toLocaleDateString();
//       ws.getCell(`C${rowIndex}`).value = "Rating";
//       ws.getCell(`D${rowIndex}`).value = rating || "-";
//       ws.getRow(rowIndex).eachCell((cell) => {
//         cell.border = border;
//         cell.alignment = { vertical: "middle", horizontal: "left" };
//       });
//       rowIndex++;

//       // === Row 2: Project Name ===
//       ws.getCell(`A${rowIndex}`).value = "Project Name";
//       ws.mergeCells(`B${rowIndex}:D${rowIndex}`);
//       ws.getCell(`B${rowIndex}`).value = log.project_name || "N/A";
//       ws.getRow(rowIndex).eachCell((cell) => {
//         cell.border = border;
//         cell.alignment = { vertical: "middle", horizontal: "left" };
//       });
//       rowIndex++;

//       // === Row 3: Task Type + Related Ticket ===
//       ws.getCell(`A${rowIndex}`).value = "Task Type";
//       ws.getCell(`B${rowIndex}`).value = log.task_type || "N/A";
//       ws.getCell(`C${rowIndex}`).value = "Related Ticket";
//       ws.getCell(`D${rowIndex}`).value = log.related_ticket || "";
//       ws.getRow(rowIndex).eachCell((cell) => {
//         cell.border = border;
//         cell.alignment = { vertical: "middle", horizontal: "left" };
//       });
//       rowIndex++;

//       // === Row 4: Description ===
//       ws.getCell(`A${rowIndex}`).value = "Description";
//       ws.mergeCells(`B${rowIndex}:D${rowIndex}`);
//       ws.getCell(`B${rowIndex}`).value = log.description || "N/A";
//       ws.getRow(rowIndex).eachCell((cell) => {
//         cell.border = border;
//         cell.alignment = { vertical: "top", wrapText: true };
//       });
//       rowIndex++;

//       // === Row 5: Feedback ===
//       ws.getCell(`A${rowIndex}`).value = "Feedback";
//       ws.mergeCells(`B${rowIndex}:D${rowIndex}`);
//       ws.getCell(`B${rowIndex}`).value = feedback;
//       ws.getRow(rowIndex).eachCell((cell) => {
//         cell.border = border;
//         cell.alignment = { vertical: "middle", horizontal: "left" };
//       });

//       rowIndex += 3;
//     });

//     // === Technician Summary Section ===
//     const avgPerformance =
//       totalTasks > 0 ? ((totalRating / (totalTasks * 5)) * 100).toFixed(2) + "%" : "N/A";

//     ws.mergeCells(`A${rowIndex}:D${rowIndex}`);
//     const summaryTitle = ws.getCell(`A${rowIndex}`);
//     summaryTitle.value = `${tech} Summary`;
//     summaryTitle.font = { bold: true, size: 14 };
//     summaryTitle.alignment = { horizontal: "center", vertical: "middle" };
//     rowIndex++;

//     ws.getCell(`A${rowIndex}`).value = "Total Tasks Performed";
//     ws.getCell(`B${rowIndex}`).value = totalTasks;
//     ws.getCell(`C${rowIndex}`).value = "Total Rating";
//     ws.getCell(`D${rowIndex}`).value = totalRating;
//     ws.getRow(rowIndex).eachCell((cell) => {
//       cell.border = border;
//       cell.alignment = { vertical: "middle", horizontal: "left" };
//     });
//     rowIndex++;

//     ws.getCell(`A${rowIndex}`).value = "Performance (%)";
//     ws.mergeCells(`B${rowIndex}:D${rowIndex}`);
//     ws.getCell(`B${rowIndex}`).value = avgPerformance;
//     ws.getRow(rowIndex).eachCell((cell) => {
//       cell.border = border;
//       cell.font = { bold: true };
//       cell.alignment = { vertical: "middle", horizontal: "center" };
//     });

//     rowIndex += 4;
//   }

//   ws.columns = [
//     { width: 18 },
//     { width: 22 },
//     { width: 18 },
//     { width: 18 },
//     { width: 18 },
//   ];

//   const buffer = await wb.xlsx.writeBuffer();
//   saveAs(new Blob([buffer]), "technician_log_report.xlsx");
// };

const exportPDF = () => {
  if (!logs || logs.length === 0) {
    alert("No logs available to export!");
    return;
  }

  const doc = new jsPDF("p", "mm", "a4");
  let y = 25;
  let page = 1;

  const techLogs = {};
  logs.forEach((log) => {
    const techName = getTechnicianNames(log.technicians);
    if (!techLogs[techName]) techLogs[techName] = [];
    techLogs[techName].push(log);
  });

  const lineHeight = 8;
  const startX = 15;
  const col1Width = 40;
  const col2Width = 130;

  const drawRow = (label, value, height = lineHeight) => {
    doc.rect(startX, y, col1Width, height);
    doc.rect(startX + col1Width, y, col2Width, height);
    doc.setFontSize(11);
    doc.text(label, startX + 2, y + 6);
    doc.text(String(value), startX + col1Width + 2, y + 6, { maxWidth: col2Width - 4 });
    y += height;
  };

  Object.keys(techLogs).forEach((tech, tIndex) => {
    const logsForTech = techLogs[tech];
    let totalRating = 0;
    let totalTasks = logsForTech.length;
    
    if (tIndex > 0) {
      doc.addPage();
      y = 25;
    }

    doc.setFontSize(18);
    doc.text(tech, 105, y, { align: "center" });
    y += 10;

    logsForTech.forEach((log, index) => {
      const ratingObj = ratings.find((r) => r.log_id === log._id);
      const ratingValue = ratingObj?.rating_value ? Number(ratingObj.rating_value) : 0;
      const feedback = ratingObj?.feedback || "Good";
      totalRating += ratingValue;

      if (y > 260) { 
        doc.addPage();
        y = 25;
      }

      doc.setFontSize(13);
      doc.text(`${index + 1}.`, startX - 5, y + 6); 

      const ratingColWidth = 40;
      doc.rect(startX, y, col1Width, lineHeight);
      doc.rect(startX + col1Width, y, col2Width - ratingColWidth, lineHeight);
      doc.rect(startX + col1Width + (col2Width - ratingColWidth), y, ratingColWidth, lineHeight);

      doc.setFontSize(11);
      doc.text("Date", startX + 2, y + 6);
      doc.text(new Date(log.date_time).toLocaleDateString(), startX + col1Width + 2, y + 6);
      doc.text("Rating", startX + col1Width + (col2Width - ratingColWidth) + 2, y + 6);
      doc.text(String(ratingValue), startX + col1Width + (col2Width - ratingColWidth) + 20, y + 6, {
        align: "center",
      });
      y += lineHeight;

      doc.rect(startX, y, col1Width, lineHeight);
      doc.rect(startX + col1Width, y, col2Width, lineHeight);
      doc.text("Project Name", startX + 2, y + 6);
      doc.text(log.project_name || "N/A", startX + col1Width + 2, y + 6);
      y += lineHeight;

      const taskHeight = 10;
      const halfWidth = col2Width / 2;
      doc.rect(startX, y, col1Width, taskHeight);
      doc.rect(startX + col1Width, y, col2Width, taskHeight);
      doc.line(startX + col1Width + halfWidth, y, startX + col1Width + halfWidth, y + taskHeight);
      doc.text("Task Type", startX + 2, y + 6);
      doc.text(log.task_type || "N/A", startX + col1Width + 2, y + 6);
      doc.text(log.related_ticket || "", startX + col1Width + halfWidth + 2, y + 6);
      y += taskHeight;

       drawRow("Description", log.description || "N/A");

      drawRow("Feedback", feedback);
    });

    if (y > 250) {
      doc.addPage();
      y = 25;
    }

    const avgRating = totalTasks > 0 ? (totalRating / totalTasks).toFixed(2) : 0;
    const performance = ((avgRating / 5) * 100).toFixed(1) + "%";

    y += 5;
    doc.setFontSize(13);
    doc.text("Summary", startX, y);
    y += 4;

    doc.setFontSize(11);
    doc.rect(startX, y, col1Width, lineHeight);
    doc.rect(startX + col1Width, y, col2Width, lineHeight);
    doc.text("Total Tasks", startX + 2, y + 6);
    doc.text(String(totalTasks), startX + col1Width + 2, y + 6);
    y += lineHeight;

    doc.rect(startX, y, col1Width, lineHeight);
    doc.rect(startX + col1Width, y, col2Width, lineHeight);
    doc.text("Total Rating", startX + 2, y + 6);
    doc.text(String(totalRating.toFixed(2)), startX + col1Width + 2, y + 6);
    y += lineHeight;

    doc.rect(startX, y, col1Width, lineHeight);
    doc.rect(startX + col1Width, y, col2Width, lineHeight);
    doc.text("Performance %", startX + 2, y + 6);
    doc.text(performance, startX + col1Width + 2, y + 6);
    y += lineHeight + 5;

    doc.setFontSize(10);
    doc.text(`Page ${page}`, 105, 290, { align: "center" });
    page++;
  });

  doc.save("technician_log_report.pdf");
};

  // const exportPDF = () => {
  //   if (logs.length === 0) {
  //     alert("No logs available to export!");
  //     return;
  //   }

  //   const doc = new jsPDF("p", "mm", "a4");
  //   let page = 1;

  //   const techLogs = {};
  //   logs.forEach((log) => {
  //     const techNames = getTechnicianNames(log.technicians);
  //     if (!techLogs[techNames]) techLogs[techNames] = [];
  //     techLogs[techNames].push(log);
  //   });

  //   Object.keys(techLogs).forEach((tech) => {
  //     techLogs[tech].forEach((log, idx) => {
  //       if (idx > 0 || page > 1) doc.addPage();

  //       let y = 25;
  //       const lineHeight = 8;

  //       doc.setFontSize(18);
  //       doc.text(tech, 105, y, { align: "center" });
  //       y += 10;

  //       const startX = 15;
  //       const col1Width = 40;
  //       const col2Width = 130;
  //       const totalWidth = col1Width + col2Width;

  //       const ratingObj = ratings.find((r) => r.log_id === log._id);
  //       const ratingValue = ratingObj?.rating_value || 0;
  //       const feedback = ratingObj?.feedback || "Good";

  //       const drawRow = (label, value, height = lineHeight) => {
  //         doc.rect(startX, y, col1Width, height);
  //         doc.rect(startX + col1Width, y, col2Width, height);
  //         doc.setFontSize(11);
  //         doc.text(label, startX + 2, y + 6);
  //         doc.text(value, startX + col1Width + 2, y + 6);
  //         y += height;
  //       };

  //       const ratingColWidth = 40;
  //       doc.rect(startX, y, col1Width, lineHeight);
  //       doc.rect(startX + col1Width, y, col2Width - ratingColWidth, lineHeight);
  //       doc.rect(startX + col1Width + (col2Width - ratingColWidth), y, ratingColWidth, lineHeight);

  //       doc.setFontSize(11);
  //       doc.text("Date", startX + 2, y + 6);
  //       doc.text(new Date(log.date_time).toLocaleDateString(), startX + col1Width + 2, y + 6);
  //       doc.text("Rating", startX + col1Width + (col2Width - ratingColWidth) + 2, y + 6);
  //       y += lineHeight;

  //       doc.rect(startX, y, col1Width, lineHeight);
  //       doc.rect(startX + col1Width, y, col2Width - ratingColWidth, lineHeight);
  //       doc.rect(startX + col1Width + (col2Width - ratingColWidth), y, ratingColWidth, lineHeight);

  //       doc.text("Project Name", startX + 2, y + 6);
  //       doc.text(log.project_name || "N/A", startX + col1Width + 2, y + 6);
  //       doc.text(String(ratingValue), startX + col1Width + (col2Width - ratingColWidth) + 20, y + 6, {
  //         align: "center",
  //       });
  //       y += lineHeight;

  //       const taskHeight = 10;
  //       doc.rect(startX, y, col1Width, taskHeight); 
  //       doc.rect(startX + col1Width, y, col2Width, taskHeight); 

  //       doc.setFontSize(11);
  //       doc.text("Task Type", startX + 2, y + 6);
        
  //       const taskLeft = log.task_type || "N/A";
  //       const relatedTicket = log.related_ticket || "";

  //       const halfWidth = col2Width / 2;
  //       const leftX = startX + col1Width + 2;
  //       const rightX = startX + col1Width + halfWidth + 2;

  //       doc.text(taskLeft, leftX, y + 6);       
  //       doc.text(relatedTicket, rightX, y + 6); 

  //       doc.line(startX + col1Width + halfWidth, y, startX + col1Width + halfWidth, y + taskHeight);

  //       y += taskHeight;

  //       drawRow("Description", log.description || "N/A");

  //       drawRow("Feedback", feedback);

  //       doc.setFontSize(10);
  //       doc.text(`Page ${page}`, 105, 290, { align: "center" });
  //       page++;
  //     });
  //   });

  //   doc.save("technician_log_report.pdf");
  // };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* <aside className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold">IT Log Book</h1>
        </div>

        <nav className="p-6 space-y-3">
          <Link
            to="/dashboard"
            className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-200"
          >
            Dashboard
          </Link>
        { loginUser?.role === "Viewer" && (
          <Link
            to="/logRating"
            className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-200"
          >
            View logs & Rating
          </Link>
        )}
        { loginUser?.role === "Admin" && (
          <Link
            to="/allUserList"
            className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-200"
          >
            All Users List
          </Link> 
        )}
        { loginUser?.role !== "Viewer" && (
          <button
            onClick={() => setProjectOpen(!projectOpen)}
            className="flex items-center justify-between w-full rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-200"
          >
            <span>Project </span>
            <span>{projectOpen ? "▲" : "▼"}</span>
          </button>
        )}
          {projectOpen && (
            <div className="ml-4 mt-1 space-y-1">
              <Link
                to="/AddProject"
                className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                Add Project
              </Link>
              <Link
                to="/projects/list"
                className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                Project List
              </Link>
            </div>
          )}
         { loginUser?.role !== "Viewer" && (
          <button
            onClick={() => setLeavesOpen(!leavesOpen)}
            className="flex items-center justify-between w-full rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-200"
          >
            <span>Log Entry </span>
            <span>{leavesOpen ? "▲" : "▼"}</span>
          </button>
        )}
          {leavesOpen && (
            <div className="ml-4 mt-1 space-y-1">
            { (loginUser?.role === "Admin" || loginUser?.role === "Technician"  )&& (
              <Link
                to="/logForm/AddLogEntry"
                className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                Add Log Tasks
              </Link>
            )}
            { (loginUser?.role === "Admin" || loginUser?.role === "Technician" || loginUser?.role === "Manager"  )&& (
              <Link
                to="/logForm/LogList"
                className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                Tasks List
              </Link>
            )}
            </div>
          )}
        
          <button
            onClick={handleLogout}
            className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-200"
          >
            Logout
          </button>
        </nav>
      </aside> */}


      <div className="flex-1">
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-700">
              Welcome to the Dashboard
            </h2>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowUserInfo(!showUserInfo)}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                <FaUserCircle size={28} />
                <span className="hidden sm:inline">
                  {loginUser?.name || "User"}
                </span>
              </button>

              {showUserInfo && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 p-4 z-50">
                  <p className="font-semibold text-gray-800">
                    {loginUser?.name || "Guest"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {loginUser?.email || "Not available"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Role: {loginUser?.role || "N/A"}
                  </p>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-red-600 hover:underline text-sm"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-cyan-400 rounded-lg shadow-lg p-4 relative">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-semibold">Number of tasks</h1>
                  <h3 className="text-3xl font-bold">
                    {logs.length > 0 ? logs.length : "0"}
                  </h3>
                </div>
              </div>
               { loginUser?.role !== "Viewer" && (
              <a
                href="logForm/LogList"
                className="absolute bottom-2 right-2 text-white font-semibold hover:underline flex items-center gap-1"
              >
                More info <i className="fa fa-arrow-circle-right"></i>
              </a>)}
            </div>

            <div className="bg-green-400 rounded-lg shadow-lg p-4 relative">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-semibold">Average Rating</h1>
                  <h3 className="text-3xl font-bold">{avgRating}</h3>
                  <p className="mt-2">Based on all feedback</p>
                </div>
              </div>
               { loginUser?.role !== "Viewer" && (
              <a
                href="#"
                className="absolute bottom-2 right-2 text-white font-semibold hover:underline flex items-center gap-1"
              >
                More info <i className="fa fa-arrow-circle-right"></i>
              </a>)}
            </div>

              {(loginUser?.role === "Manager" || loginUser?.role === "Admin") && (
                <div className="bg-yellow-400 rounded-lg shadow-lg p-4 relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-lg font-semibold">
                        Tasks pending rating Notification
                      </h1>
                      <h3 className="text-3xl font-bold">{pendingCount}</h3>
                    </div>
                    <div className="text-4xl opacity-50">
                      <i className="fa fa-shopping-cart"></i>
                    </div>
                  </div>
                  <a
                    href="/logForm/LogList"
                    className="absolute bottom-2 right-2 text-white font-semibold hover:underline flex items-center gap-1"
                  >
                    More info <i className="fa fa-arrow-circle-right"></i>
                  </a>
                </div>
              )}
              {(loginUser?.role === "Technician" || loginUser?.role === "Admin") && (
                <div className="bg-red-400 rounded-lg shadow-lg p-4 relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-lg font-semibold">
                        Tasks Rated Notification
                      </h1>
                      <h3 className="text-3xl font-bold">{completeratingCount}</h3>
                    </div>
                    <div className="text-4xl opacity-50">
                      <i className="fa fa-shopping-cart"></i>
                    </div>
                  </div>
                  <a
                    href="/logForm/LogList"
                    className="absolute bottom-2 right-2 text-white font-semibold hover:underline flex items-center gap-1"
                  >
                    More info <i className="fa fa-arrow-circle-right"></i>
                  </a>
                </div>
              )}

          </div>
          
      {(loginUser?.role == "Manager" || loginUser?.role === "Admin" || loginUser?.role === "Technician") && (
          <div className="mt-10">
            <h1 className="text-xl font-semibold mb-4">Generated Reports</h1>

            <div className="flex gap-4">
              <button
                onClick={exportExcel}
                className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded font-semibold text-white"
              >
                Export CSV
              </button>
              <button
                onClick={exportPDF}
                className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded font-semibold text-white"
              >
                Export PDF
              </button>
            </div>
          </div>
        )}
        </main>
      </div>
    </div>
  );
}