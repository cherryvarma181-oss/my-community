import React, { useEffect, useState } from 'react';
import { FileText, Download, FileSpreadsheet, CheckCircle2, ShieldAlert, Layers } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import { fetchExecutiveReport } from '../services/api';

export const AdminReports: React.FC = () => {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExecutiveReport()
      .then(setReportData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const exportPDF = () => {
    if (!reportData) return;

    const doc = new jsPDF();
    const generatedAt = new Date().toLocaleString();

    // Title
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42); // Navy
    doc.text('APSMART – Bus Route Utilisation Survey Report', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`APSRTC Smart City Transport Analytics | Generated: ${generatedAt}`, 14, 26);
    doc.text('Problem Statement ID: PS050 | Domain: Smart City Bus Transport', 14, 31);

    // Summary Box
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(248, 250, 252);
    doc.rect(14, 36, 182, 28, 'FD');

    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`Total Routes: ${reportData.summary.totalRoutes}   |   Active Buses: ${reportData.summary.activeBuses}   |   Total Stops: ${reportData.summary.totalStops}`, 18, 44);
    doc.text(`Total Surveyed Pax: ${reportData.summary.totalPassengers.toLocaleString()}   |   Under-Served Zones: ${reportData.summary.underservedAreasCount}`, 18, 51);
    doc.text(`Active Recommendations: ${reportData.summary.recommendationsCount}   |   Survey Methodology: Field Enumeration`, 18, 58);

    // Section 1: Route Utilisation Table
    doc.setFontSize(12);
    doc.text('1. Route Utilisation Analysis', 14, 72);

    const routeRows = reportData.routeUtilisations.map((u: any) => [
      `Route ${u.routeNumber}`,
      u.routeName,
      u.totalPassengers,
      u.avgPassengersPerTrip,
      `${u.peakHourUtilisationPercent}%`,
      `${u.utilisationScore}%`,
      u.demandCategory
    ]);

    autoTable(doc, {
      startY: 76,
      head: [['Route', 'Corridor Name', 'Total Pax', 'Avg/Trip', 'Peak %', 'Score %', 'Category']],
      body: routeRows,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] }
    });

    // Section 2: Under-served Areas
    const currentY = (doc as any).lastAutoTable.finalY + 12;
    doc.setFontSize(12);
    doc.text('2. Detected Under-Served Areas Diagnostics', 14, currentY);

    const underservedRows = reportData.underservedAreas.map((a: any) => [
      a.areaName,
      a.demandLevel,
      `${a.unmetDemandPaxHr} pax/h`,
      `${a.distanceToStopKm} km`,
      `${a.avgBusFrequencyMins} mins`,
      a.classificationReason
    ]);

    autoTable(doc, {
      startY: currentY + 4,
      head: [['Area Name', 'Level', 'Unmet Demand', 'Stop Distance', 'Bus Headway', 'Reason']],
      body: underservedRows,
      theme: 'grid',
      headStyles: { fillColor: [225, 29, 72] }
    });

    // Section 3: Recommendations
    const currentY2 = (doc as any).lastAutoTable.finalY + 12;
    doc.setFontSize(12);
    doc.text('3. Data-Driven Route Change Recommendations', 14, currentY2);

    const recRows = reportData.recommendations.map((r: any) => [
      r.targetAreaOrRoute,
      r.title,
      r.recommendationType,
      `${r.confidencePercent}%`,
      r.status
    ]);

    autoTable(doc, {
      startY: currentY2 + 4,
      head: [['Target Route / Area', 'Recommendation Title', 'Type', 'Confidence', 'Status']],
      body: recRows,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] }
    });

    doc.save('APSMART_Bus_Route_Utilisation_Report.pdf');
  };

  const exportCSV = () => {
    if (!reportData) return;

    const dataToExport = reportData.routeUtilisations.map((u: any) => ({
      RouteNumber: u.routeNumber,
      RouteName: u.routeName,
      TotalPassengers: u.totalPassengers,
      AvgPassengersPerTrip: u.avgPassengersPerTrip,
      PeakPassengers: u.peakPassengers,
      PeakHourUtilisationPercent: u.peakHourUtilisationPercent,
      HighDemandSection: u.highDemandSections,
      LowDemandSection: u.lowDemandSections,
      UtilisationScorePercent: u.utilisationScore,
      DemandCategory: u.demandCategory
    }));

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'APSMART_Route_Utilisation_Data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <FileText className="w-6 h-6 text-cyan-400" />
            <span>Executive Report Generator</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate and export official "Bus Route Utilisation Survey & Recommendation Report" for Transport Authority.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={exportCSV}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs border border-slate-700 rounded-xl flex items-center space-x-1.5 transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={exportPDF}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center space-x-1.5 transition"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Generating report data preview...</div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
          
          {/* Executive Summary Card */}
          <div className="border border-slate-800 bg-slate-950 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-xl font-extrabold text-white">Executive Summary</h2>
              <span className="text-xs font-mono text-cyan-400">OFFICIAL REPORT PREVIEW</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <p className="text-slate-400">Total City Routes</p>
                <p className="text-lg font-bold text-white">{reportData.summary.totalRoutes}</p>
              </div>
              <div>
                <p className="text-slate-400">Surveyed Passengers</p>
                <p className="text-lg font-bold text-white">{reportData.summary.totalPassengers.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-400">Under-Served Zones</p>
                <p className="text-lg font-bold text-rose-400">{reportData.summary.underservedAreasCount}</p>
              </div>
              <div>
                <p className="text-slate-400">Recommendations</p>
                <p className="text-lg font-bold text-emerald-400">{reportData.summary.recommendationsCount}</p>
              </div>
            </div>
          </div>

          {/* Section 1 Preview */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-base">1. Route Utilisation Analysis</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Route</th>
                    <th className="p-3">Corridor</th>
                    <th className="p-3 text-center">Total Pax</th>
                    <th className="p-3 text-center">Peak Hour %</th>
                    <th className="p-3 text-center">Utilisation Score</th>
                    <th className="p-3 text-center">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {reportData.routeUtilisations.map((u: any) => (
                    <tr key={u.routeId}>
                      <td className="p-3 font-bold text-white">Route {u.routeNumber}</td>
                      <td className="p-3">{u.routeName}</td>
                      <td className="p-3 text-center font-bold text-white">{u.totalPassengers}</td>
                      <td className="p-3 text-center font-bold text-cyan-400">{u.peakHourUtilisationPercent}%</td>
                      <td className="p-3 text-center font-extrabold text-white">{u.utilisationScore}%</td>
                      <td className="p-3 text-center font-bold">{u.demandCategory}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
